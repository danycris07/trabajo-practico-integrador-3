import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      min: 1,
      default: 0,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "finished"],
      default: "scheduled",
    },
    location: {
      venue: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
      },
      address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 150,
      },
      city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
      },
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Event = mongoose.model("Event", eventSchema);
