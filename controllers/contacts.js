const { Contact } = require('../models/contact');

const { HttpError, ctrlWrapper } = require('../helpers');

const getAll = async (req, res) => {
  const { _id: id } = req.user;

  // console.log(id);
  const owner = { owner: id };
  // console.log(owner.owner);
  const { page = 1, limit = 20, favorite } = req.query;
  // console.log(favorite);

  if (favorite) {
    owner.favorite = favorite;
  }

  // console.log(owner);

  const skip = (page - 1) * limit;
  const result = await Contact.find(owner, '-createdAt -updatedAt', {
    skip,
    limit,
  }).populate('owner', 'email');
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;

  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const addContact = async (req, res) => {
  console.log(req.user);
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });

  res.status(201).json(result);
};

const deleteContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json({ message: 'Delete success' });
};

const updateById = async (req, res) => {
  const { name, email, phone } = req.body;

  const { id } = req.params;

  if (!name && !email && !phone) {
    res.status(400).json({ message: 'missing fields' });
  }

  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;

  const { favorite } = req.body;
  if (!favorite) {
    res.status(400).json({ message: 'missing field favorite' });
  }

  const result = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  updateById: ctrlWrapper(updateById),
  updateFavorite: ctrlWrapper(updateFavorite),
  deleteContactById: ctrlWrapper(deleteContactById),
};
