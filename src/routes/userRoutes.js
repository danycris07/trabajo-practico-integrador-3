import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  idUserValidation,
  updateUserValidation,
} from "../middlewares/validations/userValidation.js";
import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

export const router = Router();

router.use(auth, authorizeRoles("ADMIN"));

router.get("/", getUsers);
router.get("/:id", idUserValidation, validate, getUserById);
router.patch("/:id", updateUserValidation, validate, updateUser);
router.delete("/:id", idUserValidation, validate, deleteUser);
