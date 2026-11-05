import { matchedData } from "express-validator";
import mongoose from "mongoose";
import { Event } from "../models/Event.js";

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("categories")
      .populate("organizer", "-password");

    return res.status(200).json({
      message: "Eventos obtenidos correctamente",
      resource: events,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener los eventos" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id)
      .populate("categories")
      .populate("organizer", "-password");

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    return res.status(200).json({
      message: "Evento obtenido correctamente",
      resource: event,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "El ID del evento no es válido" });
    }
    return res.status(500).json({ message: "Error al obtener el evento" });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const { user_id } = req.userLogueado;
    const events = await Event.find({ organizer: user_id })
      .populate("organizer", "-password")
      .populate("categories");

    return res.status(200).json({
      message: "Tus eventos obtenidos correctamente",
      resource: events,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener tus eventos" });
  }
};

export const createEvent = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    const event = await Event.create({
      ...data,
      organizer: req.userLogueado.user_id,
    });

    return res.status(201).json({
      message: "Evento creado correctamente",
      resource: event,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el evento" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = matchedData(req, { locations: ["body"] });

    const event = await Event.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: "after", runValidators: true },
    );

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    return res.status(200).json({
      message: "Evento actualizado correctamente",
      resource: event,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el evento" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    return res.status(200).json({
      message: "Evento eliminado correctamente",
      resource: event,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el evento" });
  }
};
