import express from "express";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import {
  idCategoryValidation,
  createCategoryValidation,
  updateCategoryValidation,
  categoryExistsValidation,
} from "../middlewares/validations/categoryValidation.js";

import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

export const categoryRouter = express.Router();

categoryRouter.get("/", auth, getCategories);

categoryRouter.get(
  "/:id",
  auth,
  idCategoryValidation,
  validate,
  getCategoryById,
);

categoryRouter.post(
  "/",
  auth,
  authorizeRoles("ADMIN"),
  createCategoryValidation,
  validate,
  createCategory,
);

categoryRouter.patch(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  idCategoryValidation,
  categoryExistsValidation,
  updateCategoryValidation,
  validate,
  updateCategory,
);

categoryRouter.delete(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  idCategoryValidation,
  validate,
  deleteCategory,
);
