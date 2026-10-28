import { body, param } from "express-validator";
import { Category } from "../../models/Category.js";

export const idCategoryValidation = [
  param("id").isMongoId().withMessage("El ID de la categoría no es válido"),
];

export const createCategoryValidation = [
  body("name")
    .isString()
    .withMessage("El nombre debe ser texto")
    .bail()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 3 y 50 caracteres")
    .bail()
    .custom(async (name) => {
      const category = await Category.findOne({
        name,
        deleted: false,
      });

      if (category) {
        throw new Error("Ya existe una categoría con ese nombre");
      }

      return true;
    }),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto")
    .bail()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede superar los 500 caracteres"),
];

export const updateCategoryValidation = [
  ...idCategoryValidation,

  body("name")
    .optional()
    .isString()
    .withMessage("El nombre debe ser texto")
    .bail()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 3 y 50 caracteres")
    .bail()
    .custom(async (name, { req }) => {
      const category = await Category.findOne({
        name,
        _id: { $ne: req.params.id },
        deleted: false,
      });

      if (category) {
        throw new Error("Ya existe una categoría con ese nombre");
      }

      return true;
    }),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto")
    .bail()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede superar los 500 caracteres"),
];
