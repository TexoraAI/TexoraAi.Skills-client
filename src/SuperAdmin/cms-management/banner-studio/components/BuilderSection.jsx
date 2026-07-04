import React, { useRef, useState } from 'react';
import { Icon } from './Icons.jsx';

const TOOLS = [
  { key: 'bg', label: 'Background', icon: 'Image' },
  { key: 'title', label: 'Text', icon: 'Type' },
  { key: 'cta', label: 'Buttons', icon: 'Square' },
  { key: 'shape', label: 'Shapes', icon: 'Star' },
  { key: 'icons', label: 'Icons', icon: 'Smile' },
  { key: 'images', label: 'Images', icon: 'Image' },
  { key: 'ai', label: 'AI Tools', icon: 'Wand' },
];

const BG_PRESETS = [
  'linear-gradient(120deg,#0F172A,#1E293B 50%,#14532D)',
  'linear-gradient(120deg,#F97316,#C2410C)',
  'linear-gradient(120deg,#16A34A,#14532D)',
  'linear-gradient(120deg,#1E293B,#F97316)',
];

const LAYER_NAMES = { title: 'Title text', cta: 'CTA button', bg: 'Background', shape: 'Background shape' };

/**
 * BuilderSection — "Design your banner" Canva-style editor.
 * Drag the title/CTA layers around the canvas, tweak background, typography,
 * spacing, alignment, border radius and preview a couple of entrance
 * animations. Purely visual/local state — nothing here is persisted to a
 * banner yet (hook up `onSave` if you want a "Save to banner" action later).
 */
export default function BuilderSection() {
  const canvasRef = useRef(null);

  const [activeTool, setActiveTool] = useState('title');
  const [selectedLayer, setSelectedLayer] = useState('title');

  const [titlePos, setTitlePos] = useState({ top: 30, left: 6 });
  const [ctaPos, setCtaPos] = useState({ top: 72, left: 6 });

  const [bg, setBg] = useState(BG_PRESETS[0]);
  const [activeSwatch, setActiveSwatch] = useState(0);

  const [titleSize, setTitleSize] = useState(30);
  const [titleWeight, setTitleWeight] = useState('700');
  const [titleColor, setTitleColor] = useState('#ffffff');

  const [padding, setPadding] = useState(40);
  const [align, setAlign] = useState('left');
  const [canvasRadius, setCanvasRadius] = useState(18);
  const [ctaRadius, setCtaRadius] = useState(30);

  const [animation, setAnimation] = useState('none');
  const [playKey, setPlayKey] = useState(0);

  const selectLayer = (key, tool) => {
    setSelectedLayer(key);
    if (tool) setActiveTool(tool);
  };

  const startDrag = (e, layerKey, pos, setPos) => {
    e.preventDefault();
    selectLayer(layerKey, layerKey);
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = pos.left;
    const startTop = pos.top;

    const onMove = (ev) => {
      const dxPct = ((ev.clientX - startX) / canvasRect.width) * 100;
      const dyPct = ((ev.clientY - startY) / canvasRect.height) * 100;
      setPos({
        left: Math.min(85, Math.max(0, startLeft + dxPct)),
        top: Math.min(80, Math.max(0, startTop + dyPct)),
      });
    };
    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  };

  const handleToolClick = (key) => {
    setActiveTool(key);
    if (key === 'title') selectLayer('title');
    else if (key === 'cta') selectLayer('cta');
    else if (key === 'bg') selectLayer('bg');
    else if (key === 'shape') selectLayer('shape');
  };

  const alignMap = { left: 'flex-start', center: 'center', right: 'flex-end' };

  const animClass = animation !== 'none' ? `bs-anim-${animation}` : '';

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <div className="eyebrow green">
            <Icon.Layers size={13} /> Builder
          </div>
          <h2>Design your banner</h2>
          <div className="sub">Drag layers, tweak styles on the right — changes reflect on canvas instantly.</div>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--bs-muted)' }}>
          Editing: {LAYER_NAMES[selectedLayer] || 'Title text'}
        </div>
      </div>

      <div className="builder-grid">
        <div className="tool-rail">
          {TOOLS.map((t) => (
            <button
              key={t.label}
              className={`tool-btn ${activeTool === t.key ? 'active' : ''}`}
              onClick={() => handleToolClick(t.key)}
            >
              {Icon[t.icon]({ size: 19 })}
              {t.label}
            </button>
          ))}
        </div>

        <div className="canvas-area">
          <div className="canvas-toolbar">
            <span className="canvas-dims">1920 × 600 px</span>
            <span className="canvas-dims">Drag layers to reposition</span>
          </div>
          <div
            className="banner-canvas"
            ref={canvasRef}
            style={{ background: bg, borderRadius: canvasRadius, padding }}
          >
            <div className="canvas-blob" />
            <div
              key={`title-${playKey}`}
              className={`layer layer-group ${selectedLayer === 'title' ? 'selected' : ''} ${animClass}`}
              style={{ top: `${titlePos.top}%`, left: `${titlePos.left}%`, alignItems: alignMap[align], textAlign: align }}
              onPointerDown={(e) => startDrag(e, 'title', titlePos, setTitlePos)}
              onClick={() => selectLayer('title', 'title')}
            >
              <div className="layer-title" style={{ fontWeight: titleWeight, fontSize: titleSize, color: titleColor }}>
                Become an AI Engineer
              </div>
              <div className="layer-subtitle">Industry-ready training with real projects, mentorship &amp; placement support</div>
            </div>
            <div
              key={`cta-${playKey}`}
              className={`layer ${selectedLayer === 'cta' ? 'selected' : ''} ${animClass}`}
              style={{ top: `${ctaPos.top}%`, left: `${ctaPos.left}%` }}
              onPointerDown={(e) => startDrag(e, 'cta', ctaPos, setCtaPos)}
              onClick={() => selectLayer('cta', 'cta')}
            >
              <span className="layer-cta" style={{ borderRadius: ctaRadius }}>
                <Icon.ArrowUp size={14} /> Enroll Now
              </span>
            </div>
          </div>
        </div>

        <div className="props-panel">
          <details className="prop-group" open>
            <summary>Background Settings</summary>
            <div className="prop-body">
              <div className="prop-label">Presets</div>
              <div className="swatch-row">
                {BG_PRESETS.map((preset, i) => (
                  <div
                    key={preset}
                    className={`swatch ${activeSwatch === i ? 'active' : ''}`}
                    style={{ background: preset }}
                    onClick={() => {
                      setBg(preset);
                      setActiveSwatch(i);
                    }}
                  />
                ))}
              </div>
              <div className="prop-label">Custom color</div>
              <div className="color-input-row">
                <input
                  type="color"
                  value="#0f172a"
                  onChange={(e) => {
                    setBg(e.target.value);
                    setActiveSwatch(-1);
                  }}
                />
                <span style={{ fontSize: 12, color: 'var(--bs-muted)' }}>Pick a solid background</span>
              </div>
            </div>
          </details>

          <details className="prop-group" open>
            <summary>Typography</summary>
            <div className="prop-body">
              <div className="prop-row">
                <div className="prop-label"><span>Title size</span><span>{titleSize}px</span></div>
                <input type="range" min="18" max="44" value={titleSize} onChange={(e) => setTitleSize(Number(e.target.value))} />
              </div>
              <div className="prop-row">
                <div className="prop-label">Title weight</div>
                <select className="select-mini" value={titleWeight} onChange={(e) => setTitleWeight(e.target.value)}>
                  <option value="600">Semibold</option>
                  <option value="700">Bold</option>
                  <option value="800">Extra Bold</option>
                </select>
              </div>
              <div className="prop-row">
                <div className="prop-label">Title color</div>
                <div className="color-input-row">
                  <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} />
                </div>
              </div>
            </div>
          </details>

          <details className="prop-group">
            <summary>Spacing</summary>
            <div className="prop-body">
              <div className="prop-row">
                <div className="prop-label"><span>Canvas padding</span><span>{padding}px</span></div>
                <input type="range" min="16" max="64" value={padding} onChange={(e) => setPadding(Number(e.target.value))} />
              </div>
            </div>
          </details>

          <details className="prop-group">
            <summary>Alignment</summary>
            <div className="prop-body">
              <div className="align-row">
                <button className={`align-btn ${align === 'left' ? 'active' : ''}`} onClick={() => setAlign('left')}>
                  <Icon.AlignLeft size={15} />
                </button>
                <button className={`align-btn ${align === 'center' ? 'active' : ''}`} onClick={() => setAlign('center')}>
                  <Icon.AlignCenter size={15} />
                </button>
                <button className={`align-btn ${align === 'right' ? 'active' : ''}`} onClick={() => setAlign('right')}>
                  <Icon.AlignRight size={15} />
                </button>
              </div>
            </div>
          </details>

          <details className="prop-group">
            <summary>Border Radius</summary>
            <div className="prop-body">
              <div className="prop-row">
                <div className="prop-label"><span>Canvas corners</span><span>{canvasRadius}px</span></div>
                <input type="range" min="0" max="36" value={canvasRadius} onChange={(e) => setCanvasRadius(Number(e.target.value))} />
              </div>
              <div className="prop-row">
                <div className="prop-label"><span>Button corners</span><span>{ctaRadius}px</span></div>
                <input type="range" min="0" max="40" value={ctaRadius} onChange={(e) => setCtaRadius(Number(e.target.value))} />
              </div>
            </div>
          </details>

          <details className="prop-group">
            <summary>Animations</summary>
            <div className="prop-body">
              <div className="prop-row">
                <select className="select-mini" value={animation} onChange={(e) => setAnimation(e.target.value)}>
                  <option value="none">None</option>
                  <option value="fade">Fade In</option>
                  <option value="slide">Slide Up</option>
                  <option value="zoom">Zoom In</option>
                </select>
              </div>
              <button
                className="btn btn-secondary btn-sm btn-block"
                onClick={() => setPlayKey((k) => k + 1)}
                disabled={animation === 'none'}
              >
                <Icon.Sparkles size={14} /> Preview animation
              </button>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
