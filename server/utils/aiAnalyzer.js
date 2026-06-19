import dotenv from "dotenv";
import { extractKeywords } from "./keywordExtractor.js";
import { calculateATSScore } from "./atsScore.js";

dotenv.config();

const buildPrompt = (resumeText, jobDescription) => `You are an ATS resume analyzer.
Return STRICT JSON only.
Do not wrap in markdown.
Do not include backticks.
Do not include explanations.
Use this exact schema:
{
  "compatibility": 85,
  "matchedSkills": ["React", "JavaScript", "HTML", "CSS"],
  "missingSkills": ["Node.js", "MongoDB", "TypeScript"],
  "suggestions": [
    "Add more details on Node.js and backend integrations.",
    "Include projects using NoSQL databases like MongoDB."
  ]
}

Resume text: ${resumeText}
Job description: ${jobDescription}`;

const fallbackAnalysis = (resumeText, jobDescription) => {
  const jdKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resumeText);
  const matched = jdKeywords.filter((k) => resumeKeywords.includes(k));
  const missing = jdKeywords.filter((k) => !resumeKeywords.includes(k));

  const uniqueMatched = [...new Set(matched)].slice(0, 8);
  const uniqueMissing = [...new Set(missing)].slice(0, 8);

  const compatibility = calculateATSScore(jdKeywords, resumeKeywords);

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const matchedSkills = uniqueMatched.map(capitalize);
  const missingSkills = uniqueMissing.map(capitalize);

  const suggestions = missingSkills.map(
    (skill) => `Include experiences or projects demonstrating proficiency in ${skill}.`
  );
  if (suggestions.length === 0) {
    suggestions.push("Excellent match! Your resume matches the job description perfectly.");
  } else {
    suggestions.push("Tailor your resume summary and work history to highlight key competencies.");
  }

  return {
    compatibility,
    matchedSkills,
    missingSkills,
    suggestions
  };
};

export const analyzeWithGemini = async (resumeText, jobDescription) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. Using local keyword analysis fallback.");
    return fallbackAnalysis(resumeText, jobDescription);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: buildPrompt(resumeText, jobDescription)
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Empty Gemini response text");
    }

    try {
      const cleanJson = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanJson);
    } catch (parseError) {
      console.warn("Gemini output parsing failed, returning raw text fallback:", parseError);
      return {
        compatibility: calculateATSScore(extractKeywords(jobDescription), extractKeywords(resumeText)),
        matchedSkills: [],
        missingSkills: [],
        suggestions: [rawText]
      };
    }
  } catch (error) {
    console.error("Gemini API call failed, using keyword analysis fallback:", error);
    return fallbackAnalysis(resumeText, jobDescription);
  }
};
