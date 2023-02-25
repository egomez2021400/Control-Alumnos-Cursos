'use strict'

const {Router} = require('express');
const { createCurses, 
        cursoTeacher, 
        updateCurse, 
        deleteCuse, 
        readCurse, 
        assignStuden} = require('../controllers/curses.controller');
const {validateJWT} = require('../middlewares/validate-jwt');

const api = Router();

api.post("/create-curse", createCurses);

api.post("/asign-teacher/:assignedCourse/teacher/:username", validateJWT, cursoTeacher);

api.put("/update-curse/:id", validateJWT, updateCurse);

api.delete("/delete-curse/:id", validateJWT, deleteCuse);

api.get("/read-curse", readCurse);

api.post("/asign-students", validateJWT, assignStuden);

module.exports = api;