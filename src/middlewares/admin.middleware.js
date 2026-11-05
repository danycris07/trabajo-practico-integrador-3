export const adminMiddleware = (req, res, next) => {
  if (req.userLogueado.role !== "admin") {
    return res.status(403).json({ msg: "Solo administradores pueden acceder" });
  }
  next();
};
