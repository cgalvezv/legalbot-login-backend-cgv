const mongoose = require('mongoose');
const user = require('./user')
mongoose.Promise = global.Promise;

module.exports = {
    mongoose: mongoose,
    user: user
}