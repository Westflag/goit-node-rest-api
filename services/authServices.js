import { User } from "../models/users.js";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import { v4 } from "uuid";

const SALT_ROUNDS = 10;

async function createUser(email, password) {
  const user = await User.findOne({ where: { email } });
  if (user) return null;
  return await User.build({
    email,
    password: bcrypt.hashSync(password, SALT_ROUNDS),
    avatarurl: gravatar.url(email, null, true),
    verificationtoken: v4(),
  }).save();
}

async function getUserByVerificationToken(verificationToken) {
  return await User.findOne({
    where: { verificationtoken: verificationToken },
  });
}

async function getUserByEmail(email) {
  return await User.findOne({ where: { email } });
}

async function getUserById(userId) {
  return await User.findByPk(userId);
}

async function updateUser(userId, body) {
  const user = await getUserById(userId);
  if (!user) return null;
  return await user.update(body);
}

export default {
  createUser,
  getUserByEmail,
  updateUser,
  getUserById,
  getUserByVerificationToken,
};
