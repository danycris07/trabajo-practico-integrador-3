import { Router } from "express";
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
} from "../middlewares/validations/eventValidation.js";
import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";

export const router = Router();

router.use(auth);

router.get("/", getEvents);
router.get("/mine", getMyEvents);
router.get("/:id", idEventValidation, validate, getEventById);

router.post("/", createEventValidation, validate, createEvent);

router.patch("/:id", updateEventValidation, validate, updateEvent);

router.delete("/:id", idEventValidation, validate, deleteEvent);
