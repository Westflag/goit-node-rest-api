import contactsServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const contacts = await contactsServices.listContacts();
  res.json(contacts);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsServices.getContactById(id);

  if (!contact) return next(HttpError(404));

  res.json(contact);
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsServices.removeContact(id);

  if (!contact) return next(HttpError(404));

  res.json(contact);
};

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;

  const contact = await contactsServices.addContact(name, email, phone);

  if (!contact) return next(HttpError(404));

  res.status(201).json(contact);
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsServices.updateContact(id, req.body);

  if (!contact) return next(HttpError(404));

  res.json(contact);
};
