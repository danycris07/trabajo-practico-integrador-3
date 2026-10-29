import express from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import {
  idParamValidation,
  updateUserValidation,
  userExistsValidation,
} from "../middlewares/validations/userValidation.js";

import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

export const userRouter = express.Router();

userRouter.get("/", auth, authorizeRoles("ADMIN"), getUsers);

userRouter.get(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  idParamValidation,
  validate,
  getUserById,
);

userRouter.put(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  idParamValidation,
  userExistsValidation,
  updateUserValidation,
  validate,
  updateUser,
);

userRouter.delete(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  idParamValidation,
  validate,
  deleteUser,
);
