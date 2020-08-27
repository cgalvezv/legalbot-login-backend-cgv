const models = require('../models');
const User = models.user;

const duplicateEmail = (request, response, next) => {
    User.findOne({
        email: request.body.email
    })
    .exec((err, user) => {
        if (err) {
            return response.status(500).send({ msg: err });
        }

        if (user) {
            return response.status(400).send({ msg: 'This email is already in use!'})
        }

        next();
    })
}

module.exports = {
    duplicateEmail
}