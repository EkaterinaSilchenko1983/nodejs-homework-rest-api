const nodemailer = require('nodemailer');
require('dotenv').config();
const { META_PASS } = process.env;

const nodemailerConfig = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: 'kateryna_silchenko@meta.ua',
    pass: META_PASS,
  },
};
const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async data => {
  try {
    const email = { ...data, from: 'kateryna_silchenko@meta.ua' };
    await transporter.sendMail(email);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
