import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  getCategoryEvents,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import {
  idCategoryValidation,
  createCategoryValidation,
  updateCategoryValidation,
} from "../middlewares/validations/categoryValidation.js";
import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

export const router = Router();

router.use(auth);

router.get("/", getCategories);
router.get("/:id/events", idCategoryValidation, validate, getCategoryEvents);
router.get("/:id", idCategoryValidation, validate, getCategoryById);

router.post(
  "/",
  authorizeRoles("ADMIN"),
  createCategoryValidation,
  validate,
  createCategory,
);

router.patch(
  "/:id",
  authorizeRoles("ADMIN"),
  updateCategoryValidation,
  validate,
  updateCategory,
);

router.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  idCategoryValidation,
  validate,
  deleteCategory,
);
