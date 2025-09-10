// src/routes/pdf.routes.js
import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { authRequired } from "../middleware/auth.js";
import {
  uploadPdf,
  listPdfs,
  renamePdf,
  deletePdf,
  getPdfMeta
} from "../controllers/pdf.controller.js";

const uploadDir = path.resolve("uploads/pdfs");

// Configure disk storage to name files <uuid>.pdf
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const id = uuidv4();
    // make this available to the controller
    req.generatedUuid = id;
    cb(null, `${id}.pdf`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const nameOk = file.originalname?.toLowerCase().endsWith(".pdf");
    const typeOk = (file.mimetype || "").toLowerCase() === "application/pdf";
    if (!nameOk && !typeOk) return cb(new Error("Only PDF allowed"));
    cb(null, true);
  },
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

const router = Router();

router.get("/", authRequired, listPdfs);
router.post("/upload", authRequired, upload.single("file"), uploadPdf);
router.get("/:uuid", authRequired, getPdfMeta);
router.patch("/:uuid", authRequired, renamePdf);
router.delete("/:uuid", authRequired, deletePdf);

export default router;
