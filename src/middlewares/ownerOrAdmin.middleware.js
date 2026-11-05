import { Event } from "../models/Event.js";

export const ownerOrAdminMiddleware = async (req, res, next) => {
  try {
    //verificar que el usuario esta autenticado
    if (!req.userLogueado) {
      return res.status(401).json({ msg: "usuario no autenticado" });
    }

    //verificar el rol del ususario
    const { user_id, role } = req.userLogueado;

    if (role !== "admin" && role !== "user") {
      return res.status(403).json({ message: "usuario no autorizado" });
    }

    // verifica que llegue el ID del evento
    const eventID = req.params.id ?? req.body.article_id;
    if (!eventID) {
      return res.status(404).json({ message: "se nesecita el ID del evento" });
    }

    //verifica que exista el evento
    const existEvent = await Event.findOne({ _id: eventID });

    if (!existEvent) {
      return res.status(404).json({ message: "evento no encontrado" });
    }

    //verifica que sea admin o el organizador del evento
    if (role !== "admin" && String(existEvent.organizer) !== String(user_id)) {
      return res.status(403).json({ message: "usuario no autorizado" });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error });
  }
};
