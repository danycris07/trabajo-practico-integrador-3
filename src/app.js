import express from "express";
import cookieParser from "cookie-parser";

import { authRoutes } from "./routes/authRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { categoryRoutes } from "./routes/categoryRoutes.js";
import { eventRoutes } from "./routes/eventRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/events", eventRoutes);

export { app };
