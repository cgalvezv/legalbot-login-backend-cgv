const controller = require('../controllers/auth.controller');
const { duplicateEmail } = require('../middlewares/auth.middleware')

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post('/api/auth/sign_in', controller.sign_in);
  app.post('/api/auth/sign_up', [duplicateEmail],  controller.sign_up);
};