import contactsServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const favorite =
    req.query.favorite === "true"
      ? true
      : req.query.favorite === "false"
      ? false
      : null;
  const contacts = await contactsServices.listContacts(
    req.user.id,
    limit,
    (page - 1) * limit,
    favorite
  );
  res.json(contacts);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsServices.getContactById(id, req.user.id);

  if (!contact) return next(HttpError(404));

  res.json(contact);
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsServices.removeContact(id, req.user.id);

  if (!contact) return next(HttpError(404));

  res.json(contact);
};

export const createContact = async (req, res) => {
  const contact = await contactsServices.addContact({
    ...req.body,
    owner: req.user.id,
  });

  res.status(201).json(contact);
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsServices.updateContact(
    id,
    req.body,
    req.user.id
  );

  if (!contact) return next(HttpError(404));

  res.json(contact);
};

export const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsServices.updateStatusContact(
    id,
    req.body,
    req.user.id
  );

  if (!contact) return next(HttpError(404));

  res.json(contact);
};
