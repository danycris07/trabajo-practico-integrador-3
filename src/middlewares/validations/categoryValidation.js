import { body, param } from "express-validator";
import { Category } from "../../models/Category.js";

export const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la categoría es obligatorio")
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .bail()
    .custom(async (name) => {
      const category = await Category.findOne({ name });
      if (category) {
        throw new Error("Ya existe una categoría con ese nombre");
      }
      return true;
    }),

  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("La descripción debe ser un texto")
    .bail()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede superar los 200 caracteres"),
];

export const updateCategoryValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .bail()
    .custom(async (name, { req }) => {
      const idCategory = req.params.id;
      const category = await Category.findOne({
        name,
        _id: { $ne: idCategory },
      });

      if (category) {
        throw new Error("Ya existe una categoría con ese nombre");
      }

      return true;
    }),

  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("La descripción debe ser un texto")
    .bail()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede superar los 200 caracteres"),
];

export const categoryExistsValidation = [
  param("id")
    .isMongoId()
    .withMessage("El ID de la categoría no es válido")
    .bail()
    .custom(async (id) => {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error("Categoría no encontrada");
      }
      return true;
    }),
];
