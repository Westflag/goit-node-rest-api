import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string()
    .required()
    .min(8)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .message(
      "Password shoul contain at least 1 lowercase letter, at least 1 uppercase letter, at least 1 digit."
    ),
});

export const updateUserSchema = Joi.object({
  subscription: Joi.string().valid("starter", "business", "pro").required(),
});
