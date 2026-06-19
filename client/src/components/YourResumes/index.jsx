import React, { useState } from "react";
import { API_BASE_URL } from "../../config";
import "./index.css";

const YourResumes = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState(
    "Junior Full Stack Developer. We are looking for a motivated entry-level Full Stack Developer to join our engineering team. You will work on building and maintaining web applications using modern technologies. Requirements: Bachelor's degree in Computer Science or related field. Proficiency in HTML, CSS, JavaScript, and React. Experience with Node.js, Express, and REST APIs. Familiarity with MongoDB or any NoSQL database. Understanding of Git and version control. Strong problem-solving skills and attention to detail. Good communication and teamwork abilities. Nice to Have: Experience with TypeScript, Redux, or Next.js. Exposure to cloud platforms like AWS or Azure. Knowledge of CI/CD pipelines and Docker. Responsibilities: Develop and maintain responsive web applications. Build RESTful APIs and integrate with frontend components. Write clean, maintainable, and well-documented code. Collaborate with designers, product managers, and senior developers. Participate in code reviews and contribute to team best practices. Debug and resolve technical issues across the full stack."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a resume PDF file first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authorization token found. Please log in again.");
      }

      // Step 1: Upload and parse resume
      const formData = new FormData();
      formData.append("resume", selectedFile);

      const uploadResponse = await fetch(`${API_BASE_URL}/resume/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Upload failed");
      }

      // Step 2: Analyze resume
      const analyzeResponse = await fetch(`${API_BASE_URL}/resume/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeText: uploadData.text,
          jobDescription: jobDescription,
        }),
      });

      const analyzeData = await analyzeResponse.json();
      if (!analyzeResponse.ok) {
        throw new Error(analyzeData.error || "Analysis failed");
      }

      setAnalysisResult(analyzeData);
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-container">
      <div className="dashboard-card">
        <h2>ATS Resume Analysis Dashboard</h2>
        <p className="subtitle">
          Optimize your resume for applicant tracking systems using advanced keyphrase analytics.
        </p>

        {error && <div className="error-banner">⚠️ {error}</div>}

        <div className="upload-section">
          <h3>1. Upload Resume PDF</h3>
          <div className="file-drop-zone">
            <span className="file-icon">📄</span>
            <span className="file-text">
              {selectedFile ? selectedFile.name : "Choose a PDF file to analyze"}
            </span>
            <label className="file-select-btn" htmlFor="file-upload">
              Browse File
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        <div className="jd-section">
          <h3>2. Target Job Description</h3>
          <textarea
            rows="8"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target Job Description here..."
          />
        </div>

        <div className="actions-bar">
          <button
            onClick={handleUploadAndAnalyze}
            disabled={loading}
            className="action-btn"
          >
            {loading ? (
              <span className="spinner-container">
                <span className="spinner"></span> Analyzing Resume...
              </span>
            ) : (
              "Upload & Analyze Resume"
            )}
          </button>

          {analysisResult && (
            <button onClick={() => setShowModal(true)} className="view-report-btn">
              View Analysis Report
            </button>
          )}
        </div>
      </div>

      {showModal && analysisResult && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>ATS Compatibility Report</h2>
              <button onClick={() => setShowModal(false)} className="modal-close-icon">
                &times;
              </button>
            </div>

            {(() => {
              const report =
                analysisResult.suggestions?.analysis ??
                analysisResult.suggestions ??
                analysisResult;

              const compatibilityScore = report.compatibility ?? analysisResult.atsScore ?? 0;
              const matched = report.matchedSkills || [];
              const missing = report.missingSkills || [];
              const tips = report.suggestions || [];

              let scoreClass = "poor";
              if (compatibilityScore >= 75) scoreClass = "good";
              else if (compatibilityScore >= 40) scoreClass = "warning";

              return (
                <div className="modal-body">
                  <div className="score-widget">
                    <div className={`score-ring ${scoreClass}`}>
                      <span className="score-num">{compatibilityScore}%</span>
                      <span className="score-label">Compatibility</span>
                    </div>
                    <div className="score-assessment">
                      {compatibilityScore >= 75 ? (
                        <p className="status-good">
                          🎉 Excellent match! Your resume aligns very well with the requirements.
                        </p>
                      ) : compatibilityScore >= 40 ? (
                        <p className="status-warning">
                          ⚠️ Moderate match. Adding some missing key skills will improve your chances.
                        </p>
                      ) : (
                        <p className="status-poor">
                          ❌ Low match. We recommend refining your skills or updating descriptions.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="skills-overview">
                    <div className="skills-card matched-box">
                      <h4>Matched Keywords ({matched.length})</h4>
                      <ul className="pill-list">
                        {matched.length > 0 ? (
                          matched.map((skill, i) => (
                            <li key={i} className="pill pill-good">
                              ✅ {skill}
                            </li>
                          ))
                        ) : (
                          <li className="no-item-text">No matching skills found</li>
                        )}
                      </ul>
                    </div>

                    <div className="skills-card missing-box">
                      <h4>Missing Keywords ({missing.length})</h4>
                      <ul className="pill-list">
                        {missing.length > 0 ? (
                          missing.map((skill, i) => (
                            <li key={i} className="pill pill-bad">
                              ❌ {skill}
                            </li>
                          ))
                        ) : (
                          <li className="no-item-text">None missing! Great job.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="analysis-suggestions">
                    <h4>Gemini AI Recommendations</h4>
                    <ul className="bullet-list">
                      {tips.length > 0 ? (
                        tips.map((tip, i) => <li key={i}>💡 {tip}</li>)
                      ) : (
                        <li>No AI suggestions returned.</li>
                      )}
                    </ul>
                  </div>
                </div>
              );
            })()}

            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="close-btn">
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourResumes;
