import { body, param } from "express-validator";
import { Category } from "../../models/Category.js";

export const idCategoryValidation = [
  param("id").isMongoId().withMessage("El ID de la categoría no es válido"),
];

export const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la categoría es obligatorio")
    .bail()
    .isLength({ min: 3, max: 80 })
    .withMessage("El nombre debe tener entre 3 y 80 caracteres")
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
    .withMessage("La descripción debe ser un texto")
    .bail()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede superar los 500 caracteres"),
];

export const updateCategoryValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .bail()
    .isLength({ min: 3, max: 80 })
    .withMessage("El nombre debe tener entre 3 y 80 caracteres")
    .bail()
    .custom(async (name, { req }) => {
      const category = await Category.findOne({
        name,
        deleted: false,
        _id: { $ne: req.params.id },
      });

      if (category) {
        throw new Error("Ya existe una categoría con ese nombre");
      }

      return true;
    }),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser un texto")
    .bail()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede superar los 500 caracteres"),
];

export const categoryExistsValidation = [
  param("id")
    .isMongoId()
    .withMessage("El ID de la categoría no es válido")
    .bail()
    .custom(async (id) => {
      const category = await Category.findOne({
        _id: id,
        deleted: false,
      });

      if (!category) {
        throw new Error("Categoría no encontrada");
      }

      return true;
    }),
];
