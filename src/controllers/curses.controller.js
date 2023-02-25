'use strict'

const Curses = require('../models/curses.model');
const users = require('../models/user.model');

//Crear Curso
const createCurses = async(req, res) =>{
    const {teacher, assignedCourse, students} = req.body;
    try{
        let curse = await Curses.findOne({assignedCourse});
        if(curse){
            return res.status(400).send({
                message: 'El curso lo da un profesor',
                ok: false,
                curse: curse,
            });
        }

        curse = new Curses({teacher, assignedCourse, students});
        curse = await curse.save();

        res.status(200).send({
            message: `Curso creado correctamente`,
            ok: true,
            cursos: curse,
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            ok: false,
            message: `No se ha creado el curso`,
            error: error,
        })
    }
};

const cursoTeacher = async(req, res) =>{
    if(req.user.rol === "PROFESOR"){
        const {username, assignedCourse} = req.body;
    try{
        let teacher = await users.findOne({username});
        let course = await Curses.findOne({assignedCourse});
        if(!teacher){
            return res.status(404).send({message:'Profesor no existe'})
        }
        if(!course){
            return res.status(404).send({message: 'No existe curso'});
        }

        course.teacher = teacher;
        teacher.course = course;

        await course.save();
        await teacher.save();

        res.status(200).send(course);

    }catch(error){
        throw new Error('Error al actualizar el curso' + error);
    }
    }else{
        return res.status(200).send({message: 'Eres alumno permiso denegado para asignar curso'});
    }
};

//Actualizar Curso
const updateCurse = async(req, res) =>{
    if(req.user.rol === "PROFESOR"){
        try{
            const editCurse = req.body;
            const id = req.params.id;
            const curseModify = Curses.findById(id);
    
            if(!curseModify){
                res.status(400)
                .send({message: 'Este Curso no existe en la base de datos'});
            }else{
                const cursecomplete = await Curses.findByIdAndUpdate(id, editCurse, {
                    new: true,
                });
    
                res
                .status(200)
                .send({message: 'Curso actualizado correctamente', cursecomplete});
            }
        }catch(error){
            throw new Error("Error al actualizar el Curso" + error);
        }
    }else{
        return res.status(200).send({message: 'Eres alumno permiso denegado para asignar curso'});
    }
};

//Eliminar Curso
const deleteCuse = async(req, res) =>{
    if(req.user.rol === "PROFESOR"){
        try{
            const couse = await Curses.findById(req.params.id);
            if(!couse){
                return res.status(404).json({error: "Curso no existente"});
            }

            await users.updateMany(
                {couse: {$in: [couse._id]}},
                {$pull: {couse: couse._id}}
            );

            await couse.remove();
            res.json({message: "Curso eliminado"});

        }catch(error){
            console.log(error);
            res.status(500).json({message: "No se puede eliminar el curso"})
        }
    }else{
        return res.status(200).send({message: 'Eres alumno permiso denegado para asignar curso'})
    }
};

//Listar Curso
const readCurse = async(req, res) =>{
    try{
        const curse = await Curses.find();

        if(!curse){
            res
            .status(400).send({message: "No hay Cursos disponibles"});
        }else{
            res.status(200).json({"Curso encontrados": curse});
        }
    }catch(error){
        throw new Error(error)
    }
};

//Asignación del Estudiante
const assignStuden = async(req, res) => {
    if(req.user.rol === "PROFESOR"){
        try{
            const {username, assignStuden} = req.body;
    
            const user = await users.findOne({username});
    
            const couse = await Curses.findOne({assignStuden});
    
            if(user.couse.includes(couse._id)){
                return res.status(400).json({error: 'El usuario esta inscrito en el curso'});
            }
    
            if(user.couse.length >= 3){
                return res.status(400).json({error: 'El usuario ya esta inscrito en 3 cursos'});
            }
    
            couse.students.push(user._id);
            await couse.save();
    
            user.couse.push(couse._id);
            await user.save();
    
            return res.status(200).json({message: 'El usuario inscrito en el curso'});
        }catch(error){
            console.log(error);
            return res.status(500).json({error: 'Error al inscribir usuario en el curso'});
        }
    }else{
        return res.status(200).send({message: 'Eres alumno permiso denegado para asignar curso'});
    }
};

module.exports = {createCurses, cursoTeacher, updateCurse, deleteCuse, readCurse, assignStuden};