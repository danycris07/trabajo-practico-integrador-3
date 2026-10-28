import { matchedData } from "express-validator";
import { User } from "../models/User.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.js";
import { generateToken } from "../helpers/jwt.js";

export const register = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    const user = await User.create({
      username: data.username,
      email: data.email,
      password: await hashPassword(data.password),
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      resource: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    const user = await User.findOne({
      email: data.email,
      deleted: false,
    }).select("+password");

    if (!user || !(await comparePassword(data.password, user.password))) {
      return res.status(401).json({
        message: "Correo o contraseña incorrectos",
      });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      message: "Sesión cerrada correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.user.id,
      deleted: false,
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
    next(error);
  }
};
