import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

config();

const app = express();

// Middlewares
// Built-in
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Third-party
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

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

export default app;
