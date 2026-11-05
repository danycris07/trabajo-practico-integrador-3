import Router from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import {
  updateUserValidation,
  userExistsValidation,
} from "../middlewares/validations/userValidation.js";

import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { ownerOrAdminMiddleware } from "../middlewares/ownerOrAdmin.middleware.js";

export const userRouter = Router();

userRouter.get("/", authMiddleware, adminMiddleware, getUsers);

userRouter.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userExistsValidation,
  validate,
  getUserById,
);

userRouter.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userExistsValidation,
  updateUserValidation,
  validate,
  updateUser,
);

userRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userExistsValidation,
  validate,
  deleteUser,
);
