import { body, param } from "express-validator";
import { Event } from "../../models/Event.js";
import { User } from "../../models/User.js";
import { Category } from "../../models/Category.js";

export const createEventValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres")
    .bail()
    .custom(async (title) => {
      const event = await Event.findOne({
        title,
        deletedAt: null,
      });

      if (event) {
        throw new Error("Ya existe un evento con ese título");
      }

      return true;
    }),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .bail()
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),

  body("startDate")
    .notEmpty()
    .withMessage("La fecha de inicio es obligatoria")
    .bail()
    .isISO8601()
    .withMessage("La fecha de inicio debe tener un formato ISO válido"),

  body("endDate")
    .notEmpty()
    .withMessage("La fecha de fin es obligatoria")
    .bail()
    .isISO8601()
    .withMessage("La fecha de fin debe tener un formato ISO válido")
    .bail()
    .custom((endDate, { req }) => {
      const start = new Date(req.body.startDate);
      const end = new Date(endDate);

      if (end <= start) {
        throw new Error(
          "La fecha de fin debe ser posterior a la fecha de inicio",
        );
      }

      return true;
    }),

  body("capacity")
    .notEmpty()
    .withMessage("La capacidad es obligatoria")
    .bail()
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un número entero mayor o igual a 1"),

  body("price")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),

  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("El estado no es válido"),


  body("location")
    .notEmpty()
    .withMessage("La ubicación es obligatoria")
    .bail()
    .isObject()
    .withMessage("La ubicación debe ser un objeto"),

  body("location.venue")
    .trim()
    .notEmpty()
    .withMessage("El lugar (venue) es obligatorio")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),

  body("location.address")
    .trim()
    .notEmpty()
    .withMessage("La dirección es obligatoria")
    .bail()
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),

  body("location.city")
    .trim()
    .notEmpty()
    .withMessage("La ciudad es obligatoria")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),

  body("organizer")
    .notEmpty()
    .withMessage("El organizador es obligatorio")
    .bail()
    .isMongoId()
    .withMessage("El ID del organizador no es válido")
    .bail()
    .custom(async (organizerId) => {
      const user = await User.findOne({
        _id: organizerId,
        deletedAt: null,
      });

      if (!user) {
        throw new Error("El organizador especificado no existe");
      }

      return true;
    }),

  body("categories")
    .optional({ values: "falsy" })
    .isArray()
    .withMessage("Las categorías deben ser un arreglo de IDs")
    .bail()
    .custom(async (categoriesArray) => {
      for (const catId of categoriesArray) {
        if (!catId.match(/^[0-9a-fA-F]{24}$/)) {
          throw new Error(`El ID ${catId} no es un MongoID válido`);
        }

        const category = await Category.findOne({
          _id: catId,
          deletedAt: null,
        });

        if (!category) {
          throw new Error(`La categoría con ID ${catId} no existe`);
        }
      }

      return true;
    }),
];

export const updateEventValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El título no puede estar vacío")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres")
    .bail()
    .custom(async (title, { req }) => {
      const idEvent = req.params.id;
      const event = await Event.findOne({
        title,
        deletedAt: null,
        _id: { $ne: idEvent },
      });

      if (event) {
        throw new Error("Ya existe otro evento con ese título");
      }

      return true;
    }),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La descripción no puede estar vacía")
    .bail()
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("La fecha de inicio debe tener un formato ISO válido"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("La fecha de fin debe tener un formato ISO válido")
    .bail()
    .custom((endDate, { req }) => {
      if (req.body.startDate) {
        const start = new Date(req.body.startDate);
        const end = new Date(endDate);

        if (end <= start) {
          throw new Error(
            "La fecha de fin debe ser posterior a la fecha de inicio",
          );
        }
      }

      return true;
    }),

  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un número entero mayor o igual a 1"),

  body("price")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),

  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("El estado no es válido"),

  body("location")
    .optional()
    .isObject()
    .withMessage("La ubicación debe ser un objeto"),

  body("location.venue")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El lugar no puede estar vacío")
    .bail()
    .isLength({ min: 3, max: 100 }),

  body("location.address")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La dirección no puede estar vacía")
    .bail()
    .isLength({ min: 5, max: 150 }),

  body("location.city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La ciudad no puede estar vacía")
    .bail()
    .isLength({ min: 2, max: 50 }),

  body("organizer")
    .optional()
    .isMongoId()
    .withMessage("El ID del organizador no es válido")
    .bail()
    .custom(async (organizerId) => {
      const user = await User.findOne({
        _id: organizerId,
        deletedAt: null,
      });

      if (!user) {
        throw new Error("El organizador especificado no existe");
      }

      return true;
    }),

  body("categories")
    .optional({ values: "falsy" })
    .isArray()
    .withMessage("Las categorías deben ser un arreglo de IDs")
    .bail()
    .custom(async (categoriesArray) => {
      for (const catId of categoriesArray) {
        if (!catId.match(/^[0-9a-fA-F]{24}$/)) {
          throw new Error(`El ID ${catId} no es un MongoID válido`);
        }

        const category = await Category.findOne({
          _id: catId,
          deletedAt: null,
        });

        if (!category) {
          throw new Error(`La categoría con ID ${catId} no existe`);
        }
      }

      return true;
    }),
];

export const eventExistsValidation = [
  param("id")
    .isMongoId()
    .withMessage("El ID del evento no es válido")
    .bail()
    .custom(async (id) => {
      const event = await Event.findOne({
        _id: id,
        deletedAt: null,
      });

      if (!event) {
        throw new Error("Evento no encontrado");
      }

      return true;
    }),
];
