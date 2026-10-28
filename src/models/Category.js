import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
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

categorySchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { deleted: false } },
);

categorySchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "category",
});

export const Category = mongoose.model("Category", categorySchema);
