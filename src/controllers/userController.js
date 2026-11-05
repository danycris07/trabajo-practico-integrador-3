import { matchedData } from "express-validator";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ deletedAt: null }).populate("events");

    return res.status(200).json({
      message: "Usuarios obtenidos correctamente",
      resource: users,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      _id: id,
      deletedAt: null,
    }).populate("events");

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      message: "Usuario obtenido correctamente",
      resource: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const { id } = req.params;

    const user = await User.findOneAndUpdate(
      {
        _id: id,
        deleted: false,
      },
      {
        $set: data,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      resource: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      { _id: id },
      { $set: { deletedAt: new Date() } },
      { returnDocument: "after" },
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await Event.deleteMany({ organizer: id });

    return res.status(200).json({
      message: "Usuario y sus eventos eliminados correctamente",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};
