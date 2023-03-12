const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Jimp = require('jimp');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');

const { User } = require('../models/user');

const { HttpError, ctrlWrapper } = require('../helpers');

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    email: newUser.email,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }); //--перевіряємо чи є в базі user
  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password invalid');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  // console.log(req.user);
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: '' });

  res.json({
    message: 'logout success',
  });
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  console.log(req.body);

  const { subscription } = req.body;
  if (!subscription) {
    res.status(400).json({ message: 'missing field favorite' });
  }

  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  // console.log(req.file);
  const filename = `${_id}_${originalname}`;

  try {
    const resultUpload = path.join(avatarsDir, filename);
    const resizedImage = await Jimp.read(tempUpload);
    await resizedImage.resize(250, 250);
    await resizedImage.writeAsync(tempUpload);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join('public', 'avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (error) {
    await fs.unlink(tempUpload);
    throw error;
  }
};

module.exports = {
  signup: ctrlWrapper(signup),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUser: ctrlWrapper(updateUser),
  updateAvatar: ctrlWrapper(updateAvatar),
};
