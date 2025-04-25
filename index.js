import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
dotenv.config();
import "colors";
const app = express();

import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./controllers/error.controller.js";

import authRoutes from "./routes/auth.route.js";
import detectionRoutes from "./routes/detection.route.js";
import historyRoutes from "./routes/history.route.js";

import passport from "passport";
import "./passport/google.js"; // Initialize passport strategie

connectDB();

app.use(passport.initialize());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());
// For JSON requests
app.use(express.json({ limit: "30mb" }));

// For form-data (like image uploads)
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.send("Hello World! hehe");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/detections", detectionRoutes);
app.use("/api/v1/history", historyRoutes);

app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
