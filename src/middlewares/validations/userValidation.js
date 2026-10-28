import { body, param } from "express-validator";
import { User } from "../../models/User.js";

export const idUserValidation = [
  param("id").isMongoId().withMessage("El ID del usuario no es válido"),
];

export const updateUserValidation = [
  ...idUserValidation,

  body("username")
    .optional()
    .isString()
    .withMessage("El nombre debe ser texto")
    .bail()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("El nombre debe tener entre 3 y 30 caracteres")
    .bail()
    .custom(async (username, { req }) => {
      const user = await User.findOne({
        username,
        _id: { $ne: req.params.id },
        deleted: false,
      });

      if (user) {
        throw new Error("El nombre de usuario ya existe");
      }

      return true;
    }),

  body("email")
    .optional()
    .isEmail()
    .withMessage("El correo no es válido")
    .bail()
    .normalizeEmail()
    .custom(async (email, { req }) => {
      const user = await User.findOne({
        email,
        _id: { $ne: req.params.id },
        deleted: false,
      });

      if (user) {
        throw new Error("El correo ya está registrado");
      }

      return true;
    }),

  body("password")
    .optional()
    .isString()
    .withMessage("La contraseña debe ser texto")
    .bail()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
];
