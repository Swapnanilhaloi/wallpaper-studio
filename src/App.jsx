import { useState, useRef, useEffect, useCallback } from "react";
import { Download, RotateCcw, Shuffle, Dices, Sun, Moon } from "lucide-react";

const RES = {
  "4K": [3840, 2160],
  QHD: [2560, 1440],
  FHD: [1920, 1080],
  Ultrawide: [3440, 1440],
  Phone: [1080, 2340],
};

const KANJI_LIST = [
  { k: "静寂", s: "seijaku · stillness" },
  { k: "無", s: "mu · nothingness" },
  { k: "空", s: "kuu · emptiness" },
  { k: "間", s: "ma · negative space" },
  { k: "幽玄", s: "yūgen · mysterious beauty" },
  { k: "侘寂", s: "wabi-sabi · imperfect beauty" },
  { k: "刹那", s: "setsuna · a fleeting moment" },
  { k: "木漏れ日", s: "komorebi · sunlight through leaves" },
  { k: "物哀", s: "mono no aware · pathos of things" },
  { k: "沈黙", s: "chinmoku · silence" },
  { k: "孤独", s: "kodoku · solitude" },
  { k: "永遠", s: "eien · eternity" },
  { k: "虚無", s: "kyomu · void" },
  { k: "余白", s: "yohaku · empty space" },
  { k: "深淵", s: "shin'en · abyss" },
  { k: "廃墟", s: "haikyo · ruins" },
  { k: "忘却", s: "bōkyaku · oblivion" },
  { k: "彼岸", s: "higan · the other shore" },
  { k: "記憶", s: "kioku · memory" },
  { k: "黄昏", s: "tasogare · dusk" },
  { k: "暁", s: "akatsuki · dawn" },
  { k: "霧", s: "kiri · mist" },
  { k: "影", s: "kage · shadow" },
  { k: "嵐", s: "arashi · storm" },
  { k: "雪", s: "yuki · snow" },
  { k: "月", s: "tsuki · moon" },
  { k: "星", s: "hoshi · star" },
  { k: "光", s: "hikari · light" },
  { k: "夢", s: "yume · dream" },
  { k: "闇", s: "yami · darkness" },
  { k: "魂", s: "tamashii · soul" },
  { k: "桜", s: "sakura · cherry blossom" },
  { k: "霞", s: "kasumi · haze" },
  { k: "灰", s: "hai · ash" },
  { k: "涙", s: "namida · tears" },
  { k: "境界", s: "kyōkai · boundary" },
  { k: "消滅", s: "shōmetsu · annihilation" },
  { k: "自由", s: "jiyū · freedom" },
  { k: "平和", s: "heiwa · peace" },
  { k: "山", s: "yama · mountain" },
  { k: "海", s: "umi · sea" },
  { k: "風", s: "kaze · wind" },
  { k: "花", s: "hana · flower" },
  { k: "水", s: "mizu · water" },
  { k: "炎", s: "honoo · flame" },
  { k: "氷", s: "kōri · ice" },
  { k: "竹", s: "take · bamboo" },
  { k: "森", s: "mori · forest" },
  { k: "川", s: "kawa · river" },
  { k: "空虚", s: "kūkyo · emptiness of heart" },
  { k: "無常", s: "mujō · impermanence" },
  { k: "静謐", s: "seihitsu · tranquility" },
  { k: "孤高", s: "kokō · solitary dignity" },
  { k: "残響", s: "zankyō · lingering echo" },
  { k: "終焉", s: "shūen · the end" },
  { k: "始まり", s: "hajimari · beginning" },
  { k: "願い", s: "negai · a wish" },
  { k: "旅", s: "tabi · journey" },
  { k: "道", s: "michi · the way" },
  { k: "心", s: "kokoro · heart" },
  { k: "美", s: "bi · beauty" },
  { k: "真実", s: "shinjitsu · truth" },
  { k: "幻", s: "maboroshi · illusion" },
  { k: "宿命", s: "shukumei · destiny" },
  { k: "孤影", s: "koei · lone shadow" },
  { k: "無限", s: "mugen · infinity" },
  { k: "静止", s: "seishi · stillness of motion" },
  { k: "余韻", s: "yoin · lingering resonance" },
  { k: "薄明", s: "hakumei · twilight" },
  { k: "朝露", s: "asatsuyu · morning dew" },
  { k: "秋風", s: "akikaze · autumn wind" },
];

const BG_PRESETS = [
  { name: "Warm Dark", v: "#1d1a15" },
  { name: "Charcoal", v: "#14161a" },
  { name: "Pure Black", v: "#000000" },
  { name: "Deep Navy", v: "#0b1018" },
  { name: "Bone", v: "#e8e4da" },
  { name: "Espresso", v: "#241a12" },
  { name: "Forest", v: "#101c14" },
  { name: "Wine", v: "#1f0f14" },
  { name: "Slate", v: "#1b2027" },
  { name: "Plum", v: "#1a1420" },
  { name: "Rust", v: "#2a160e" },
  { name: "Ivory", v: "#f2ede1" },
];

const TXT_PRESETS = [
  { name: "Warm White", v: "#cdcbc6" },
  { name: "White", v: "#ffffff" },
  { name: "Bronze", v: "#c2a878" },
  { name: "Cool Grey", v: "#b8bcc4" },
  { name: "Ink", v: "#1a1a1a" },
];

const GRADIENT_PRESETS = [
  { name: "Sunset Ember", bg: "#2a160e", bg2: "#4a2418", angle: 135 },
  { name: "Ocean Depth", bg: "#0b1018", bg2: "#132234", angle: 160 },
  { name: "Amber Fade", bg: "#1d1a15", bg2: "#3a2c1a", angle: 120 },
  { name: "Midnight Plum", bg: "#141018", bg2: "#241a2c", angle: 145 },
  { name: "Forest Mist", bg: "#0e1610", bg2: "#1c2c1e", angle: 150 },
  { name: "Rose Quartz", bg: "#1f0f14", bg2: "#3a1a22", angle: 130 },
  { name: "Steel", bg: "#14161a", bg2: "#242830", angle: 165 },
  { name: "Bone Haze", bg: "#e8e4da", bg2: "#cfc7b6", angle: 135 },
];

const STYLE_PRESETS = [
  { name: "Minimal Thin", weight: 100, mainTrack: 0.55, titlePct: 7, fontFamily: "sans" },
  { name: "Editorial Serif", weight: 300, mainTrack: 0.25, titlePct: 8, fontFamily: "serif" },
  { name: "Bold Statement", weight: 700, mainTrack: 0.1, titlePct: 10, fontFamily: "sans" },
  { name: "Wide Elegant", weight: 200, mainTrack: 1.0, titlePct: 6, fontFamily: "sans" },
  { name: "Classic Mincho", weight: 400, mainTrack: 0.4, titlePct: 7.5, fontFamily: "serif" },
];

const WEIGHTS = [
  { name: "Thin", v: 200 },
  { name: "Light", v: 300 },
  { name: "Regular", v: 400 },
  { name: "Medium", v: 500 },
  { name: "Semi", v: 600 },
  { name: "Bold", v: 700 },
];

const FONT_FAMILIES = [
  { name: "Sans", v: "sans", cjk: "Noto Sans SC", lat: "Noto Sans" },
  { name: "Serif · Mincho", v: "serif", cjk: "Noto Serif SC", lat: "Noto Serif" },
  { name: "Mono", v: "mono", cjk: "Noto Sans SC", lat: "Noto Sans Mono" },
  { name: "Rounded", v: "rounded", cjk: "M PLUS Rounded 1c", lat: "Quicksand" },
  { name: "Elegant", v: "elegant", cjk: "Noto Serif SC", lat: "Cormorant Garamond" },
  { name: "Condensed", v: "condensed", cjk: "Noto Sans SC", lat: "Oswald" },
];

const BG_TYPES = ["solid", "linear", "radial"];

const DEFAULTS = {
  mainText: "静寂",
  subText: "seijaku · stillness",
  showSub: true,
  resKey: "4K",
  bg: "#1d1a15",
  bg2: "#2c241b",
  bgType: "solid",
  gradAngle: 135,
  txt: "#cdcbc6",
  subTxt: "#a8a6a1",
  weight: 100,
  titlePct: 7,
  mainTrack: 0.55,
  subTrack: 0.35,
  subFrac: 0.5,
  vPos: 0.46,
  hPos: 0.5,
  vignette: false,
  fontFamily: "sans",
  titleOpacity: 1,
  glow: false,
  glowBlur: 18,
  glowIntensity: 0.4,
  accentLine: false,
  accentLineWidth: 1,
  accentLineLength: 0.15,
  accentLineColor: "#c2a878",
};

// ── Name → Katakana ──────────────────────────────────────────────────────────
const NAME_KAT = {
  // Male
  aaron:"アーロン", adam:"アダム", alan:"アラン",
  alex:"アレックス", alexander:"アレクサンダー", alexis:"アレクシス",
  andrew:"アンドリュー", anthony:"アンソニー", austin:"オースティン",
  ben:"ベン", benjamin:"ベンジャミン", blake:"ブレイク",
  brandon:"ブランドン", brian:"ブライアン",
  caleb:"ケイレブ", cameron:"キャメロン", carlos:"カルロス",
  charles:"チャールズ", christian:"クリスチャン", christopher:"クリストファー",
  cole:"コール", conor:"コナー",
  daniel:"ダニエル", david:"デイビッド", dean:"ディーン", dylan:"ディラン",
  edward:"エドワード", eli:"イライ", eric:"エリック",
  ethan:"イーサン", evan:"エバン",
  gabriel:"ガブリエル", george:"ジョージ", grant:"グラント",
  henry:"ヘンリー", hunter:"ハンター",
  ian:"イアン",
  jack:"ジャック", jackson:"ジャクソン", jacob:"ジェイコブ",
  james:"ジェームズ", jason:"ジェイソン", jayden:"ジェイデン",
  john:"ジョン", jonathan:"ジョナサン", jordan:"ジョーダン",
  joseph:"ジョセフ", joshua:"ジョシュア", julian:"ジュリアン",
  kevin:"ケビン",
  liam:"リアム", logan:"ローガン", lucas:"ルーカス", luke:"ルーク",
  mark:"マーク", matthew:"マシュー", max:"マックス",
  michael:"マイケル", miguel:"ミゲル",
  nathan:"ネイサン", nicholas:"ニコラス", noah:"ノア",
  oliver:"オリバー", oscar:"オスカー", owen:"オーウェン",
  patrick:"パトリック", paul:"ポール", peter:"ピーター", philip:"フィリップ",
  richard:"リチャード", robert:"ロバート", ryan:"ライアン",
  samuel:"サミュエル", sebastian:"セバスチャン", simon:"サイモン",
  stephen:"スティーブン", steven:"スティーブン",
  thomas:"トーマス", tim:"ティム", timothy:"ティモシー", tyler:"タイラー",
  victor:"ビクター", vincent:"ヴィンセント",
  william:"ウィリアム", xavier:"ザビエル",
  // Female
  abigail:"アビゲイル", alice:"アリス", alicia:"アリシア",
  amanda:"アマンダ", amelia:"アメリア", amy:"エイミー",
  anna:"アンナ", anne:"アン", aria:"アリア", ariel:"アリエル",
  ashley:"アシュリー", audrey:"オードリー", aurora:"オーロラ", ava:"エイバ",
  bella:"ベラ", brooklyn:"ブルックリン",
  camila:"カミラ", charlotte:"シャーロット", chloe:"クロエ",
  claire:"クレア", clara:"クララ",
  daisy:"デイジー", diana:"ダイアナ",
  elena:"エレナ", elise:"エリーゼ", elizabeth:"エリザベス",
  ella:"エラ", ellie:"エリー", emily:"エミリー", emma:"エマ",
  eva:"エバ", eve:"イヴ",
  faith:"フェイス", freya:"フレイア",
  grace:"グレース",
  hannah:"ハンナ", harper:"ハーパー", hazel:"ヘイゼル", helen:"ヘレン",
  isabella:"イザベラ", ivy:"アイビー",
  jade:"ジェイド", jessica:"ジェシカ", julia:"ジュリア", juliette:"ジュリエット",
  katherine:"キャサリン", katie:"ケイティ",
  laura:"ローラ", lauren:"ローレン", lily:"リリー",
  lisa:"リサ", lucy:"ルーシー", luna:"ルナ",
  madison:"マディソン", maria:"マリア", mary:"メアリー",
  maya:"マヤ", mia:"ミア", miranda:"ミランダ",
  natalie:"ナタリー", natasha:"ナターシャ", nicole:"ニコル", nora:"ノラ",
  olivia:"オリビア",
  penelope:"ペネロペ",
  rachel:"レイチェル", rebecca:"レベッカ", rose:"ローズ", ruby:"ルビー",
  samantha:"サマンサ", sarah:"サラ", scarlett:"スカーレット",
  sofia:"ソフィア", sophia:"ソフィア", sophie:"ソフィー", stella:"ステラ",
  tanya:"ターニャ", taylor:"テイラー",
  victoria:"ビクトリア", violet:"ヴァイオレット",
  wendy:"ウェンディ",
  zoe:"ゾーイ",
};

function phoneticToKat(s) {
  s = s.toLowerCase()
    .replace(/tion/g, "shon").replace(/sion/g, "shon")
    .replace(/tch/g, "ch").replace(/ck/g, "k").replace(/ph/g, "f")
    .replace(/wh/g, "w").replace(/kn/g, "n").replace(/wr/g, "r")
    .replace(/gh/g, "").replace(/qu/g, "kw").replace(/x/g, "ks")
    .replace(/([bcdfgklpst])\1/g, "ッ$1");

  const R = [
    ["sha","シャ"],["shi","シ"],["shu","シュ"],["she","シェ"],["sho","ショ"],
    ["cha","チャ"],["chi","チ"],["chu","チュ"],["che","チェ"],["cho","チョ"],
    ["tha","ザ"],["the","ゼ"],["thi","ジ"],["tho","ゾ"],["thu","ズ"],
    ["dge","ジ"],["kwa","クワ"],["kwe","クェ"],["kwo","クォ"],
    ["ai","アイ"],["ay","エイ"],["au","オー"],
    ["ea","イー"],["ee","イー"],["ei","エイ"],["ey","エイ"],
    ["ie","イー"],["ia","イア"],["io","イオ"],
    ["oa","オー"],["oe","オー"],
    ["oo","ウー"],["ou","アウ"],["ow","オー"],
    ["ue","ウー"],["ui","ウィ"],["uy","アイ"],
    ["ly","リー"],["ry","リー"],["ny","ニー"],["my","ミー"],
    ["dy","ディー"],["ty","ティー"],["cy","シー"],["py","ピー"],["gy","ジー"],["by","ビー"],
    ["ba","バ"],["bi","ビ"],["bu","ブ"],["be","ベ"],["bo","ボ"],
    ["ca","カ"],["ci","シ"],["ce","セ"],["co","コ"],["cu","キュ"],
    ["da","ダ"],["di","ディ"],["du","デュ"],["de","デ"],["do","ド"],
    ["fa","ファ"],["fi","フィ"],["fu","フ"],["fe","フェ"],["fo","フォ"],
    ["ga","ガ"],["gi","ジ"],["gu","グ"],["ge","ジェ"],["go","ゴ"],
    ["ha","ハ"],["hi","ヒ"],["hu","ヒュ"],["he","ヘ"],["ho","ホ"],
    ["ja","ジャ"],["ji","ジ"],["ju","ジュ"],["je","ジェ"],["jo","ジョ"],
    ["ka","カ"],["ki","キ"],["ku","ク"],["ke","ケ"],["ko","コ"],
    ["la","ラ"],["li","リ"],["lu","ル"],["le","レ"],["lo","ロ"],
    ["ma","マ"],["mi","ミ"],["mu","ム"],["me","メ"],["mo","モ"],
    ["na","ナ"],["ni","ニ"],["nu","ヌ"],["ne","ネ"],["no","ノ"],
    ["pa","パ"],["pi","ピ"],["pu","プ"],["pe","ペ"],["po","ポ"],
    ["ra","ラ"],["ri","リ"],["ru","ル"],["re","レ"],["ro","ロ"],
    ["sa","サ"],["si","シ"],["su","ス"],["se","セ"],["so","ソ"],
    ["ta","タ"],["ti","ティ"],["tu","テュ"],["te","テ"],["to","ト"],
    ["va","ヴァ"],["vi","ヴィ"],["vu","ヴ"],["ve","ヴェ"],["vo","ヴォ"],
    ["wa","ワ"],["wi","ウィ"],["we","ウェ"],["wo","ウォ"],
    ["ya","ヤ"],["yu","ユ"],["ye","イェ"],["yo","ヨ"],
    ["za","ザ"],["zi","ジ"],["zu","ズ"],["ze","ゼ"],["zo","ゾ"],
    ["kw","クウ"],
    ["a","ア"],["e","エ"],["i","イ"],["o","オ"],["u","ウ"],["y","イ"],
    ["b","ブ"],["c","ク"],["d","ド"],["f","フ"],["g","グ"],["h","ハ"],
    ["j","ジ"],["k","ク"],["l","ル"],["m","ム"],["n","ン"],["p","プ"],
    ["r","ル"],["s","ス"],["t","ト"],["v","ヴ"],["w","ウ"],["z","ズ"],
  ];

  let res = "", i = 0;
  while (i < s.length) {
    if (s[i] === "ッ") { res += "ッ"; i++; continue; }
    let hit = false;
    for (const [from, to] of R) {
      if (s.startsWith(from, i)) { res += to; i += from.length; hit = true; break; }
    }
    if (!hit) i++;
  }
  return res || s;
}

function toKatakana(input) {
  return input.trim().split(/\s+/).map(w => {
    const lw = w.toLowerCase();
    return NAME_KAT[lw] || phoneticToKat(lw);
  }).join("・");
}
// ─────────────────────────────────────────────────────────────────────────────

// Pure render function — called for both preview and batch export
function renderCanvas(ctx, W, H, s) {
  // Background
  let fillStyle;
  if (s.bgType === "linear") {
    const angle = (s.gradAngle * Math.PI) / 180;
    const d = Math.sqrt(W * W + H * H) / 2;
    const cx = W / 2, cy = H / 2;
    const g = ctx.createLinearGradient(
      cx - Math.cos(angle) * d, cy - Math.sin(angle) * d,
      cx + Math.cos(angle) * d, cy + Math.sin(angle) * d
    );
    g.addColorStop(0, s.bg);
    g.addColorStop(1, s.bg2);
    fillStyle = g;
  } else if (s.bgType === "radial") {
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
    g.addColorStop(0, s.bg);
    g.addColorStop(1, s.bg2);
    fillStyle = g;
  } else {
    fillStyle = s.bg;
  }
  ctx.fillStyle = fillStyle;
  ctx.fillRect(0, 0, W, H);

  // Font families
  const fam = FONT_FAMILIES.find((f) => f.v === s.fontFamily) || FONT_FAMILIES[0];
  const cjkFam = fam.cjk;
  const latFam = fam.lat;
  const mainFam = `"${cjkFam}", "${latFam}", sans-serif`;
  const subFam = `"${latFam}", "${cjkFam}", sans-serif`;

  // Sizes & positions
  const mainPx = (s.titlePct / 100) * H;
  const subPx = s.subFrac * mainPx;
  const mainY = s.vPos * H;
  const subY = mainY + mainPx * 0.78 + subPx * 0.9;

  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  // Draws letter-spaced text with alignment, returns startX and total width
  const spaced = (text, px, track, color, y, fam) => {
    ctx.font = `${s.weight} ${px}px ${fam}`;
    ctx.fillStyle = color;
    const chars = [...text];
    const tr = track * px;
    const widths = chars.map((c) => ctx.measureText(c).width);
    const total = widths.reduce((a, b) => a + b, 0) + tr * Math.max(0, chars.length - 1);
    const margin = W * 0.08;
    let x = margin + s.hPos * Math.max(0, W - margin * 2 - total);
    const startX = x;
    chars.forEach((c, i) => { ctx.fillText(c, x, y); x += widths[i] + tr; });
    return { startX, total };
  };

  // Glow pass (shadow blur creates halo, drawn at reduced opacity before sharp text)
  if (s.glow && s.mainText) {
    ctx.save();
    ctx.shadowColor = s.txt;
    ctx.shadowBlur = (s.glowBlur / 100) * mainPx;
    ctx.globalAlpha = s.glowIntensity;
    spaced(s.mainText, mainPx, s.mainTrack, s.txt, mainY, mainFam);
    ctx.restore();
  }

  // Title (sharp pass)
  if (s.mainText) {
    ctx.globalAlpha = s.titleOpacity;
    spaced(s.mainText, mainPx, s.mainTrack, s.txt, mainY, mainFam);
    ctx.globalAlpha = 1;
  }

  // Accent line — sits between title and subline
  if (s.accentLine) {
    const lineLen = s.accentLineLength * W;
    const margin = W * 0.08;
    const lineX = margin + s.hPos * Math.max(0, W - margin * 2 - lineLen);
    const lineY = mainY + mainPx * 0.64 + subPx * 0.2;
    ctx.beginPath();
    ctx.moveTo(lineX, lineY);
    ctx.lineTo(lineX + lineLen, lineY);
    ctx.strokeStyle = s.accentLineColor;
    ctx.lineWidth = s.accentLineWidth * (H / 1080);
    ctx.stroke();
  }

  // Subline
  if (s.showSub && s.subText) {
    spaced(s.subText, subPx, s.subTrack, s.subTxt, subY, subFam);
  }

  // Vignette
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
}

// Curated palettes for Randomize
const RAND_PALETTES = [
  { bg: "#0f0d0a", bg2: "#1d1510", txt: "#cdcbc6", subTxt: "#a8a6a1" },
  { bg: "#14161a", bg2: "#0b0f18", txt: "#b8bcc4", subTxt: "#6b7280" },
  { bg: "#0b1018", bg2: "#141c2c", txt: "#c4d0e0", subTxt: "#8a9bb0" },
  { bg: "#1a1510", bg2: "#2a1e10", txt: "#c2a878", subTxt: "#8c7a5e" },
  { bg: "#1c1c1c", bg2: "#2a2a2a", txt: "#e8e4da", subTxt: "#b0aca5" },
  { bg: "#e8e4da", bg2: "#d4cfc4", txt: "#1a1a1a", subTxt: "#4a4540" },
];

export default function WallpaperStudio() {
  const [s, setS] = useState(DEFAULTS);
  const [fontsReady, setFontsReady] = useState(false);
  const [presets, setPresets] = useState([]);
  const [presetName, setPresetName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [batching, setBatching] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("wp-theme") || "dark";
    } catch {
      return "dark";
    }
  });
  const canvasRef = useRef(null);
  const set = (k) => (v) => setS((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    try { localStorage.setItem("wp-theme", theme); } catch {}
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // Load CJK + latin fonts (both Sans and Serif)
  useEffect(() => {
    const id = "wp-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?" +
        "family=Noto+Sans+SC:wght@100;300;400;500;600;700" +
        "&family=Noto+Serif+SC:wght@100;300;400;500;600;700" +
        "&family=Noto+Sans:wght@100;300;400;500;600;700" +
        "&family=Noto+Serif:wght@100;300;400;500;600;700" +
        "&family=Noto+Sans+Mono:wght@100;300;400;500;600;700" +
        "&family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800" +
        "&family=Quicksand:wght@300;400;500;600;700" +
        "&family=Cormorant+Garamond:wght@300;400;500;600;700" +
        "&family=Oswald:wght@200;300;400;500;600;700" +
        "&display=swap";
      document.head.appendChild(link);
    }
    const cjkFonts = ["Noto Sans SC", "Noto Serif SC", "M PLUS Rounded 1c"];
    const latFonts = ["Noto Sans", "Noto Serif", "Noto Sans Mono", "Quicksand", "Cormorant Garamond", "Oswald"];
    const want = [100, 300, 400, 500, 600, 700].flatMap((w) =>
      [...cjkFonts, ...latFonts].map((f) => `${w} 100px "${f}"`)
    );
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
    renderCanvas(cv.getContext("2d"), W, H, s);
  }, [s]);

  useEffect(() => { if (fontsReady) render(); }, [fontsReady, render]);

  // Single-resolution PNG download
  const download = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    cv.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safe = (s.mainText || "wallpaper").replace(/[^\w一-鿿]+/g, "") || "wallpaper";
      a.download = `${safe}-${s.resKey}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  // Batch export: all resolutions zipped via jszip
  const batchExport = async () => {
    setBatching(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const cv = document.createElement("canvas");
      const safe = (s.mainText || "wallpaper").replace(/[^\w一-鿿]+/g, "") || "wallpaper";
      for (const [key, [W, H]] of Object.entries(RES)) {
        cv.width = W;
        cv.height = H;
        renderCanvas(cv.getContext("2d"), W, H, s);
        const blob = await new Promise((res) => cv.toBlob(res, "image/png"));
        zip.file(`${safe}-${key}.png`, blob);
      }
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safe}-batch.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBatching(false);
    }
  };

  // Preset management
  const savePreset = () => {
    if (!presetName.trim()) return;
    setPresets((p) => [...p, { name: presetName.trim(), settings: { ...s } }]);
    setPresetName("");
  };
  const loadPreset = (p) => setS(p.settings);
  const deletePreset = (i) => setPresets((p) => p.filter((_, idx) => idx !== i));

  const exportPresets = () => {
    const blob = new Blob([JSON.stringify(presets, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wallpaper-presets.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importPresets = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (Array.isArray(imported)) setPresets((p) => [...p, ...imported]);
      } catch {}
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const applyName = () => {
    const raw = nameInput.trim();
    if (!raw) return;
    setS((p) => ({ ...p, mainText: toKatakana(raw), subText: raw, showSub: true }));
  };

  const generateKanji = () => {
    const entry = KANJI_LIST[Math.floor(Math.random() * KANJI_LIST.length)];
    setS((p) => ({ ...p, mainText: entry.k, subText: entry.s, showSub: true }));
  };

  const randomize = () => {
    const pal = RAND_PALETTES[Math.floor(Math.random() * RAND_PALETTES.length)];
    const rnd = (min, max) => min + Math.random() * (max - min);
    setS((p) => ({
      ...p,
      ...pal,
      weight: [100, 300, 400][Math.floor(Math.random() * 3)],
      titlePct: rnd(4, 11),
      mainTrack: rnd(0.1, 1.0),
      subTrack: rnd(0.1, 0.6),
      subFrac: rnd(0.3, 0.65),
      vPos: rnd(0.3, 0.6),
      hPos: rnd(0, 1),
      vignette: Math.random() > 0.6,
      fontFamily: Math.random() > 0.5 ? "sans" : "serif",
      titleOpacity: rnd(0.7, 1),
      bgType: Math.random() > 0.65 ? "linear" : "solid",
      gradAngle: Math.floor(rnd(0, 360)),
    }));
  };

  const [pw, ph] = RES[s.resKey];

  return (
    <div className="wp-root" data-theme={theme}>
      <style>{css}</style>

      <div className="wp-shell">
        {/* CONTROLS */}
        <aside className="wp-panel">
          <header className="wp-head">
            <button className="wp-theme-toggle" onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <div className="wp-eyebrow">壁 紙 ・ studio</div>
            <h1 className="wp-title">Wallpaper Studio</h1>
            <p className="wp-sub">Minimal title-card wallpapers. Type something, tune it, export.</p>
          </header>

          {/* TEXT */}
          <Section label="Text">
            <Field label="Name → 片仮名">
              <div className="wp-namegen">
                <input className="wp-input" placeholder="e.g. Alexander"
                  value={nameInput} onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyName()} />
                <button className="wp-btn ghost wp-namegen-btn" onClick={applyName}>→</button>
              </div>
              {nameInput.trim() && (
                <div className="wp-name-preview">{toKatakana(nameInput.trim())}</div>
              )}
            </Field>

            <Field label="Title" right={
              <button className="wp-toggle" onClick={generateKanji}>
                <Dices size={11} style={{ display:"inline", verticalAlign:"middle", marginRight:4 }} />
                kanji
              </button>
            }>
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
            <Field label="Font style">
              <div className="wp-seg">
                {FONT_FAMILIES.map((f) => (
                  <button key={f.v} className={`wp-seg-b ${s.fontFamily === f.v ? "on" : ""}`}
                    onClick={() => set("fontFamily")(f.v)}>{f.name}</button>
                ))}
              </div>
            </Field>
          </Section>

          {/* CANVAS */}
          <Section label="Canvas">
            <Field label="Resolution">
              <div className="wp-seg">
                {Object.keys(RES).map((k) => (
                  <button key={k} className={`wp-seg-b ${s.resKey === k ? "on" : ""}`}
                    onClick={() => set("resKey")(k)}>{k}</button>
                ))}
              </div>
            </Field>

            <Field label="Background">
              <div className="wp-seg">
                {BG_TYPES.map((t) => (
                  <button key={t} className={`wp-seg-b ${s.bgType === t ? "on" : ""}`}
                    onClick={() => set("bgType")(t)}>{t}</button>
                ))}
              </div>
            </Field>
            <Field label={s.bgType === "solid" ? "Background" : "Color 1"}
              right={<Swatch v={s.bg} onPick={set("bg")} />}>
              <div className="wp-select-wrap">
                <select className="wp-select"
                  value={BG_PRESETS.some((p) => p.v === s.bg) ? s.bg : ""}
                  onChange={(e) => e.target.value && set("bg")(e.target.value)}>
                  <option value="" disabled>Choose a preset…</option>
                  {BG_PRESETS.map((p) => (
                    <option key={p.v} value={p.v}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="wp-presets">
                {BG_PRESETS.map((p) => (
                  <button key={p.v} title={p.name}
                    className={`wp-chip ${s.bg === p.v ? "on" : ""}`}
                    style={{ background: p.v }} onClick={() => set("bg")(p.v)} />
                ))}
              </div>
            </Field>
            {s.bgType !== "solid" && (
              <Field label="Color 2" right={<Swatch v={s.bg2} onPick={set("bg2")} />} />
            )}
            {s.bgType !== "solid" && (
              <Field label="Gradient preset">
                <div className="wp-select-wrap">
                  <select className="wp-select" value=""
                    onChange={(e) => {
                      const p = GRADIENT_PRESETS[e.target.value];
                      if (p) setS((prev) => ({ ...prev, bg: p.bg, bg2: p.bg2, gradAngle: p.angle }));
                    }}>
                    <option value="" disabled>Choose a gradient…</option>
                    {GRADIENT_PRESETS.map((p, i) => (
                      <option key={p.name} value={i}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </Field>
            )}
            {s.bgType === "linear" && (
              <Slider label="Angle" v={s.gradAngle} min={0} max={360} step={1}
                suffix="°" onChange={set("gradAngle")} />
            )}

            <Field label="Text color" right={<Swatch v={s.txt} onPick={(v) => setS((prev) => ({ ...prev, txt: v, subTxt: v }))} />}>
              <div className="wp-select-wrap">
                <select className="wp-select"
                  value={TXT_PRESETS.some((p) => p.v === s.txt) ? s.txt : ""}
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const v = e.target.value;
                    setS((prev) => ({ ...prev, txt: v, subTxt: v }));
                  }}>
                  <option value="" disabled>Choose a preset…</option>
                  {TXT_PRESETS.map((p) => (
                    <option key={p.v} value={p.v}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="wp-presets">
                {TXT_PRESETS.map((preset) => (
                  <button key={preset.v} title={preset.name}
                    className={`wp-chip ${s.txt === preset.v ? "on" : ""}`}
                    style={{ background: preset.v }}
                    onClick={() => setS((prev) => ({ ...prev, txt: preset.v, subTxt: preset.v }))} />
                ))}
              </div>
            </Field>
            <Field label="Subline color" right={<Swatch v={s.subTxt} onPick={set("subTxt")} />} />

            <div className="wp-row">
              <span className="wp-check" onClick={() => set("vignette")(!s.vignette)}>
                <span className={`wp-box ${s.vignette ? "on" : ""}`} />
                Vignette
              </span>
            </div>
          </Section>

          {/* TYPE */}
          <Section label="Type">
            <Field label="Style preset">
              <div className="wp-select-wrap">
                <select className="wp-select" value=""
                  onChange={(e) => {
                    const p = STYLE_PRESETS[e.target.value];
                    if (p) setS((prev) => ({
                      ...prev, weight: p.weight, mainTrack: p.mainTrack,
                      titlePct: p.titlePct, fontFamily: p.fontFamily,
                    }));
                  }}>
                  <option value="" disabled>Choose a style…</option>
                  {STYLE_PRESETS.map((p, i) => (
                    <option key={p.name} value={i}>{p.name}</option>
                  ))}
                </select>
              </div>
            </Field>
            <Field label="Weight">
              <div className="wp-seg">
                {WEIGHTS.map((w) => (
                  <button key={w.v} className={`wp-seg-b ${s.weight === w.v ? "on" : ""}`}
                    onClick={() => set("weight")(w.v)}>{w.name}</button>
                ))}
              </div>
            </Field>
            <Slider label="Title size" v={s.titlePct} min={3} max={18} step={0.5}
              onChange={set("titlePct")} />
            <Slider label="Title spacing" v={s.mainTrack} min={0} max={1.2} step={0.01}
              onChange={set("mainTrack")} />
            <Slider label="Title opacity" v={s.titleOpacity} min={0.1} max={1} step={0.01}
              onChange={set("titleOpacity")} />
            <Slider label="Subline size" v={s.subFrac} min={0.25} max={0.9} step={0.01}
              onChange={set("subFrac")} />
            <Slider label="Subline spacing" v={s.subTrack} min={0} max={1} step={0.01}
              onChange={set("subTrack")} />
          </Section>

          {/* EFFECTS */}
          <Section label="Effects">
            <div className="wp-row">
              <span className="wp-check" onClick={() => set("glow")(!s.glow)}>
                <span className={`wp-box ${s.glow ? "on" : ""}`} />
                Title glow
              </span>
            </div>
            {s.glow && (
              <>
                <Slider label="Blur" v={s.glowBlur} min={4} max={60} step={1}
                  onChange={set("glowBlur")} />
                <Slider label="Intensity" v={s.glowIntensity} min={0.05} max={1} step={0.01}
                  onChange={set("glowIntensity")} />
              </>
            )}
          </Section>

          {/* POSITION */}
          <Section label="Position">
            <Slider label="Vertical" v={s.vPos} min={0.2} max={0.8} step={0.005}
              onChange={set("vPos")} />
            <Slider label="Horizontal" v={s.hPos} min={0} max={1} step={0.005}
              onChange={set("hPos")} />
          </Section>

          {/* LAYOUT */}
          <Section label="Layout">
            <div className="wp-row">
              <span className="wp-check" onClick={() => set("accentLine")(!s.accentLine)}>
                <span className={`wp-box ${s.accentLine ? "on" : ""}`} />
                Accent line
              </span>
            </div>
            {s.accentLine && (
              <>
                <Field label="Line color"
                  right={<Swatch v={s.accentLineColor} onPick={set("accentLineColor")} />} />
                <Slider label="Length" v={s.accentLineLength} min={0.03} max={0.5} step={0.005}
                  onChange={set("accentLineLength")} />
                <Slider label="Weight" v={s.accentLineWidth} min={0.5} max={5} step={0.25}
                  onChange={set("accentLineWidth")} />
              </>
            )}
          </Section>

          {/* PRESETS */}
          <Section label="Presets">
            <div className="wp-preset-save">
              <input className="wp-input" placeholder="Name this preset…"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && savePreset()} />
              <button className="wp-btn ghost wp-preset-save-btn" onClick={savePreset}>Save</button>
            </div>
            {presets.length > 0 && (
              <div className="wp-preset-list">
                {presets.map((p, i) => (
                  <div key={i} className="wp-preset-item">
                    <button className="wp-preset-name" onClick={() => loadPreset(p)}>{p.name}</button>
                    <button className="wp-preset-del" onClick={() => deletePreset(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div className="wp-preset-actions">
              <button className="wp-btn ghost" onClick={randomize}>
                <Shuffle size={13} /> Randomize
              </button>
              <button className="wp-btn ghost" onClick={exportPresets} disabled={presets.length === 0}>
                Export
              </button>
              <label className="wp-btn ghost wp-import-label">
                Import
                <input type="file" accept=".json" onChange={importPresets} />
              </label>
            </div>
          </Section>

          {/* ACTIONS */}
          <div className="wp-actions">
            <button className="wp-btn ghost" onClick={() => setS(DEFAULTS)}>
              <RotateCcw size={14} /> Reset
            </button>
            <button className="wp-btn primary" onClick={download}>
              <Download size={15} /> PNG
            </button>
            <button className="wp-btn ghost" onClick={batchExport} disabled={batching}>
              <Download size={14} /> {batching ? "…" : "All sizes"}
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
  const [text, setText] = useState(String(display));
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) setText(String(display));
  }, [display, editing]);

  const commit = () => {
    setEditing(false);
    const n = parseFloat(text);
    if (Number.isNaN(n)) { setText(String(display)); return; }
    const clamped = Math.min(max, Math.max(min, n));
    onChange(clamped);
  };

  return (
    <div className="wp-slider">
      <div className="wp-field-top">
        <span className="wp-field-label">{label}</span>
        <span className="wp-val-wrap">
          <input
            className="wp-val-input"
            type="number"
            min={min} max={max} step={step}
            value={text}
            onFocus={() => setEditing(true)}
            onChange={(e) => setText(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
          />
          {suffix && <span className="wp-val-suffix">{suffix}</span>}
        </span>
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
  height:100dvh; width:100%; overflow:hidden;
  transition:background .2s ease, color .2s ease;
}
.wp-root[data-theme="light"]{
  --bg:#f4f1ea; --panel:#ffffff; --panel2:#f0ece3; --line:#ddd6c8;
  --txt:#242019; --dim:#5d574a; --faint:#8a8371; --accent:#8a5f30;
  font-weight:400;
}
.wp-root[data-theme="light"] .wp-stage{
  background: radial-gradient(120% 120% at 50% 35%, #ffffff 0%, var(--bg) 70%);
}
.wp-root[data-theme="light"] .wp-seg-b.on,
.wp-root[data-theme="light"] .wp-btn.primary{
  color:#fff;
}
.wp-root .wp-title,
.wp-root .wp-eyebrow,
.wp-root .wp-sub,
.wp-root .wp-field-label,
.wp-root .wp-section-label,
.wp-root .wp-input,
.wp-root .wp-select,
.wp-root .wp-seg-b,
.wp-root .wp-check,
.wp-root .wp-btn,
.wp-root .wp-toggle,
.wp-root .wp-preset-name,
.wp-root .wp-meta{
  font-weight:500;
}
.wp-root *{box-sizing:border-box;}
.wp-shell{display:flex; height:100%;}
@media (max-width:880px){
  .wp-root{height:auto; min-height:100dvh; overflow:visible;}
  .wp-shell{flex-direction:column; height:auto; overflow:visible;}
  .wp-stage{order:-1; overflow:visible;}
}

/* PANEL */
.wp-panel{
  width:360px; flex:none; background:var(--panel);
  border-right:1px solid var(--line);
  padding:26px 22px 22px 22px; overflow-y:auto; height:100%;
  scrollbar-width:thin; scrollbar-color:var(--faint) transparent;
}
.wp-panel::-webkit-scrollbar{ width:4px; }
.wp-panel::-webkit-scrollbar-track{ background:transparent; }
.wp-panel::-webkit-scrollbar-thumb{ background:var(--faint); border-radius:4px; }
.wp-panel::-webkit-scrollbar-thumb:hover{ background:var(--dim); }
@media (max-width:880px){ .wp-panel{width:100%; height:auto; border-right:none; border-top:1px solid var(--line); border-bottom:none;} }

.wp-head{margin-bottom:22px; position:relative;}
.wp-theme-toggle{
  position:absolute; top:0; right:0; width:30px; height:30px; border-radius:50%;
  background:var(--panel2); border:1px solid var(--line); color:var(--dim);
  display:flex; align-items:center; justify-content:center; cursor:pointer;
  transition:all .15s;
}
.wp-theme-toggle:hover{color:var(--accent); border-color:var(--accent);}
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
.wp-val-wrap{display:inline-flex; align-items:center; gap:2px;}
.wp-val-input{
  width:44px; background:none; border:1px solid transparent; border-radius:4px;
  color:var(--accent); font-family:inherit; font-size:11px; font-weight:300;
  font-variant-numeric:tabular-nums; text-align:right; padding:2px 4px;
  outline:none; transition:border-color .15s, background .15s;
  appearance:textfield; -moz-appearance:textfield;
}
.wp-val-input::-webkit-outer-spin-button,
.wp-val-input::-webkit-inner-spin-button{-webkit-appearance:none; margin:0;}
.wp-val-input:hover{border-color:var(--line);}
.wp-val-input:focus{border-color:var(--accent); background:var(--panel2);}
.wp-val-suffix{font-size:11px; color:var(--accent); font-weight:300;}

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

.wp-select-wrap{position:relative; width:100%; margin-bottom:8px;}
.wp-select{
  width:100%; appearance:none; -webkit-appearance:none; -moz-appearance:none;
  background:var(--panel2); border:1px solid var(--line); color:var(--txt);
  padding:9px 30px 9px 12px; border-radius:7px; font-family:inherit;
  font-size:12.5px; font-weight:300; letter-spacing:.02em; cursor:pointer;
  outline:none; transition:border-color .15s; box-sizing:border-box;
}
.wp-select:hover{border-color:#3a352b;}
.wp-select:focus{border-color:var(--accent);}
.wp-select option{background:var(--panel2); color:var(--txt);}
.wp-select-wrap::after{
  content:"⌄"; position:absolute; right:12px; top:50%; transform:translateY(-58%);
  color:var(--dim); font-size:13px; pointer-events:none;
}

.wp-presets{display:flex; gap:10px; flex-wrap:wrap;}
.wp-chip{
  width:28px; height:28px; border-radius:50%; cursor:pointer;
  border:1px solid rgba(255,255,255,.14); position:relative;
  display:inline-flex; align-items:center; justify-content:center;
  transition:transform .16s cubic-bezier(.4,0,.2,1), box-shadow .16s ease;
  box-shadow:0 1px 2px rgba(0,0,0,.35);
}
.wp-chip:hover{transform:scale(1.14); box-shadow:0 2px 6px rgba(0,0,0,.4);}
.wp-chip:active{transform:scale(1.02);}
.wp-chip.on{
  transform:scale(1.08);
  box-shadow:0 0 0 2px var(--panel2), 0 0 0 4px var(--accent), 0 2px 6px rgba(0,0,0,.4);
}
.wp-chip.on::after{
  content:"✓"; font-size:11px; font-weight:700; color:#fff; line-height:1;
  text-shadow:0 1px 2px rgba(0,0,0,.75), 0 0 3px rgba(0,0,0,.5);
}

.wp-swatch{
  width:26px; height:26px; border-radius:50%; cursor:pointer; display:inline-block;
  border:1px solid rgba(255,255,255,.16); overflow:hidden; position:relative;
  box-shadow:0 1px 2px rgba(0,0,0,.35);
  transition:transform .16s cubic-bezier(.4,0,.2,1), box-shadow .16s ease;
}
.wp-swatch:hover{transform:scale(1.12); box-shadow:0 0 0 3px var(--panel2), 0 0 0 4px rgba(194,168,120,.5);}
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

.wp-actions{display:flex; gap:10px; margin-top:26px; padding-top:20px; border-top:1px solid var(--line); flex-wrap:wrap;}
.wp-btn{
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  border-radius:8px; padding:12px 14px; cursor:pointer; font-family:inherit;
  font-size:13px; font-weight:400; letter-spacing:.04em; transition:all .15s; border:1px solid transparent;
}
.wp-btn:disabled{opacity:.45; cursor:not-allowed;}
.wp-btn.primary{flex:1; background:var(--accent); color:#1a160f;}
.wp-btn.primary:hover:not(:disabled){background:#d4ba8c;}
.wp-btn.ghost{background:transparent; border-color:var(--line); color:var(--dim);}
.wp-btn.ghost:hover:not(:disabled){color:var(--txt); border-color:#3a352b;}

/* Name translator */
.wp-namegen{display:flex; gap:8px;}
.wp-namegen-btn{flex:none; padding:10px 16px; font-size:15px;}
.wp-name-preview{
  font-size:18px; letter-spacing:.2em; color:var(--txt); font-weight:100;
  text-align:center; padding:8px 0 2px;
  font-family:"Noto Sans SC","Noto Serif SC",sans-serif;
}

/* Preset controls */
.wp-preset-save{display:flex; gap:8px;}
.wp-preset-save-btn{flex:none; padding:10px 14px; white-space:nowrap;}
.wp-preset-list{display:flex; flex-direction:column; gap:5px;}
.wp-preset-item{display:flex; align-items:center; gap:6px;}
.wp-preset-name{
  flex:1; text-align:left; background:var(--panel2); border:1px solid var(--line);
  color:var(--txt); padding:7px 10px; border-radius:6px; cursor:pointer;
  font-family:inherit; font-size:12px; font-weight:300; letter-spacing:.03em;
  transition:border-color .14s;
}
.wp-preset-name:hover{border-color:var(--accent); color:var(--accent);}
.wp-preset-del{
  background:none; border:1px solid var(--line); color:var(--faint);
  width:28px; height:28px; border-radius:6px; cursor:pointer; font-size:10px;
  display:flex; align-items:center; justify-content:center; flex:none; transition:all .14s;
}
.wp-preset-del:hover{color:var(--txt); border-color:#3a352b;}
.wp-preset-actions{display:flex; gap:8px;}
.wp-preset-actions .wp-btn{flex:1; font-size:12px; padding:9px 8px;}
.wp-import-label{cursor:pointer;}
.wp-import-label input[type=file]{display:none;}

/* STAGE */
.wp-stage{flex:1; display:flex; align-items:center; justify-content:center; padding:40px; overflow:auto; background:
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

/* PHONE */
@media (max-width:600px){
  .wp-root{ padding-bottom:env(safe-area-inset-bottom); }
  .wp-stage{ padding:16px 14px 22px; }
  .wp-stage-inner{ gap:12px; }
  .wp-panel{ padding:20px 16px calc(24px + env(safe-area-inset-bottom)); }
  .wp-head{ margin-bottom:18px; padding-right:40px; }
  .wp-theme-toggle{ width:38px; height:38px; }
  .wp-section{ margin-top:18px; }
  .wp-section-body{ gap:14px; }

  /* Prevent iOS auto-zoom on focus: inputs need >=16px font-size */
  .wp-input, .wp-select{ font-size:16px; }
  .wp-val-input{ font-size:13px; padding:6px 6px; }

  /* Bigger touch targets */
  .wp-seg-b{ padding:11px 8px; min-height:40px; }
  .wp-toggle{ padding:6px 12px; font-size:11px; }
  .wp-chip{ width:34px; height:34px; }
  .wp-swatch{ width:32px; height:32px; }
  .wp-box{ width:19px; height:19px; }
  .wp-check{ font-size:13px; gap:11px; }
  .wp-preset-del{ width:34px; height:34px; }

  .wp-btn{ padding:14px 12px; min-height:46px; font-size:13.5px; }
  .wp-actions{ gap:8px; }
  .wp-namegen-btn{ padding:12px 16px; }
  .wp-preset-save-btn{ padding:12px 14px; }

  .wp-canvas-wrap{ border-radius:8px; }
  .wp-meta{ font-size:10px; letter-spacing:.14em; }
}
`;
