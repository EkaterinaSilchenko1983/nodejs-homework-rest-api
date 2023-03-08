const express = require('express');

const ctrl = require('../../controllers/auth');

const { validateBody, authenticate } = require('../../middlewares');

const { schemas } = require('../../models/user');

const router = express.Router();

//---register
router.post('/signup', validateBody(schemas.registerSchema), ctrl.signup);
//---signin
router.post('/login', validateBody(schemas.loginSchema), ctrl.login);
//---current
router.get('/current', authenticate, ctrl.getCurrent);
//---logout
router.post('/logout', authenticate, ctrl.logout);
router.patch(
  '/',
  authenticate,
  validateBody(schemas.subscriptionSchema),
  ctrl.updateUser
);

module.exports = router;
