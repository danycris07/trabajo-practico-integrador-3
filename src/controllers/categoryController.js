import { matchedData } from "express-validator";
import { Category } from "../models/Category.js";
import { Event } from "../models/Event.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.status(200).json({
      message: "Categorías obtenidas correctamente",
      resource: categories,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("events");

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res.status(200).json({
      message: "Categoría obtenida correctamente",
      resource: category,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const category = await Category.create(data);

    return res.status(201).json({
      message: "Categoría creada correctamente",
      resource: category,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { returnDocument: "after", runValidators: true },
    );

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res.status(200).json({
      message: "Categoría actualizada correctamente",
      resource: category,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;


    await Event.updateMany({ categories: id }, { $pull: { categories: id } });

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res.status(200).json({
      message: "Categoría eliminada exitosamente",
      resource: category,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};
