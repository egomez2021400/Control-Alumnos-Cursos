'use strict'

const users = require('../models/user.model');
const Curses = require('../models/curses.model');
const bcrypt = require('bcrypt');
const {generateJWT} = require('../helpers/create-jwt');

//Crear Usuario
const CreateUsers = async(req, res) =>{
    const {username, email, password} = req.body;
    try{
        let user = await users.findOne({email: email});
        if(user){
            return res.status(400).send({
                message: `un usuario ya esta usando el correo ${email}`,
                ok: false,
                user: user,
            });
        } 
        
        user = new users(req.body);

        //Encriptación de password
        const saltos = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, saltos);

        //Guardar Usuarios
        user = await user.save();

        const token = await generateJWT(user.id, user.username, user.email);
        res.status(200).send({
            message: `Usuario correctamente ${username}`,
            ok: true,
            usuario: user,
            token: token,
        });

        res.status(200).send({
            message: `Usuario ${username} creado`,
            ok: true,
            usuario: user,
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            ok: false,
            message: `No se puede crear el usuario: ${username}`,
            error: error,
        })
    }
};

//Actualizar Usuarios
const updateUser = async(req, res) =>{
    if(req.user.rol ==="ALUMNO"){
        try{
            const id = req.params.id;
            const userEdit = {...req.body}
    
            //Encriptar Contraseña
            userEdit.password = userEdit.password
            ? bcrypt.hashSync(userEdit.password, bcrypt.genSaltSync())
            : userEdit.password;
    
            const userComplete = await users.findByIdAndUpdate(id, userEdit, {new: true});
    
            if(userComplete){
                const token = await generateJWT(userComplete.id, userComplete.username, userComplete.email);
                return res
                .status(200)
                .send({message: 'Usuario correctamente actualizado', userComplete, token})
        }else{
            res.status(404).send({message: 'Este usuario no existe en la base de datos, o verifique parametros'});
            }
        }catch(error){
            throw new Error(error);
        }
    }else {
        return res.status(200).send({message: 'Maestro, no tienes autorización de cambiar de perfil'})
    }
};

//Eliminar Usuarios
const deleteUser = async(req, res) =>{
    if(req.user.rol === "ALUMNO"){
        const usersId = req.params.id;
        try{
            const users = await users.findById(usersId);
            if(!users){
                return res.status(404).json({error: "Alumno no encontrado"});
            }

            await Curses.updateMany(
                {students: usersId},
                {$pull: {students: usersId}}
            );

                users.curses = [];

                await user.remove();

        return res.json({message: "Alumno eliminado"});
        }catch(error){
            console.log(error);
            return res.status(500).json({error: "Error"});
        }
    }else{
        return res.status(500).send({message: 'Maestro, no tienes permiso de eliminar alumno'});
    }
};

//Listar Usuarios
const readUser = async(req, res) =>{
    try{
        const user = await users.find();

        if(!user){
            res
            .status(400).send({message: 'No hay usuarios disponibles'});
        }else{
            res
            .status(200).json({"Usuarios encontrados": user});
        }
    }catch(error){
        throw new Error(error)
    }
};

//Inicio de sesión Login
const loginUser = async(req, res) =>{
    const{email, password} = req.body;
    try{
        const user = await users.findOne({email});
        if(!user){
            return res
            .status(400)
            .send({ok: false, message: 'Usuario no existente'});
        };

        const validPassword = bcrypt.compareSync(
            password,
            user.password
        );

        if(!validPassword){
            return res.status(400).send({ok: false, message: 'password incorrecto'});
        };

        const token = await generateJWT(user.id, user.username, user.email);
        res.status(500)
        .json({
            ok: true,
            uId: user.id,
            name: user.username,
            email: user.email,
            token: token,
        });

    }catch(error){
        res.status(500).json({
            ok: false,
            message: 'Usuario no registrado'
        });
    }
};

module.exports = {CreateUsers, updateUser, deleteUser, readUser, loginUser};