'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cursesSchema = Schema({
    teacher: {
        type: Schema.Types.ObjectId, ref: 'users'
    },

    assignedCourse: {
        type: String,
        require: true
    },
    
    students: [{
        type: Schema.Types.ObjectId, ref: 'users'
    }]
});

module.exports = mongoose.model('curses', cursesSchema);