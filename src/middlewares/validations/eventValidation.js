import { body, param } from "express-validator";
import mongoose from "mongoose";
import { Event } from "../../models/Event.js";
import { Category } from "../../models/Category.js";

export const idEventValidation = [
  param("id").isMongoId().withMessage("El ID del evento no es válido"),
];

export const createEventValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .bail()
    .isLength({ min: 3, max: 120 })
    .withMessage("El título debe tener entre 3 y 120 caracteres"),

  body("description")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .bail()
    .isLength({ max: 10000 })
    .withMessage("La descripción no puede superar los 10000 caracteres"),

  body("date")
    .notEmpty()
    .withMessage("La fecha es obligatoria")
    .bail()
    .isISO8601()
    .withMessage("La fecha debe tener un formato válido"),

  body("time")
    .notEmpty()
    .withMessage("El horario es obligatorio")
    .bail()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("El horario debe tener el formato HH:mm"),

  body("location")
    .notEmpty()
    .withMessage("La ubicación es obligatoria")
    .bail()
    .isObject()
    .withMessage("La ubicación debe ser un objeto"),

  body("location.name")
    .trim()
    .notEmpty()
    .withMessage("El nombre del lugar es obligatorio"),

  body("location.address")
    .trim()
    .notEmpty()
    .withMessage("La dirección del lugar es obligatoria"),

  body("category")
    .notEmpty()
    .withMessage("La categoría es obligatoria")
    .bail()
    .isMongoId()
    .withMessage("El ID de la categoría no es válido")
    .bail()
    .custom(async (categoryId) => {
      const category = await Category.findOne({
        _id: categoryId,
        deleted: false,
      });

      if (!category) {
        throw new Error("La categoría no existe");
      }

      return true;
    }),

  body("status")
    .optional()
    .isIn(["PROGRAMADO", "CANCELADO", "FINALIZADO"])
    .withMessage("El estado del evento no es válido"),
];

export const updateEventValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El título no puede estar vacío")
    .bail()
    .isLength({ min: 3, max: 120 })
    .withMessage("El título debe tener entre 3 y 120 caracteres"),

  body("description")
    .optional()
    .notEmpty()
    .withMessage("La descripción no puede estar vacía")
    .bail()
    .isLength({ max: 10000 })
    .withMessage("La descripción no puede superar los 10000 caracteres"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("La fecha debe tener un formato válido"),

  body("time")
    .optional()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("El horario debe tener el formato HH:mm"),

  body("location")
    .optional()
    .isObject()
    .withMessage("La ubicación debe ser un objeto"),

  body("location.name")
    .if(body("location").exists())
    .trim()
    .notEmpty()
    .withMessage("El nombre del lugar es obligatorio"),

  body("location.address")
    .if(body("location").exists())
    .trim()
    .notEmpty()
    .withMessage("La dirección del lugar es obligatoria"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("El ID de la categoría no es válido")
    .bail()
    .custom(async (categoryId) => {
      const category = await Category.findOne({
        _id: categoryId,
        deleted: false,
      });

      if (!category) {
        throw new Error("La categoría no existe");
      }

      return true;
    }),

  body("status")
    .optional()
    .isIn(["PROGRAMADO", "CANCELADO", "FINALIZADO"])
    .withMessage("El estado del evento no es válido"),
];

export const eventExistsValidation = [
  param("id")
    .isMongoId()
    .withMessage("El ID del evento no es válido")
    .bail()
    .custom(async (id, { req }) => {
      const event = await Event.findOne({
        _id: id,
        deleted: false,
      });

      if (!event) {
        throw new Error("Evento no encontrado");
      }

      if (
        req.user.role !== "ADMIN" &&
        event.creator.toString() !== req.user.id
      ) {
        throw new Error("No tenés permiso para modificar este evento");
      }

      return true;
    }),
];
