import { body } from "express-validator";
import { User } from "../../models/User.js";

export const registerValidation = [
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
