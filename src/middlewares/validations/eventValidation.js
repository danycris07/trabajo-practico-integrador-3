import { body, param } from "express-validator";
import { Event } from "../../models/Event.js";
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
      const event = await Event.findOne({ title });
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
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("La fecha de inicio debe tener el formato YYYY-MM-DD"),

  body("endDate")
    .notEmpty()
    .withMessage("La fecha de fin es obligatoria")
    .bail()
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("La fecha de fin debe tener el formato YYYY-MM-DD")
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
    .isLength({ min: 3, max: 100 }),

  body("location.address")
    .trim()
    .notEmpty()
    .withMessage("La dirección es obligatoria")
    .bail()
    .isLength({ min: 5, max: 150 }),

  body("location.city")
    .trim()
    .notEmpty()
    .withMessage("La ciudad es obligatoria")
    .bail()
    .isLength({ min: 2, max: 50 }),

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

        const category = await Category.findById(catId);
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
    .bail()
    .custom(async (title, { req }) => {
      const idEvent = req.params.id;
      const event = await Event.findOne({
        title,
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
    .isLength({ min: 20 }),

  body("startDate")
    .optional()
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("La fecha de inicio debe tener el formato YYYY-MM-DD"),

  body("endDate")
    .optional()
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("La fecha de fin debe tener el formato YYYY-MM-DD")
    .bail()
    .custom(async (endDate, { req }) => {
      let start = req.body.startDate;

      if (!start && req.params.id) {
        const event = await Event.findById(req.params.id);
        if (event) start = event.startDate;
      }

      if (start && new Date(endDate) <= new Date(start)) {
        throw new Error(
          "La fecha de fin debe ser posterior a la fecha de inicio",
        );
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
    .bail()
    .isLength({ min: 3, max: 100 }),

  body("location.address")
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .isLength({ min: 5, max: 150 }),

  body("location.city")
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .isLength({ min: 2, max: 50 }),

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

        const category = await Category.findById(catId);
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
      const event = await Event.findById(id);
      if (!event) {
        throw new Error("Evento no encontrado");
      }
      return true;
    }),
];
