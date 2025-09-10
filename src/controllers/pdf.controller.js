import fs from "node:fs/promises";
import path from "node:path";
import Pdf from "../models/Pdf.js";
import Highlight from "../models/Highlight.js";


const UPLOAD_DIR = path.resolve("uploads/pdfs");

export async function uploadPdf(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Use the UUID created by the router's multer filename() callback
    const id = req.generatedUuid;
    const originalName = req.file.originalname;
    const storedName = req.file.filename; // "<uuid>.pdf" created by multer

    const pdf = await Pdf.create({
      uuid: id,
      user: req.userId,
      originalName,
      storedName,
      displayName: originalName
    });

    res.status(201).json({
      uuid: id,
      fileUrl: `/uploads/pdfs/${storedName}`,
      pdf: { uuid: id, originalName, displayName: pdf.displayName }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "upload failed" });
  }
}


export async function listPdfs(req, res) {
  const items = await Pdf.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json({ items });
}

export async function renamePdf(req, res) {
  const { uuid } = req.params;
  const { displayName } = req.body;
  const pdf = await Pdf.findOne({ uuid, user: req.userId });
  if (!pdf) return res.status(404).json({ error: "pdf not found" });
  pdf.displayName = displayName || pdf.displayName;
  await pdf.save();
  res.json({ ok: true, pdf });
}

export async function deletePdf(req, res) {
  try {
    const { uuid } = req.params;
    const pdf = await Pdf.findOne({ uuid, user: req.userId });
    if (!pdf) return res.status(404).json({ error: "pdf not found" });

    // Delete file
    await fs.unlink(path.join(UPLOAD_DIR, pdf.storedName)).catch(() => {});
    // Delete highlights for this PDF
    await Highlight.deleteMany({ pdfUuid: uuid, user: req.userId });
    // Delete metadata
    await pdf.deleteOne();

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "delete failed" });
  }
}

export async function getPdfMeta(req, res) {
  const { uuid } = req.params;
  const pdf = await Pdf.findOne({ uuid, user: req.userId });
  if (!pdf) return res.status(404).json({ error: "pdf not found" });
  res.json({ pdf, fileUrl: `/uploads/pdfs/${pdf.storedName}` });
}
