import Highlight from "../models/Highlight.js";
import Pdf from "../models/Pdf.js";

export async function createHighlight(req, res) {
  const { pdfUuid, page, text, rect, note, timestamp } = req.body;
  if (!pdfUuid || typeof page !== "number") {
    return res.status(400).json({ error: "pdfUuid and page are required" });
  }
  // Ensure the pdf belongs to user
  const pdf = await Pdf.findOne({ uuid: pdfUuid, user: req.userId });
  if (!pdf) return res.status(404).json({ error: "pdf not found" });

  const h = await Highlight.create({
    pdfUuid, user: req.userId, page, text: text || "", rect: rect || null, note: note || "", timestamp
  });
  res.status(201).json({ highlight: h });
}

export async function listHighlights(req, res) {
  const { pdfUuid } = req.params;
  const pdf = await Pdf.findOne({ uuid: pdfUuid, user: req.userId });
  if (!pdf) return res.status(404).json({ error: "pdf not found" });

  const items = await Highlight.find({ pdfUuid, user: req.userId }).sort({ createdAt: 1 });
  res.json({ items });
}

export async function updateHighlight(req, res) {
  const { id } = req.params;
  const h = await Highlight.findOne({ _id: id, user: req.userId });
  if (!h) return res.status(404).json({ error: "highlight not found" });

  const { page, text, rect, note } = req.body;
  if (page !== undefined) h.page = page;
  if (text !== undefined) h.text = text;
  if (rect !== undefined) h.rect = rect;
  if (note !== undefined) h.note = note;
  await h.save();
  res.json({ highlight: h });
}

export async function deleteHighlight(req, res) {
  const { id } = req.params;
  const h = await Highlight.findOne({ _id: id, user: req.userId });
  if (!h) return res.status(404).json({ error: "highlight not found" });
  await h.deleteOne();
  res.json({ ok: true });
}
