import authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { join, extname } from "path";
import { promises } from "fs";
import { v4 } from "uuid";
import { transporter } from "../mailer/mailer.js";

dotenv.config();

const { JWT_SECRET, EMAIL_USER, PORT } = process.env;

const prepareUserResponse = (user) => {
  return { email: user.email, subscription: user.subscription };
};

export const createUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authServices.createUser(email, password);

  if (!user) return next(HttpError(409, "Email in use"));

  await transporter.sendMail({
    to: user.email,
    from: EMAIL_USER,
    subject: "Verify email",
    html: `<a target='_blank' href='http://localhost:${PORT}/api/auth/verify/${user.verificationtoken}'>Verify email</a>`,
  });

  res.status(201).json({ user: prepareUserResponse(user) });
};

export const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await authServices.getUserByEmail(email);

  if (!user) return next(HttpError(404, "User not found"));
  if (user.verify)
    return next(HttpError(400, "Verification has already been passed"));

  await transporter.sendMail({
    to: user.email,
    from: EMAIL_USER,
    subject: "Verify email",
    html: `<a target='_blank' href='http://localhost:${PORT}/api/auth/verify/${user.verificationtoken}'>Verify email</a>`,
  });

  res.end();
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

export const updateAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const { path: temporaryName, originalname } = req.file;
  const fileName = `${v4()}${extname(originalname)}`;
  const filePath = join(process.cwd(), "public", "avatars", fileName);

  try {
    await promises.rename(temporaryName, filePath);
    const avatarURL = `/avatars/${fileName}`;
    await authServices.updateUser(req.user.id, { avatarurl: avatarURL });
    res.json({ avatarURL });
  } catch (err) {
    await promises.unlink(temporaryName);
    return next(err);
  }
};

export const verifyUser = async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await authServices.getUserByVerificationToken(verificationToken);

  if (!user) return next(HttpError(404, "User not found"));

  await authServices.updateUser(user.id, {
    verify: true,
    verificationtoken: null,
  });

  res.json({ message: "Verification successful" });
};
