import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getUserInfo,
  updateUser,
  updateAvatar,
} from "../controllers/authControllers.js";
import validateBody from "../middlewares/validateBody.js";
import validateToken from "../middlewares/validateToken.js";
import { upload } from "../middlewares/uploadAvatar.js";
import { createUserSchema, updateUserSchema } from "../schemas/authSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(createUserSchema), createUser);
authRouter.post("/login", validateBody(createUserSchema), loginUser);
authRouter.post("/logout", validateToken, logoutUser);
authRouter.get("/current", validateToken, getUserInfo);
authRouter.patch(
  "/subscription",
  validateToken,
  validateBody(updateUserSchema),
  updateUser
);
authRouter.patch(
  "/avatars",
  validateToken,
  upload.single("avatar"),
  updateAvatar
);

export default authRouter;
