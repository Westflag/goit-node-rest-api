import { Contact } from "../models/contacts.js";

async function listContacts() {
  return Contact.findAll();
}

async function getContactById(contactId) {
  return Contact.findByPk(contactId);
}

async function removeContact(contactId) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

async function addContact(body) {
  return await Contact.build(body).save();
}

async function updateContact(contactId, body) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  return await contact.update(body);
}

async function updateStatusContact(contactId, body) {
  return await updateContact(contactId, body);
}

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
