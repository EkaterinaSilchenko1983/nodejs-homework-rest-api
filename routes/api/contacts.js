const express = require('express');

const { isValidObjectId } = require('mongoose');

const { Contact } = require('../../models/contact');

const { schemas } = require('../../models/contact');

const { HttpError } = require('../../helpers');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw HttpError(400, `${id} is not valid id`);
    }

    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = schemas.schemaPost.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndRemove(id);
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.status(200).json({ message: 'Delete success' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const { error } = schemas.schemaPut.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw HttpError(400, `${id} is not valid id`);
    }

    if (!name && !email && !phone) {
      res.status(400).json({ message: 'missing fields' });
    }

    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/favorite', async (req, res, next) => {
  try {
    const { error } = schemas.schemaPatch.validate(req.body);
    if (error) {
      throw HttpError(400, 'missing field favorite');
    }

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw HttpError(400, `${id} is not valid id`);
    }

    // const { favorite } = req.body;
    // if (!req.body) {
    //   res.status(400).json({ message: 'missing field favorite' });
    // }

    const result = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
