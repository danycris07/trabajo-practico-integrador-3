import Router from "express";

import {
  getEvents,
  getEventById,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import {
  createEventValidation,
  updateEventValidation,
  eventExistsValidation,
} from "../middlewares/validations/eventValidation.js";

import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdminMiddleware } from "../middlewares/ownerOrAdmin.middleware.js";

export const eventRouter = Router();

eventRouter.get("/", authMiddleware, getEvents);

eventRouter.get("/myEvents", authMiddleware, getMyEvents);

eventRouter.get("/:id", authMiddleware, getEventById);

eventRouter.post(
  "/",
  authMiddleware,
  createEventValidation,
  validate,
  createEvent,
);

eventRouter.put(
  "/:id",
  authMiddleware,
  ownerOrAdminMiddleware,
  eventExistsValidation,
  updateEventValidation,
  validate,
  updateEvent,
);

eventRouter.delete(
  "/:id",
  authMiddleware,
  ownerOrAdminMiddleware,
  eventExistsValidation,
  validate,
  deleteEvent,
);
