import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  atsScore: { type: Number, required: true },
  suggestions: { type: Array, default: [] }
});

export default mongoose.model("Resume", resumeSchema);
