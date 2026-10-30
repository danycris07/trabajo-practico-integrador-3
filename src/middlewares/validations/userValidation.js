import { body, param } from "express-validator";
import { User } from "../../models/User.js";

export const userExistsValidation = [
  param("id")
    .isMongoId()
    .withMessage("El ID del usuario no es válido")
    .bail()
    .custom(async (id) => {
      const user = await User.findOne({
        _id: id,
        deletedAt: null,
      });

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      return true;
    }),
];


export const updateUserValidation = [
  body("username")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario no puede estar vacío")
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage("El nombre de usuario debe tener entre 3 y 20 caracteres")
    .bail()
    .custom(async (username, { req }) => {
      const idUser = req.params.id;
      const user = await User.findOne({
        username,
        deletedAt: null,
        //$ne significa NO ES IGUAL
        _id: { $ne: idUser },
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
      const idUser = req.params.id;
      const user = await User.findOne({
        email,
        deletedAt: null,
        _id: { $ne: idUser },
      });

      if (user) {
        throw new Error("El email ya está registrado");
      }

      return true;
    }),

  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),

  body("role")
    .optional()
    .isIn(["admin", "user"])
    .withMessage("El rol debe ser 'admin' o 'user'"),

  body("profile")
    .optional()
    .isObject()
    .withMessage("El perfil debe ser un objeto"),

  body("profile.firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("profile.lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El apellido no puede estar vacío")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres"),

  body("profile.birthDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("La fecha de nacimiento debe tener un formato válido"),

  body("profile.phone")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("El teléfono debe ser una cadena de texto"),
];
