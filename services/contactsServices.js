import { Contact } from "../models/contacts.js";

async function listContacts(ownerId, limit, offset, favorite) {
  const whereCondition = favorite !== null ? { favorite } : {};
  return Contact.findAll({
    where: {
      ...whereCondition,
      owner: ownerId,
    },
    limit,
    offset,
  });
}

async function getContactById(contactId) {
  return Contact.findByPk(contactId);
}

async function removeContact(contactId, ownerId) {
  const contact = await Contact.findOne({
    where: { id: contactId, owner: ownerId },
  });
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

async function addContact(body) {
  return await Contact.build(body).save();
}

async function updateContact(contactId, body, ownerId) {
  const contact = await Contact.findOne({
    where: { id: contactId, owner: ownerId },
  });
  if (!contact) return null;
  return await contact.update(body);
}

async function updateStatusContact(contactId, body, ownerId) {
  return await updateContact(contactId, body, ownerId);
}

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
