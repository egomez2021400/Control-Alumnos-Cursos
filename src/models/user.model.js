'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
    username: {
        type: String,
        require: true
    },

    age: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true
    },

    carne: {
        type: String,
        require: true
    },

    rol: {
        type: String,
        require: true,
    },

    password: {
        type: String,
        require: true
    },

    curses: [{
        type: Schema.Types.ObjectId, ref: 'curses'
    }]
});

module.exports = mongoose.model('users', UserSchema);