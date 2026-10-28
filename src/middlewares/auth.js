import { verifyToken } from "../helpers/jwt.js";
import { User } from "../models/User.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Debes iniciar sesión",
      });
    }

    const decoded = verifyToken(token);

    const user = await User.findOne({
      _id: decoded.id,
      deleted: false,
    });

    if (!user) {
      return res.status(401).json({
        message: "La sesión no es válida",
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
};
