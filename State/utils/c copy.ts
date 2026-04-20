// ─────────────────────────────────────────────────────────────────────────────
// TEMAS DE COLOR — selecciona uno al final del archivo
// ─────────────────────────────────────────────────────────────────────────────

type Theme = {
    bg: string; surface: string; surfaceAlt: string; surfaceDeep: string;
    border: string; borderAccent: string;
    accent: string; accentDim: string; accentText: string;
    textPrimary: string; textSecondary: string; textMuted: string;
    green: string; red: string; blue: string; purple: string; yellow: string; amber: string;
};

// Bordes transparentes compartidos por todos los temas
const B = {
    border: 'transparent',
    borderAccent: 'transparent',
};

// ── 1. Lima oscuro (original) ────────────────────────────────────────────────
const limaOscuro: Theme = {
    ...B,
    bg: '#0f1117', surface: '#1a1d27', surfaceAlt: '#222636', surfaceDeep: '#0d0f14',
    accent: '#c8e64a', accentDim: 'rgba(200,230,74,0.08)', accentText: '#2d3a08',
    textPrimary: '#f0f2ff', textSecondary: '#8b8fa8', textMuted: '#555870',
    green: '#22c55e', red: '#ef4444', blue: '#3b82f6',
    purple: '#a78bfa', yellow: '#fcd34d', amber: '#f59e0b',
};

// ── 2. Cian neón ─────────────────────────────────────────────────────────────
const cianNeon: Theme = {
    ...B,
    bg: '#080d10', surface: '#101820', surfaceAlt: '#162030', surfaceDeep: '#050a0c',
    accent: '#00dcff', accentDim: 'rgba(0,220,255,0.08)', accentText: '#002830',
    textPrimary: '#e8f8ff', textSecondary: '#6a90a0', textMuted: '#3a5060',
    green: '#22c55e', red: '#ef4444', blue: '#38bdf8',
    purple: '#a78bfa', yellow: '#fcd34d', amber: '#f59e0b',
};

// ── 3. Violeta profundo ───────────────────────────────────────────────────────
const violetaProfundo: Theme = {
    ...B,
    bg: '#0d0a18', surface: '#160f2a', surfaceAlt: '#1e1638', surfaceDeep: '#090614',
    accent: '#a78bfa', accentDim: 'rgba(167,139,250,0.08)', accentText: '#1a0a40',
    textPrimary: '#f0ecff', textSecondary: '#8878b8', textMuted: '#504870',
    green: '#4ade80', red: '#f87171', blue: '#60a5fa',
    purple: '#c084fc', yellow: '#fde047', amber: '#fbbf24',
};

// ── 4. Coral sunset ──────────────────────────────────────────────────────────
const coralSunset: Theme = {
    ...B,
    bg: '#120d0a', surface: '#1e1410', surfaceAlt: '#281c18', surfaceDeep: '#0e0908',
    accent: '#fb7185', accentDim: 'rgba(251,113,133,0.08)', accentText: '#3a0a10',
    textPrimary: '#fff0f2', textSecondary: '#a87880', textMuted: '#604848',
    green: '#4ade80', red: '#f43f5e', blue: '#60a5fa',
    purple: '#c084fc', yellow: '#fde047', amber: '#fb923c',
};

// ── 5. Esmeralda forestal ─────────────────────────────────────────────────────
const esmeraldaForestal: Theme = {
    ...B,
    bg: '#070f0b', surface: '#0e1a14', surfaceAlt: '#14251c', surfaceDeep: '#040a06',
    accent: '#34d399', accentDim: 'rgba(52,211,153,0.08)', accentText: '#022018',
    textPrimary: '#edfff8', textSecondary: '#5a9070', textMuted: '#345040',
    green: '#4ade80', red: '#f87171', blue: '#38bdf8',
    purple: '#a78bfa', yellow: '#fde047', amber: '#fbbf24',
};

// ── 6. Azul medianoche ───────────────────────────────────────────────────────
const azulMedianoche: Theme = {
    ...B,
    bg: '#070c18', surface: '#0e1428', surfaceAlt: '#141d38', surfaceDeep: '#040810',
    accent: '#60a5fa', accentDim: 'rgba(96,165,250,0.08)', accentText: '#05183a',
    textPrimary: '#eef4ff', textSecondary: '#6080b0', textMuted: '#384870',
    green: '#34d399', red: '#f87171', blue: '#38bdf8',
    purple: '#a78bfa', yellow: '#fde047', amber: '#fbbf24',
};

// ── 7. Ámbar oscuro ───────────────────────────────────────────────────────────
const ambarOscuro: Theme = {
    ...B,
    bg: '#120e06', surface: '#1e170a', surfaceAlt: '#2a1e0e', surfaceDeep: '#0d0904',
    accent: '#fbbf24', accentDim: 'rgba(251,191,36,0.08)', accentText: '#3a2600',
    textPrimary: '#fff8e8', textSecondary: '#a08040', textMuted: '#604a20',
    green: '#4ade80', red: '#f87171', blue: '#60a5fa',
    purple: '#c084fc', yellow: '#fde047', amber: '#fb923c',
};

// ── 8. Rosa cuarzo ────────────────────────────────────────────────────────────
const rosaCuarzo: Theme = {
    ...B,
    bg: '#120810', surface: '#1e1020', surfaceAlt: '#28182c', surfaceDeep: '#0e060c',
    accent: '#e879f9', accentDim: 'rgba(232,121,249,0.08)', accentText: '#300838',
    textPrimary: '#fdf0ff', textSecondary: '#9868a8', textMuted: '#584060',
    green: '#4ade80', red: '#f87171', blue: '#60a5fa',
    purple: '#c084fc', yellow: '#fde047', amber: '#fbbf24',
};

// ── 9. Gris titanio ───────────────────────────────────────────────────────────
const grisTitanio: Theme = {
    ...B,
    bg: '#0c0c0e', surface: '#161618', surfaceAlt: '#1e1e22', surfaceDeep: '#080809',
    accent: '#f5f5f5', accentDim: 'rgba(255,255,255,0.06)', accentText: '#1a1a1a',
    textPrimary: '#ffffff', textSecondary: '#888890', textMuted: '#505058',
    green: '#4ade80', red: '#f87171', blue: '#60a5fa',
    purple: '#a78bfa', yellow: '#fde047', amber: '#fbbf24',
};

// ── 10. Teal cyberpunk ────────────────────────────────────────────────────────
const tealCyberpunk: Theme = {
    ...B,
    bg: '#060e12', surface: '#0c181e', surfaceAlt: '#122028', surfaceDeep: '#04080c',
    accent: '#14b8a6', accentDim: 'rgba(20,184,166,0.08)', accentText: '#012820',
    textPrimary: '#e8fffe', textSecondary: '#4a8880', textMuted: '#2a5048',
    green: '#4ade80', red: '#f87171', blue: '#38bdf8',
    purple: '#a78bfa', yellow: '#fde047', amber: '#fbbf24',
};

// ─────────────────────────────────────────────────────────────────────────────
// SELECTOR — cambia el tema aquí
// ─────────────────────────────────────────────────────────────────────────────
//
//  1  limaOscuro         Verde lima    · azul-negro
//  2  cianNeon           Cian          · negro carbón
//  3  violetaProfundo    Violeta       · morado oscuro
//  4  coralSunset        Coral/rosa    · marrón-negro
//  5  esmeraldaForestal  Esmeralda     · verde oscuro
//  6  azulMedianoche     Azul hielo    · azul marino
//  7  ambarOscuro        Ámbar dorado  · marrón cálido
//  8  rosaCuarzo         Rosa chicle   · negro rosado
//  9  grisTitanio        Blanco puro   · gris neutro
// 10  tealCyberpunk      Turquesa      · negro azulado

export const C2: Theme = tealCyberpunk; // ← cambia aquí