import { body } from "express-validator";
import { User } from "../../models/User.js";

export const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("El nombre debe tener entre 3 y 30 caracteres")
    .bail()
    .custom(async (username) => {
      const user = await User.findOne({
        username,
        deleted: false,
      });

      if (user) {
        throw new Error("El nombre de usuario ya existe");
      }

      return true;
    }),

  body("email")
    .trim()
    .isEmail()
    .withMessage("El correo no es válido")
    .bail()
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({
        email,
        deleted: false,
      });

      if (user) {
        throw new Error("El correo ya está registrado");
      }

      return true;
    }),

  body("password")
    .isString()
    .withMessage("La contraseña debe ser texto")
    .bail()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
];

export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("El correo no es válido")
    .bail()
    .normalizeEmail(),

  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];
