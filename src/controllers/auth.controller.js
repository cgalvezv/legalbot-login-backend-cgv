// Libraries import
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const Joi = require('@hapi/joi')
// auth config import
const auth_config = require('../config/authentication');
// User model import
const models = require('../models');
const User = models.user;
// special character regex import
const special_character_regex = auth_config.special_character_regex
// user schema definition
const user_schema = Joi.object({
    name: Joi.string().min(3).required(),
    lastname: Joi.string(),
    gender: Joi.string().valid('M','F','Other'),
    email: Joi.string().email().required(),
    password: Joi.string().max(8).pattern(special_character_regex)
});
// [Sign up] implementation method
const sign_up = (request, response) => {
    const { error } = user_schema.validate(request.body)
    if (error) {
        return response.status(400).send({  msg: error.details[0].message });
    }
    const user = new User({
        name: request.body.name,
        lastname: request.body.lastname || '',
        gender: request.body.gender,
        email: request.body.email,
        password: bcrypt.hashSync(request.body.password, 8)
    })

    user.save((err, user) => {
        if (err) {
            return response.status(500).send({ msg: err });
        }
        [ access_token, refresh_token ] = getJWTs(user.id);
        response.status(200).send({ 
            msg: 'User was registered successfully!',
            user: getUserJson(user, access_token, refresh_token)
         });
    })
}
// [Sign in] implementation method
const sign_in = (request, response) => {
    User.findOne({
        email: request.body.email
    })
    .exec((err, user) => {
        if (err) {
            response.status(500).send({ msg: err });
            return;
        }

        if (!user) {
            return response.status(404).send({ msg: 'User Not found.' });
        }

        var invalidPassword = !(bcrypt.compareSync(
            request.body.password,
            user.password
        ));

        if (invalidPassword) {
            return response.status(401).send({
                accessToken: null,
                msg: 'Invalid Password'
            });
        }

        [ access_token, refresh_token ] = getJWTs(user.id);

        response.status(200).send(getUserJson(user, access_token, refresh_token));
    })
}
//Init: Private methods
const getUserJson = (user, access_token, refresh_token) => {
    return {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        gender: user.gender,
        email: user.email,
        accessToken: access_token,
        refreshToken: refresh_token
    }
}

const getJWTs = (user_id) =>  {
    const access_token = jwt.sign({ id: user_id }, auth_config.access_token_secret, {
        expiresIn: '24h'
    });

    const refresh_token = jwt.sign({ id: user_id }, auth_config.refresh_token_secret, {
        expiresIn: '1y'
    });

    return [ access_token, refresh_token ];
}
//End: Private methods
module.exports = {
    sign_in,
    sign_up,
}