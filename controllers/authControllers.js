import authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const { JWT_SECRET } = process.env;

const prepareUserResponse = (user) => {
  return { email: user.email, subscription: user.subscription };
};

export const createUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authServices.createUser(email, password);

  if (!user) return next(HttpError(409, "Email in use"));

  res.status(201).json({ user: prepareUserResponse(user) });
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await authServices.getUserByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return next(HttpError(401, "Email or password is wrong"));
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
  await authServices.updateUser(user.id, { token });

  res.json({
    token: token,
    user: prepareUserResponse(user),
  });
};

export const logoutUser = async (req, res) => {
  const user = await authServices.getUserById(req.user.id);
  await authServices.updateUser(user.id, { token: null });

  res.status(204).end();
};

export const getUserInfo = async (req, res) => {
  const user = await authServices.getUserById(req.user.id);

  /*Я бачу, що у завданні треба повернути без обгортки user: {}, але в ендпойнті на реєстрацію ця обгортка додається. 
    Я б хотіла повертати однаково форматовані респонси. В будь-якому випадку, якщо робити без обгортки, то res мав би такий вигляд:
    res.json(prepareUserResponse(user)); */
  res.json({ user: prepareUserResponse(user) });
};

export const updateUser = async (req, res) => {
  const user = await authServices.updateUser(req.user.id, req.body);

  res.json({ user: prepareUserResponse(user) });
};
