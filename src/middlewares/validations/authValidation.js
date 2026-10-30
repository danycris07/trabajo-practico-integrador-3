import { body } from "express-validator";
import { User } from "../../models/User.js";

export const registerValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio")
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage("El nombre de usuario debe tener entre 3 y 20 caracteres")
    .bail()
    .custom(async (username) => {
      const user = await User.findOne({
        username,
        deletedAt: null,
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
        deletedAt: null,
      });

      if (user) {
        throw new Error("El email ya está registrado");
      }

      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .bail()
    .isString()
    .withMessage("La contraseña debe ser un texto")
    .bail()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),

  body("profile")
    .notEmpty()
    .withMessage("El perfil es obligatorio")
    .bail()
    .isObject()
    .withMessage("El perfil debe ser un objeto"),

  body("profile.firstName")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("profile.lastName")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres"),

  body("profile.birthDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage(
      "La fecha de nacimiento debe tener un formato de fecha válido",
    ),

  body("profile.phone")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("El teléfono debe ser una cadena de texto"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .bail()
    .isEmail()
    .withMessage("El email no es válido")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

export const updateSelfProfileValidation = [
  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El apellido no puede estar vacío")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres"),

  body("birthDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("La fecha de nacimiento debe tener un formato válido"),

  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("El teléfono debe ser una cadena de texto"),
];
