import { verifyToken } from "../helpers/jwt.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Debes iniciar sesión",
      });
    }

    const decoded = verifyToken(token);

    req.userLogueado = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
};
