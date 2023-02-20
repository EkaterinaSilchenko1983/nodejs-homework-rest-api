const fs = require('fs/promises');
const { v4 } = require('uuid');

const path = require('path');

const contactsPath = path.join(__dirname, 'contacts.json');
// console.log(contactsPath);

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
};

const getContactById = async contactId => {
  const contacts = await listContacts();

  const contact = contacts.find(item => item.id === contactId.toString());

  if (!contact) {
    return null;
  }
  return contact;
};

const removeContact = async contactId => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactId.toString());

  if (index === -1) {
    return null;
  }
  const [removeContact] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return removeContact;
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = { name, email, phone, id: v4() };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
};

const updateContact = async (id, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === id);
  if (index === -1) {
    return null;
  }
  const contactUpdate = { ...contacts[index], ...body };
  // console.log(contactUpdate);
  const allContacts = contacts.filter(item => item.id !== id);

  await fs.writeFile(
    contactsPath,
    JSON.stringify([...allContacts, contactUpdate], null, 2)
  );
  return contactUpdate;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

// const fs = require("fs/promises");
// const { v4 } = require("uuid");

// const path = require("path");

// const contactsPath = path.join(__dirname, "db/contacts.json");

// const listContacts = async () => {
//   const data = await fs.readFile(contactsPath);
//   const contacts = JSON.parse(data);
//   return contacts;
// };

// const getContactById = async (contactId) => {
//   const contacts = await listContacts();

//   const contact = contacts.find((item) => item.id === contactId.toString());

//   if (!contact) {
//     return null;
//   }
//   return contact;
// };

// const addContact = async ({ name, email, phone }) => {
//   const contacts = await listContacts();
//   const newContact = { name, email, phone, id: v4() };
//   contacts.push(newContact);
//   await fs.writeFile(contactsPath, JSON.stringify(contacts));
//   return newContact;
// };

// const removeContact = async (contactId) => {
//   const contacts = await listContacts();
//   const index = contacts.findIndex((item) => item.id === contactId.toString());

//   if (index === -1) {
//     return null;
//   }
//   const [removeContact] = contacts.splice(index, 1);
//   await fs.writeFile(contactsPath, JSON.stringify(contacts));
//   return removeContact;
// };const fs = require("fs/promises");
// const { v4 } = require("uuid");

// const path = require("path");

// const contactsPath = path.join(__dirname, "db/contacts.json");

// const listContacts = async () => {
//   const data = await fs.readFile(contactsPath);
//   const contacts = JSON.parse(data);
//   return contacts;
// };

// const getContactById = async (contactId) => {
//   const contacts = await listContacts();

//   const contact = contacts.find((item) => item.id === contactId.toString());

//   if (!contact) {
//     return null;
//   }
//   return contact;
// };

// const addContact = async ({ name, email, phone }) => {
//   const contacts = await listContacts();
//   const newContact = { name, email, phone, id: v4() };
//   contacts.push(newContact);
//   await fs.writeFile(contactsPath, JSON.stringify(contacts));
//   return newContact;
// };

// const removeContact = async (contactId) => {
//   const contacts = await listContacts();
//   const index = contacts.findIndex((item) => item.id === contactId.toString());

//   if (index === -1) {
//     return null;
//   }
//   const [removeContact] = contacts.splice(index, 1);
//   await fs.writeFile(contactsPath, JSON.stringify(contacts));
//   return removeContact;
// };
