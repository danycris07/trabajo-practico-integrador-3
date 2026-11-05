import Router from "express";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import {
  createCategoryValidation,
  updateCategoryValidation,
  categoryExistsValidation,
} from "../middlewares/validations/categoryValidation.js";

import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

export const categoryRouter = Router();

categoryRouter.get("/", authMiddleware, getCategories);

categoryRouter.get(
  "/:id",
  authMiddleware,
  categoryExistsValidation,
  validate,
  getCategoryById,
);

categoryRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCategoryValidation,
  validate,
  createCategory,
);

categoryRouter.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryExistsValidation,
  updateCategoryValidation,
  validate,
  updateCategory,
);

categoryRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryExistsValidation,
  validate,
  deleteCategory,
);
