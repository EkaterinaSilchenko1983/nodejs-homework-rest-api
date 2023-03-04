const express = require('express');

const ctrl = require('../../controllers/contacts');

const { validateBody, isValidId } = require('../../middlewares');

const { schemas } = require('../../models/contact');

const router = express.Router();

router.get('/', ctrl.getAll);

router.get('/:id', isValidId, ctrl.getById);

router.post('/', validateBody(schemas.schemaPost), ctrl.addContact);

router.delete('/:id', isValidId, ctrl.deleteContactById);

router.put('/:id', isValidId, validateBody(schemas.schemaPut), ctrl.updateById);

router.patch(
  '/:id/favorite',
  isValidId,
  validateBody(schemas.schemaPatch),
  ctrl.updateFavorite
);

module.exports = router;
