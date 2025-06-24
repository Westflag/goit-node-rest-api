import { User } from "../models/users.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

async function createUser(email, password) {
  const user = await User.findOne({ where: { email } });
  if (user) return null;
  return await User.build({
    email,
    password: bcrypt.hashSync(password, SALT_ROUNDS),
  }).save();
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
};
