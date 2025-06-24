import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../middlewares/validateBody.js";
import validateParam from "../middlewares/validateParam.js";
import validateToken from "../middlewares/validateToken.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", validateToken, getAllContacts);

contactsRouter.get("/:id", validateToken, validateParam, getOneContact);

contactsRouter.delete("/:id", validateToken, validateParam, deleteContact);

contactsRouter.post(
  "/",
  validateToken,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  validateToken,
  validateParam,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  validateToken,
  validateParam,
  validateBody(updateContactFavoriteSchema),
  updateStatusContact
);

export default contactsRouter;
