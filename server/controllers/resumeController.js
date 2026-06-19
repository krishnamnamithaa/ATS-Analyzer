import { parseResume } from "../utils/resumeParser.js";
import { extractKeywords } from "../utils/keywordExtractor.js";
import { calculateATSScore } from "../utils/atsScore.js";
import { analyzeWithGemini } from "../utils/aiAnalyzer.js";
import Resume from "../models/Resume.js";
import mongoose from "mongoose";

// In-memory fallback database for development testing when MongoDB is offline
const mockResumes = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const text = await parseResume(req.file.buffer);
    const preview = text.substring(0, 500);
    return res.json({ text, preview });
  } catch (err) {
    console.error("Upload resume error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "Missing resumeText or jobDescription" });
    }

    // Keyword extraction & scoring
    const jdKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resumeText);
    const atsScore = calculateATSScore(jdKeywords, resumeKeywords);

    // Call Gemini (with automatic offline keyword fallback inside utility)
    const suggestions = await analyzeWithGemini(resumeText, jobDescription);

    let savedResume;
    const userId = req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : new mongoose.Types.ObjectId();

    if (isDbConnected()) {
      savedResume = await Resume.create({
        userId,
        text: resumeText,
        atsScore,
        suggestions: suggestions.suggestions || []
      });
    } else {
      console.warn("MongoDB not connected. Saving resume in mock database.");
      savedResume = {
        _id: new mongoose.Types.ObjectId(),
        userId,
        text: resumeText,
        atsScore,
        suggestions: suggestions.suggestions || []
      };
      mockResumes.push(savedResume);
    }

    return res.json({
      success: true,
      atsScore,
      suggestions,
      resume: savedResume
    });
  } catch (err) {
    console.error("Analyze resume error:", err);
    return res.status(500).json({ error: err.message });
  }
};
export { mockResumes };
