import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";

import { connectDB } from "./src/config/database.js";
import { authRouter } from "./src/routes/authRoutes.js";
import { userRouter } from "./src/routes/userRoutes.js";
import { categoryRouter } from "./src/routes/categoryRoutes.js";
import { eventRouter } from "./src/routes/eventRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/events", eventRouter);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
};

startServer();
