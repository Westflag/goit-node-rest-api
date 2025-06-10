import { readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const contactsPath = join(__dirname, "../db/contacts.json");

async function listContacts() {
  const data = await readFile(contactsPath);
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find(({ id }) => id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => id === contactId);
  if (index === -1) return null;
  const [removedContact] = contacts.splice(index, 1);
  await writeFile(contactsPath, JSON.stringify(contacts));
  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: randomBytes(16).toString("base64url").substring(0, 21),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
}

async function updateContact(contactId, body) {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => id === contactId);
  if (index === -1) return null;
  contacts[index] = {
    ...contacts[index],
    ...body,
  };
  await writeFile(contactsPath, JSON.stringify(contacts));
  return contacts[index];
}

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
