import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { authRequired } from "../middleware/auth.js";
import { uploadPdf, listPdfs, renamePdf, deletePdf, getPdfMeta } from "../controllers/pdf.controller.js";

// Configure disk storage so we control name/location
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve("uploads/pdfs")),
  filename: (req, file, cb) => {
    // Temp name; controller uses UUID for metadata/fileUrl; the stored file name we want is <uuid>.pdf
    // Easiest: keep the filename as provided; controller response will use <uuid>.pdf as canonical.
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.toLowerCase().endsWith(".pdf")) return cb(new Error("Only PDF allowed"));
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
