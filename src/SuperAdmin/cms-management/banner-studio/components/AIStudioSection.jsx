import React, { useState } from 'react';
import { Icon } from './Icons.jsx';

/**
 * AIStudioSection
 * "Generate a banner with AI" — matches the AI Studio panel in the design
 * reference. Purely client-side mock generation (setTimeout) for now, same
 * pattern as the rest of Banner Studio's mock data; swap handleGenerate's
 * setTimeout block for a real API call once an AI banner endpoint exists.
 *
 * onUseBanner(draft) is optional — pass it from BannerStudioPage if you want
 * "Add to Banners" to create a real (mock-store-backed) banner from the result.
 */
export default function AIStudioSection({ onUseBanner }) {
  const [prompt, setPrompt] = useState(
    'A bold promo banner announcing our new AI Engineering bootcamp, designed to drive enrollments before the cohort closes.'
  );
  const [audience, setAudience] = useState('Working Professionals');
  const [theme, setTheme] = useState('AI & Machine Learning');
  const [bannerType, setBannerType] = useState('Course Promotion');
  const [style, setStyle] = useState('Bold & Modern');
  const [status, setStatus] = useState('idle'); // idle | generating | generated
  const [result, setResult] = useState(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setStatus('generating');
    setTimeout(() => {
      setResult({
        eyebrow: theme,
        title: 'Become an AI Engineer',
        sub: 'Industry-ready training with real projects, mentorship & placement support',
        cta: 'Enroll Now',
        audience,
        style,
        theme,
        bannerType,
      });
      setStatus('generated');
    }, 1600);
  };

  const handleUseBanner = () => {
    if (!result) return;
    onUseBanner?.({
      name: result.title,
      status: 'draft',
      emoji: '✨',
      gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 45%, #14532D 100%)',
    });
  };

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <div className="eyebrow">
            <Icon.Sparkles size={13} /> AI Studio
          </div>
          <h2>Generate a banner with AI</h2>
          <div className="sub">Describe what you need — ILM ORA's AI drafts the copy, layout and CTA instantly.</div>
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
                <select value={audience} onChange={(e) => setAudience(e.target.value)}>
                  <option>Working Professionals</option>
                  <option>College Students</option>
                  <option>Career Switchers</option>
                  <option>Enterprise L&D Teams</option>
                </select>
              </div>
              <div className="field">
                <label>Theme</label>
                <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option>AI &amp; Machine Learning</option>
                  <option>Web Development</option>
                  <option>Data Science</option>
                  <option>Cloud &amp; DevOps</option>
                </select>
              </div>
              <div className="field">
                <label>Banner Type</label>
                <select value={bannerType} onChange={(e) => setBannerType(e.target.value)}>
                  <option>Course Promotion</option>
                  <option>Seasonal Sale</option>
                  <option>Webinar / Event</option>
                  <option>New Launch</option>
                </select>
              </div>
              <div className="field">
                <label>Style</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)}>
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
              disabled={status === 'generating'}
            >
              {status === 'generating' ? (
                <><span className="bs-spinner" /> Generating…</>
              ) : (
                <><Icon.Wand size={16} /> Generate with AI</>
              )}
            </button>
          </div>

          <div className="ai-result">
            <div className="ai-result-head">
              <span><Icon.Sparkles size={14} /> AI Preview</span>
              <span style={{ color: 'var(--bs-muted-2, var(--bs-muted))' }}>
                {status === 'idle' ? 'Idle' : status === 'generating' ? 'Generating…' : 'Generated'}
              </span>
            </div>
            <div className="ai-preview-stage">
              {status === 'idle' && (
                <div className="ai-placeholder">
                  <Icon.Image size={34} />
                  <p>Your AI-generated banner will appear here. Fill the prompt and click Generate.</p>
                </div>
              )}
              {status === 'generating' && (
                <div className="ai-loading">
                  <div className="ai-dots"><span /><span /><span /></div>
                  <p>Drafting copy, layout &amp; CTA…</p>
                </div>
              )}
              {status === 'generated' && result && (
                <div style={{ width: '100%' }}>
                  <div className="mock-banner">
                    <div className="mock-eyebrow">{result.eyebrow}</div>
                    <div className="mock-title">{result.title}</div>
                    <div className="mock-sub">{result.sub}</div>
                    <span className="mock-cta">
                      <Icon.ArrowUp size={13} /> {result.cta}
                    </span>
                  </div>
                  <div className="gen-caption">Generated for {result.audience} · {result.style} style</div>
                  {onUseBanner && (
                    <button className="btn btn-secondary btn-sm btn-block" style={{ marginTop: 12 }} onClick={handleUseBanner}>
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
