import React, { useState } from "react";
import { Icon } from "./Icons.jsx";
// ── Real backend, not a client-side mock anymore ──────────────────────────
// ADJUST THIS PATH to wherever courseService.js actually lives relative to
// this file, e.g. '../../services/courseService' or
// '../../../services/courseService'.
import { courseService } from "../../../../services/courseService";

export default function AIStudioSection({ onUseBanner }) {
  const [prompt, setPrompt] = useState(
    "A bold promo banner announcing our new AI Engineering bootcamp, designed to drive enrollments before the cohort closes.",
  );
  const [audience, setAudience] = useState("Working Professionals");
  const [theme, setTheme] = useState("AI & Machine Learning");
  const [bannerType, setBannerType] = useState("Course Promotion");
  const [style, setStyle] = useState("Bold & Modern");
  const [status, setStatus] = useState("idle"); // idle | generating | generated | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setStatus("generating");
    setErrorMsg(null);
    try {
      const { data } = await courseService.generateBannerWithAI({
        prompt,
        audience,
        theme,
        bannerType,
        style,
      });
      // Backend may wrap the result ({ data: {...} }) or return it flat —
      // handle both without throwing.
      const generated = data?.data ?? data;
      setResult(generated);
      setStatus("generated");
    } catch (err) {
      console.error("AI banner generation failed", err);
      setErrorMsg("Failed to generate banner. Please try again.");
      setStatus("idle");
    }
  };

  const handleUseBanner = () => {
    if (!result) return;
    // Pass the full AI result up — BannerStudioPage decides how to persist
    // it (courseService.saveAiGeneratedBanner).
    onUseBanner?.(result);
  };

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <div className="eyebrow">
            <Icon.Sparkles size={13} /> AI Studio
          </div>
          <h2>Generate a banner with AI</h2>
          <div className="sub">
            Describe what you need — ILM ORA's AI drafts the copy, layout and
            CTA instantly.
          </div>
        </div>
      </div>

      <div className="ai-panel">
        <div className="ai-grid">
          <div>
            <div className="field">
              <label>Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A bold promo banner announcing our new AI Engineering bootcamp with a strong call to enroll"
              />
            </div>
            <div className="ai-form-grid">
              <div className="field">
                <label>Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                >
                  <option>Working Professionals</option>
                  <option>College Students</option>
                  <option>Career Switchers</option>
                  <option>Enterprise L&D Teams</option>
                </select>
              </div>
              <div className="field">
                <label>Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option>AI &amp; Machine Learning</option>
                  <option>Web Development</option>
                  <option>Data Science</option>
                  <option>Cloud &amp; DevOps</option>
                </select>
              </div>
              <div className="field">
                <label>Banner Type</label>
                <select
                  value={bannerType}
                  onChange={(e) => setBannerType(e.target.value)}
                >
                  <option>Course Promotion</option>
                  <option>Seasonal Sale</option>
                  <option>Webinar / Event</option>
                  <option>New Launch</option>
                </select>
              </div>
              <div className="field">
                <label>Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option>Bold &amp; Modern</option>
                  <option>Minimal &amp; Clean</option>
                  <option>Playful &amp; Vibrant</option>
                  <option>Corporate &amp; Trustworthy</option>
                </select>
              </div>
            </div>
            <button
              className="btn btn-primary ai-generate-btn"
              onClick={handleGenerate}
              disabled={status === "generating"}
            >
              {status === "generating" ? (
                <>
                  <span className="bs-spinner" /> Generating…
                </>
              ) : (
                <>
                  <Icon.Wand size={16} /> Generate with AI
                </>
              )}
            </button>
            {errorMsg && (
              <div style={{ color: "#c0392b", fontSize: 13, marginTop: 8 }}>
                {errorMsg}
              </div>
            )}
          </div>

          <div className="ai-result">
            <div className="ai-result-head">
              <span>
                <Icon.Sparkles size={14} /> AI Preview
              </span>
              <span style={{ color: "var(--bs-muted-2, var(--bs-muted))" }}>
                {status === "idle"
                  ? "Idle"
                  : status === "generating"
                    ? "Generating…"
                    : "Generated"}
              </span>
            </div>
            <div className="ai-preview-stage">
              {status === "idle" && (
                <div className="ai-placeholder">
                  <Icon.Image size={34} />
                  <p>
                    Your AI-generated banner will appear here. Fill the prompt
                    and click Generate.
                  </p>
                </div>
              )}
              {status === "generating" && (
                <div className="ai-loading">
                  <div className="ai-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <p>Drafting copy, layout &amp; CTA…</p>
                </div>
              )}
              {status === "generated" && result && (
                <div style={{ width: "100%" }}>
                  <div className="mock-banner">
                    <div className="mock-eyebrow">
                      {result.eyebrow ?? theme}
                    </div>
                    <div className="mock-title">{result.title}</div>
                    <div className="mock-sub">
                      {result.sub ?? result.subtitle}
                    </div>
                    <span className="mock-cta">
                      <Icon.ArrowUp size={13} />{" "}
                      {result.cta ?? result.ctaText ?? "Enroll Now"}
                    </span>
                  </div>
                  <div className="gen-caption">
                    Generated for {audience} · {style} style
                  </div>
                  {onUseBanner && (
                    <button
                      className="btn btn-secondary btn-sm btn-block"
                      style={{ marginTop: 12 }}
                      onClick={handleUseBanner}
                    >
                      <Icon.Plus size={14} /> Add to Banners
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
