# Wallpaper Studio

Minimal title-card wallpaper generator with a NieR-style warm-dark aesthetic.
Canvas-based, fully client-side, exports lossless PNG.

## Stack

React 18 · Vite 5 · lucide-react · jszip · Noto fonts (Google Fonts CDN)

## Running

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle → dist/
```

## Features

### Text
- **Title & subline** — free-form input; subline can be hidden
- **Font family** — Sans (Noto Sans SC) or Serif / Mincho (Noto Serif SC), weights 100 / 300 / 400
- **Subline latin font** — Match the main family, Noto Sans, or Noto Serif

### Canvas
- **Resolution** — 4K, QHD, FHD, Ultrawide, Phone
- **Background** — Solid color, linear gradient, or radial gradient (two color stops; angle control for linear)
- **Text color** — Quick presets + color picker; separate subline color
- **Vignette** — Subtle radial dark overlay

### Type
- **Font weight** — Thin / Light / Regular
- **Title size** — % of canvas height
- **Title & subline letter-spacing** — as a fraction of font size
- **Title opacity** — 0.1 – 1
- **Subline size** — as a fraction of title size

### Effects
- **Title glow** — Shadow-blur halo behind the title; adjustable blur radius and intensity

### Position
- **Vertical** — fraction of canvas height
- **Horizontal alignment** — Left / Center / Right

### Layout
- **Accent line** — Thin hairline between title and subline; configurable color, length, and weight

### Presets
- Save the current settings under a name (in-memory; persists for the session)
- Load or delete saved presets
- **Export** presets to a `.json` file; **Import** a previously exported file
- **Randomize** — picks a tasteful random combination from curated palettes

### Export
- **Download PNG** — current resolution only
- **All sizes** — exports every resolution as PNG files bundled in a single `.zip` (via jszip)
