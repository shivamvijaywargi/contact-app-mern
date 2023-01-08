import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import morganMiddleware from "./configs/morgan";
import errorMiddleware from "./middlewares/error.middleware";

config();

const app = express();

// Middlewares
// Built-in
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Third-party
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
// Custom
app.use(morganMiddleware);

/**
 * @SERVER_STATUS
 * @ROUTE @GET {{URL}}/api/ping
 * @DESC Returns response 200 with message pong if api is working
 * @ACCESS Public
 */
app.get("/api/ping", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "UP",
    message: "PONG",
  });
});

// Import all routes
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import contactRoutes from "./routes/contact.routes";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/contacts", contactRoutes);

// Custom error middleware
app.use(errorMiddleware);

export default app;
