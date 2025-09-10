import mongoose from "mongoose";

const rectSchema = new mongoose.Schema(
  { x: Number, y: Number, width: Number, height: Number },
  { _id: false }
);


const highlightSchema = new mongoose.Schema(
  {
    pdfUuid: { type: String, required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    page: { type: Number, required: true },
    text: { type: String, default: "" },
    rect: rectSchema,
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Highlight", highlightSchema);
