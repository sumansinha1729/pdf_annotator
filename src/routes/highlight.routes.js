import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { createHighlight, listHighlights, updateHighlight, deleteHighlight } from "../controllers/highlight.controller.js";

const router = Router();

router.get("/:pdfUuid", authRequired, listHighlights);
router.post("/", authRequired, createHighlight);
router.patch("/:id", authRequired, updateHighlight);
router.delete("/:id", authRequired, deleteHighlight);

export default router;
