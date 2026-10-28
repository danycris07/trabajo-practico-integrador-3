import { body, param } from "express-validator";
import { User } from "../../models/User.js";

export const idParamValidation = [
  param("id").isMongoId().withMessage("El ID del usuario no es válido"),
];

export const createUserValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("El nombre de usuario debe tener entre 3 y 30 caracteres")
    .bail()
    .custom(async (username) => {
      const user = await User.findOne({
        username,
        deleted: false,
      });

      if (user) {
        throw new Error("El nombre de usuario ya está registrado");
      }

      return true;
    }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .bail()
    .isEmail()
    .withMessage("El email no es válido")
    .bail()
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({
        email,
        deleted: false,
      });

      if (user) {
        throw new Error("El email ya está registrado");
      }

      return true;
    }),

  body("password")
    .isString()
    .withMessage("La contraseña debe ser un texto")
    .bail()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),

  body("role")
    .optional()
    .isIn(["ADMIN", "USER"])
    .withMessage("El rol debe ser ADMIN o USER"),
];

export const updateUserValidation = [
  body("username")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario no puede estar vacío")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("El nombre de usuario debe tener entre 3 y 30 caracteres")
    .bail()
    .custom(async (username, { req }) => {
      const user = await User.findOne({
        username,
        deleted: false,
        _id: { $ne: req.params.id },
      });

      if (user) {
        throw new Error("El nombre de usuario ya está registrado");
      }

      return true;
    }),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("El email no es válido")
    .bail()
    .normalizeEmail()
    .custom(async (email, { req }) => {
      const user = await User.findOne({
        email,
        deleted: false,
        _id: { $ne: req.params.id },
      });

      if (user) {
        throw new Error("El email ya está registrado");
      }

      return true;
    }),

  body("password")
    .optional()
    .isString()
    .withMessage("La contraseña debe ser un texto")
    .bail()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),

  body("role")
    .optional()
    .isIn(["ADMIN", "USER"])
    .withMessage("El rol debe ser ADMIN o USER"),
];

export const userExistsValidation = [
  param("id")
    .isMongoId()
    .withMessage("El ID del usuario no es válido")
    .bail()
    .custom(async (id) => {
      const user = await User.findOne({
        _id: id,
        deleted: false,
      });

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      return true;
    }),
];
