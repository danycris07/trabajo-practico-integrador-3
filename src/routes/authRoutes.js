import express from "express";

import { register, login, logout } from "../controllers/authController.js";

import {
  registerValidation,
  loginValidation,
} from "../middlewares/validations/authValidation.js";

import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";

export const authRouter = express.Router();

authRouter.post("/register", registerValidation, validate, register);
authRouter.post("/login", loginValidation, validate, login);
authRouter.post("/logout", auth, logout);
