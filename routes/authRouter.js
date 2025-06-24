import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getUserInfo,
  updateUser,
} from "../controllers/authControllers.js";
import validateBody from "../middlewares/validateBody.js";
import validateToken from "../middlewares/validateToken.js";
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

export default authRouter;
