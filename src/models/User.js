import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
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

userSchema.index(
  { username: 1 },
  { unique: true, partialFilterExpression: { deleted: false } },
);

userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { deleted: false } },
);

userSchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "creator",
});

export const User = mongoose.model("User", userSchema);
