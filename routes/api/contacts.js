const express = require('express');

const ctrl = require('../../controllers/contacts');

const { validateBody, isValidId, authenticate } = require('../../middlewares');

const { schemas } = require('../../models/contact');

const router = express.Router();

router.get('/', authenticate, ctrl.getAll);

router.get('/:id', authenticate, isValidId, ctrl.getById);

router.post(
  '/',
  authenticate,
  validateBody(schemas.schemaPost),
  ctrl.addContact
);

router.delete('/:id', authenticate, isValidId, ctrl.deleteContactById);

router.put(
  '/:id',
  authenticate,
  isValidId,
  validateBody(schemas.schemaPut),
  ctrl.updateById
);

router.patch(
  '/:id/favorite',
  authenticate,
  isValidId,
  validateBody(schemas.schemaPatch),
  ctrl.updateFavorite
);

module.exports = router;
