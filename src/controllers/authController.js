import { matchedData } from "express-validator";
import { User } from "../models/User.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.js";
import { generateToken } from "../helpers/jwt.js";

export const register = async (req, res) => {
  try {
    const { password, ...restOfData } = matchedData(req, {
      locations: ["body"],
    });

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      ...restOfData,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      resource: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req, { locations: ["body"] });

    const user = await User.findOne({
      email,
      deletedAt: null,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Correo o contraseña incorrectos",
      });
    }

    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Correo o contraseña incorrectos",
      });
    }

    const token = generateToken({
      user_id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      message: "Inicio de sesión correcto",
      resource: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      message: "Sesión cerrada correctamente",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { user_id } = req.userLogueado;
    const user = await User.findOne({
      _id: user_id,
      deletedAt: null,
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      message: "Perfil obtenido correctamente",
      resource: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profileData = matchedData(req, { locations: ["body"] });

    // Se actualizan de forma atómica los campos dentro de profile usando la notación de punto
    //$set sirve para actualizar campos que se enviaron sin afectar otros
    const { user_id } = req.userLogueado;

    const userExist = await User.findOne({ _id: user_id });

    const newProfile = {
      ...userExist.profile,
      ...profileData.profile,
    };

    const updatedProfile = await User.findOneAndUpdate(
      { _id: user_id, deletedAt: null },
      { $set: { profile: newProfile } },
      { returnDocument: "after", runValidators: true },
    );

    return res.status(200).json({
      message: "Perfil actualizado correctamente",
      resource: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
