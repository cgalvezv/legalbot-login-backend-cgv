const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3
    },
    lastname: String,
    gender: {
        type: String,
        enum : ['None','M', 'F'],
        default: 'None'
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        max: 8
    },
});

const User = mongoose.model('User', user_schema);

module.exports = User;