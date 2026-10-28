import { matchedData } from "express-validator";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";
import { hashPassword } from "../helpers/bcrypt.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ deleted: false });

    return res.status(200).json({
      message: "Usuarios obtenidos correctamente",
      resource: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      deleted: false,
    });

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
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
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

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      resource: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      deleted: false,
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    user.deleted = true;
    await user.save();

    await Event.updateMany(
      {
        creator: user._id,
        deleted: false,
      },
      {
        $set: { deleted: true },
      },
    );

    return res.status(200).json({
      message: "Usuario y sus eventos eliminados correctamente",
    });
  } catch (error) {
    next(error);
  }
};
