import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    venue: {
      type: String,
      required: [true, "El lugar del evento es obligatorio"],
      trim: true,
      maxlength: 100,
    },
    address: {
      type: String,
      required: [true, "La dirección es obligatoria"],
      trim: true,
      maxlength: 200,
    },
  },
  {
    _id: false,
  },
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      match: [
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "La hora debe tener el formato HH:mm",
      ],
    },
    location: {
      type: locationSchema,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["PROGRAMADO", "CANCELADO", "FINALIZADO"],
      default: "PROGRAMADO",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Event = mongoose.model("Event", eventSchema);
