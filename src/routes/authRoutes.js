import { Router } from "express";
import {
  register,
  login,
  logout,
  getProfile,
} from "../controllers/authController.js";
import {
  registerValidation,
  loginValidation,
} from "../middlewares/validations/authValidation.js";
import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";

export const router = Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/logout", auth, logout);
router.get("/profile", auth, getProfile);
