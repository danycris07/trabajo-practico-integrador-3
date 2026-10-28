import { matchedData } from "express-validator";
import { Category } from "../models/Category.js";
import { Event } from "../models/Event.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ deleted: false });

    return res.status(200).json({
      message: "Categorías obtenidas correctamente",
      resource: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      deleted: false,
    });

    if (!category) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    return res.status(200).json({
      message: "Categoría obtenida correctamente",
      resource: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryEvents = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      deleted: false,
    }).populate({
      path: "events",
      match: { deleted: false },
      populate: {
        path: "creator",
        select: "username email",
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    return res.status(200).json({
      message: "Eventos de la categoría obtenidos correctamente",
      resource: category.events,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    const category = await Category.create(data);

    return res.status(201).json({
      message: "Categoría creada correctamente",
      resource: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    const category = await Category.findOneAndUpdate(
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

    if (!category) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    return res.status(200).json({
      message: "Categoría actualizada correctamente",
      resource: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      deleted: false,
    });

    if (!category) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    category.deleted = true;
    await category.save();

    await Event.updateMany(
      {
        category: category._id,
        deleted: false,
      },
      {
        $set: { deleted: true },
      },
    );

    return res.status(200).json({
      message: "Categoría y sus eventos eliminados correctamente",
    });
  } catch (error) {
    next(error);
  }
};
