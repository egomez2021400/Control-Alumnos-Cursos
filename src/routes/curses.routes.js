'use strict'

const {Router} = require('express');
const { createCurses, 
        cursoTeacher, 
        updateCurse, 
        deleteCuse, 
        readCurse } = require('../controllers/curses.controller');

const api = Router();

api.post("/create-curse", createCurses);

api.post("/asign-teacher/:assignedCourse/teacher/:username", cursoTeacher);

api.put("/update-curse/:id", updateCurse);

api.delete("/delete-curse/:id", deleteCuse);

api.get("/read-curse", readCurse);

module.exports = api;