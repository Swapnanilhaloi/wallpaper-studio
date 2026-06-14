import { useState, useRef, useEffect, useCallback } from "react";
import { Download, RotateCcw } from "lucide-react";

const RES = {
  "4K": [3840, 2160],
  QHD: [2560, 1440],
  FHD: [1920, 1080],
  Ultrawide: [3440, 1440],
  Phone: [1080, 2340],
};

const BG_PRESETS = [
  { name: "Warm Dark", v: "#1d1a15" },
  { name: "Charcoal", v: "#14161a" },
  { name: "Pure Black", v: "#000000" },
  { name: "Deep Navy", v: "#0b1018" },
  { name: "Bone", v: "#e8e4da" },
];

const TXT_PRESETS = [
  { name: "Warm White", v: "#cdcbc6" },
  { name: "White", v: "#ffffff" },
  { name: "Bronze", v: "#c2a878" },
  { name: "Cool Grey", v: "#b8bcc4" },
  { name: "Ink", v: "#1a1a1a" },
];

const WEIGHTS = [
  { name: "Thin", v: 100 },
  { name: "Light", v: 300 },
  { name: "Regular", v: 400 },
];

const DEFAULTS = {
  mainText: "静寂",
  subText: "seijaku · stillness",
  showSub: true,
  resKey: "4K",
  bg: "#1d1a15",
  txt: "#cdcbc6",
  subTxt: "#a8a6a1",
  weight: 100,
  titlePct: 7,
  mainTrack: 0.55,
  subTrack: 0.35,
  subFrac: 0.5,
  vPos: 0.46,
  vignette: false,
};

export default function WallpaperStudio() {
  const [s, setS] = useState(DEFAULTS);
  const [fontsReady, setFontsReady] = useState(false);
  const canvasRef = useRef(null);
  const set = (k) => (v) => setS((p) => ({ ...p, [k]: v }));

  // load CJK + latin thin fonts
  useEffect(() => {
    const id = "wp-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100;300;400&family=Noto+Sans:wght@100;300;400&display=swap";
      document.head.appendChild(link);
    }
    const want = [
      '100 100px "Noto Sans SC"',
      '300 100px "Noto Sans SC"',
      '400 100px "Noto Sans SC"',
      '100 100px "Noto Sans"',
      '300 100px "Noto Sans"',
      '400 100px "Noto Sans"',
    ];
    Promise.all(want.map((f) => document.fonts.load(f).catch(() => {})))
      .then(() => document.fonts.ready)
      .then(() => setFontsReady(true))
      .catch(() => setFontsReady(true));
  }, []);

  const render = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const [W, H] = RES[s.resKey];
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext("2d");

    ctx.fillStyle = s.bg;
    ctx.fillRect(0, 0, W, H);

    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    const fam = '"Noto Sans SC", "Noto Sans", sans-serif';
    const mainPx = (s.titlePct / 100) * H;
    const subPx = s.subFrac * mainPx;
    const mainY = s.vPos * H;
    const subY = mainY + mainPx * 0.78 + subPx * 0.9;

    const spaced = (text, px, track, color, y) => {
      ctx.font = `${s.weight} ${px}px ${fam}`;
      ctx.fillStyle = color;
      const chars = [...text];
      const tr = track * px;
      const widths = chars.map((c) => ctx.measureText(c).width);
      const total = widths.reduce((a, b) => a + b, 0) + tr * Math.max(0, chars.length - 1);
      let x = W / 2 - total / 2;
      chars.forEach((c, i) => {
        ctx.fillText(c, x, y);
        x += widths[i] + tr;
      });
    };

    if (s.mainText) spaced(s.mainText, mainPx, s.mainTrack, s.txt, mainY);
    if (s.showSub && s.subText) spaced(s.subText, subPx, s.subTrack, s.subTxt, subY);

    if (s.vignette) {
      const g = ctx.createRadialGradient(
        W / 2, H * 0.46, Math.min(W, H) * 0.1,
        W / 2, H * 0.46, Math.max(W, H) * 0.75
      );
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
  }, [s]);

  useEffect(() => {
    if (fontsReady) render();
  }, [fontsReady, render]);

  const download = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    cv.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safe = (s.mainText || "wallpaper").replace(/[^\w\u4e00-\u9fff]+/g, "") || "wallpaper";
      a.download = `${safe}-${s.resKey}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const [pw, ph] = RES[s.resKey];

  return (
    <div className="wp-root">
      <style>{css}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100;300;400;500&display=swap" />

      <div className="wp-shell">
        {/* CONTROLS */}
        <aside className="wp-panel">
          <header className="wp-head">
            <div className="wp-eyebrow">壁 紙 ・ studio</div>
            <h1 className="wp-title">Wallpaper Studio</h1>
            <p className="wp-sub">Minimal title-card wallpapers. Type something, tune it, export.</p>
          </header>

          <Section label="Text">
            <Field label="Title">
              <input className="wp-input" value={s.mainText}
                onChange={(e) => set("mainText")(e.target.value)} placeholder="静寂" />
            </Field>
            <Field label="Subline"
              right={
                <button className={`wp-toggle ${s.showSub ? "on" : ""}`}
                  onClick={() => set("showSub")(!s.showSub)}>
                  {s.showSub ? "shown" : "hidden"}
                </button>
              }>
              <input className="wp-input" value={s.subText} disabled={!s.showSub}
                onChange={(e) => set("subText")(e.target.value)} placeholder="seijaku · stillness" />
            </Field>
          </Section>

          <Section label="Canvas">
            <Field label="Resolution">
              <div className="wp-seg">
                {Object.keys(RES).map((k) => (
                  <button key={k} className={`wp-seg-b ${s.resKey === k ? "on" : ""}`}
                    onClick={() => set("resKey")(k)}>{k}</button>
                ))}
              </div>
            </Field>

            <Field label="Background" right={<Swatch v={s.bg} onPick={set("bg")} />}>
              <div className="wp-presets">
                {BG_PRESETS.map((p) => (
                  <button key={p.v} title={p.name}
                    className={`wp-chip ${s.bg === p.v ? "on" : ""}`}
                    style={{ background: p.v }} onClick={() => set("bg")(p.v)} />
                ))}
              </div>
            </Field>

            <Field label="Text color" right={<Swatch v={s.txt} onPick={set("txt")} />}>
              <div className="wp-presets">
                {TXT_PRESETS.map((p) => (
                  <button key={p.v} title={p.name}
                    className={`wp-chip ${s.txt === p.v ? "on" : ""}`}
                    style={{ background: p.v }} onClick={() => set("txt")(p.v)} />
                ))}
              </div>
            </Field>

            <div className="wp-row">
              <span className="wp-check" onClick={() => set("vignette")(!s.vignette)}>
                <span className={`wp-box ${s.vignette ? "on" : ""}`} />
                Vignette
              </span>
            </div>
          </Section>

          <Section label="Type">
            <Field label="Weight">
              <div className="wp-seg">
                {WEIGHTS.map((w) => (
                  <button key={w.v} className={`wp-seg-b ${s.weight === w.v ? "on" : ""}`}
                    onClick={() => set("weight")(w.v)}>{w.name}</button>
                ))}
              </div>
            </Field>
            <Slider label="Title size" v={s.titlePct} min={3} max={18} step={0.5}
              suffix="%h" onChange={set("titlePct")} />
            <Slider label="Title spacing" v={s.mainTrack} min={0} max={1.2} step={0.01}
              onChange={set("mainTrack")} />
            <Slider label="Subline size" v={s.subFrac} min={0.25} max={0.9} step={0.01}
              onChange={set("subFrac")} />
            <Slider label="Subline spacing" v={s.subTrack} min={0} max={1} step={0.01}
              onChange={set("subTrack")} />
          </Section>

          <Section label="Position">
            <Slider label="Vertical" v={s.vPos} min={0.2} max={0.8} step={0.005}
              onChange={set("vPos")} />
          </Section>

          <div className="wp-actions">
            <button className="wp-btn ghost" onClick={() => setS(DEFAULTS)}>
              <RotateCcw size={14} /> Reset
            </button>
            <button className="wp-btn primary" onClick={download}>
              <Download size={15} /> Download PNG
            </button>
          </div>
        </aside>

        {/* PREVIEW */}
        <main className="wp-stage">
          <div className="wp-stage-inner">
            <div className="wp-canvas-wrap" style={{ aspectRatio: `${pw} / ${ph}` }}>
              <canvas ref={canvasRef} className="wp-canvas" />
              {!fontsReady && <div className="wp-loading">loading type…</div>}
            </div>
            <div className="wp-meta">
              <span>{s.resKey}</span>
              <span className="wp-dot">·</span>
              <span>{pw} × {ph}</span>
              <span className="wp-dot">·</span>
              <span>PNG</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <section className="wp-section">
      <div className="wp-section-label">{label}</div>
      <div className="wp-section-body">{children}</div>
    </section>
  );
}

function Field({ label, right, children }) {
  return (
    <div className="wp-field">
      <div className="wp-field-top">
        <span className="wp-field-label">{label}</span>
        {right}
      </div>
      {children}
    </div>
  );
}

function Slider({ label, v, min, max, step, suffix, onChange }) {
  const display = step < 0.1 ? Number(v).toFixed(2) : v;
  return (
    <div className="wp-slider">
      <div className="wp-field-top">
        <span className="wp-field-label">{label}</span>
        <span className="wp-val">{display}{suffix || ""}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={v}
        onChange={(e) => onChange(parseFloat(e.target.value))} />
    </div>
  );
}

function Swatch({ v, onPick }) {
  return (
    <label className="wp-swatch" style={{ background: v }}>
      <input type="color" value={v} onChange={(e) => onPick(e.target.value)} />
    </label>
  );
}

const css = `
.wp-root{
  --bg:#100e0a; --panel:#181511; --panel2:#201c16; --line:#2c2820;
  --txt:#d6d3cc; --dim:#8c877d; --faint:#5e584e; --accent:#c2a878;
  font-family:"Noto Sans",system-ui,sans-serif;
  background:var(--bg); color:var(--txt);
  min-height:100%; width:100%;
}
.wp-root *{box-sizing:border-box;}
.wp-shell{display:flex; min-height:640px;}
@media (max-width:880px){ .wp-shell{flex-direction:column;} }

/* PANEL */
.wp-panel{
  width:360px; flex:none; background:var(--panel);
  border-right:1px solid var(--line);
  padding:26px 22px 22px; overflow-y:auto; max-height:88vh;
}
@media (max-width:880px){ .wp-panel{width:100%; max-height:none; border-right:none; border-bottom:1px solid var(--line);} }

.wp-head{margin-bottom:22px;}
.wp-eyebrow{font-size:11px; letter-spacing:.42em; color:var(--accent); font-weight:300; text-transform:lowercase; margin-bottom:12px;}
.wp-title{font-size:21px; font-weight:200; letter-spacing:.04em; margin:0 0 6px;}
.wp-sub{font-size:12.5px; line-height:1.5; color:var(--dim); margin:0; font-weight:300;}

.wp-section{margin-top:22px;}
.wp-section-label{
  font-size:10px; letter-spacing:.34em; text-transform:uppercase;
  color:var(--faint); font-weight:400; margin-bottom:14px;
  padding-bottom:9px; border-bottom:1px solid var(--line);
}
.wp-section-body{display:flex; flex-direction:column; gap:16px;}

.wp-field{display:flex; flex-direction:column; gap:8px;}
.wp-field-top{display:flex; align-items:center; justify-content:space-between; min-height:18px;}
.wp-field-label{font-size:12px; color:var(--dim); font-weight:300; letter-spacing:.02em;}
.wp-val{font-size:11px; color:var(--accent); font-weight:300; font-variant-numeric:tabular-nums;}

.wp-input{
  width:100%; background:var(--panel2); border:1px solid var(--line);
  color:var(--txt); padding:10px 12px; border-radius:7px;
  font-family:inherit; font-size:14px; font-weight:300; letter-spacing:.04em;
  outline:none; transition:border-color .15s;
}
.wp-input:focus{border-color:var(--accent);}
.wp-input:disabled{opacity:.4;}
.wp-input::placeholder{color:var(--faint);}

.wp-seg{display:flex; gap:6px; flex-wrap:wrap;}
.wp-seg-b{
  flex:1; min-width:54px; background:var(--panel2); border:1px solid var(--line);
  color:var(--dim); padding:8px 6px; border-radius:6px; cursor:pointer;
  font-family:inherit; font-size:11.5px; font-weight:300; letter-spacing:.04em;
  transition:all .14s;
}
.wp-seg-b:hover{color:var(--txt); border-color:#3a352b;}
.wp-seg-b.on{background:var(--accent); color:#1a160f; border-color:var(--accent); font-weight:400;}

.wp-presets{display:flex; gap:8px;}
.wp-chip{
  width:30px; height:30px; border-radius:6px; cursor:pointer;
  border:1px solid rgba(255,255,255,.08); transition:transform .12s, box-shadow .12s;
}
.wp-chip:hover{transform:translateY(-2px);}
.wp-chip.on{box-shadow:0 0 0 2px var(--bg), 0 0 0 3px var(--accent);}

.wp-swatch{
  width:24px; height:18px; border-radius:4px; cursor:pointer; display:inline-block;
  border:1px solid rgba(255,255,255,.14); overflow:hidden; position:relative;
}
.wp-swatch input{position:absolute; inset:-4px; opacity:0; cursor:pointer;}

.wp-toggle{
  background:none; border:1px solid var(--line); color:var(--dim);
  font-size:10px; letter-spacing:.1em; padding:3px 9px; border-radius:20px;
  cursor:pointer; font-family:inherit; transition:all .14s;
}
.wp-toggle.on{color:var(--accent); border-color:var(--accent);}

.wp-row{display:flex;}
.wp-check{display:inline-flex; align-items:center; gap:9px; cursor:pointer; font-size:12px; color:var(--dim); font-weight:300; user-select:none;}
.wp-box{width:15px; height:15px; border:1px solid var(--line); border-radius:4px; transition:all .14s;}
.wp-box.on{background:var(--accent); border-color:var(--accent);}

.wp-slider{display:flex; flex-direction:column; gap:9px;}
.wp-slider input[type=range]{
  -webkit-appearance:none; appearance:none; width:100%; height:3px;
  background:var(--line); border-radius:3px; outline:none; cursor:pointer;
}
.wp-slider input[type=range]::-webkit-slider-thumb{
  -webkit-appearance:none; width:14px; height:14px; border-radius:50%;
  background:var(--accent); cursor:pointer; border:2px solid var(--panel);
}
.wp-slider input[type=range]::-moz-range-thumb{
  width:14px; height:14px; border-radius:50%; background:var(--accent);
  cursor:pointer; border:2px solid var(--panel);
}

.wp-actions{display:flex; gap:10px; margin-top:26px; padding-top:20px; border-top:1px solid var(--line);}
.wp-btn{
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  border-radius:8px; padding:12px 14px; cursor:pointer; font-family:inherit;
  font-size:13px; font-weight:400; letter-spacing:.04em; transition:all .15s; border:1px solid transparent;
}
.wp-btn.primary{flex:1; background:var(--accent); color:#1a160f;}
.wp-btn.primary:hover{background:#d4ba8c;}
.wp-btn.ghost{background:transparent; border-color:var(--line); color:var(--dim);}
.wp-btn.ghost:hover{color:var(--txt); border-color:#3a352b;}

/* STAGE */
.wp-stage{flex:1; display:flex; align-items:center; justify-content:center; padding:40px; background:
  radial-gradient(120% 120% at 50% 35%, #16130e 0%, var(--bg) 70%);}
.wp-stage-inner{width:100%; max-width:860px; display:flex; flex-direction:column; align-items:center; gap:16px;}
.wp-canvas-wrap{
  width:100%; position:relative; border:1px solid var(--line); border-radius:10px;
  overflow:hidden; box-shadow:0 30px 70px -30px rgba(0,0,0,.8);
}
.wp-canvas{display:block; width:100%; height:100%;}
.wp-loading{position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  font-size:12px; letter-spacing:.3em; color:var(--faint); background:var(--bg);}
.wp-meta{font-size:11px; letter-spacing:.18em; color:var(--faint); display:flex; gap:10px; font-weight:300; text-transform:uppercase;}
.wp-dot{color:var(--line);}
`;
