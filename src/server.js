import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import fs from "node:fs";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";
import highlightRoutes from "./routes/highlight.routes.js";

const app = express();

// upload dir 
const uploadDir = path.resolve("uploads/pdfs");
fs.mkdirSync(uploadDir, { recursive: true });

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));     
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// Static serve PDFs
app.use("/uploads/pdfs", express.static(uploadDir));

// Health
app.get("/healthz", (_req, res) => res.json({ ok: true, service: "api" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pdfs", pdfRoutes);
app.use("/api/highlights", highlightRoutes);

// Start
const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`[api] http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("[db] connection error", err);
    process.exit(1);
  });
