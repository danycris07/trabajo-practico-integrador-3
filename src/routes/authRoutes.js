import Router from "express";

import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";

import {
  registerValidation,
  loginValidation,
  updateSelfProfileValidation,
} from "../middlewares/validations/authValidation.js";

import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", registerValidation, validate, register);
authRouter.post("/login", loginValidation, validate, login);
authRouter.get("/profile", authMiddleware, getProfile);
authRouter.put(
  "/profile",
  authMiddleware,
  updateSelfProfileValidation,
  validate,
  updateProfile,
);
authRouter.post("/logout", authMiddleware, logout);
