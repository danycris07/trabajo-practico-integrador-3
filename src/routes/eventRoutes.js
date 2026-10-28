import express from "express";

import {
  getEvents,
  getEventById,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import {
  idEventValidation,
  createEventValidation,
  updateEventValidation,
  eventExistsValidation,
} from "../middlewares/validations/eventValidation.js";

import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";

export const eventRouter = express.Router();

eventRouter.get("/", auth, getEvents);

eventRouter.get("/my-events", auth, getMyEvents);

eventRouter.get("/:id", auth, idEventValidation, validate, getEventById);

eventRouter.post("/", auth, createEventValidation, validate, createEvent);

eventRouter.patch(
  "/:id",
  auth,
  idEventValidation,
  eventExistsValidation,
  updateEventValidation,
  validate,
  updateEvent,
);

eventRouter.delete("/:id", auth, idEventValidation, validate, deleteEvent);
