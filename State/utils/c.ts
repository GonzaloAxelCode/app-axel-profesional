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

// ─────────────────────────────────────────────────────────────────────────────
// TEMAS PRO — modernos, sobrios y elegantes
// ─────────────────────────────────────────────────────────────────────────────

// ── 11. Slate Minimal (tipo Notion dark) ─────────────────────────────────────
const slateMinimal: Theme = {
    ...B,
    bg: '#0b0c0f', surface: '#121318', surfaceAlt: '#1a1c22', surfaceDeep: '#08090c',
    accent: '#e5e7eb', accentDim: 'rgba(229,231,235,0.06)', accentText: '#111827',
    textPrimary: '#f9fafb', textSecondary: '#9ca3af', textMuted: '#6b7280',
    green: '#22c55e', red: '#ef4444', blue: '#3b82f6',
    purple: '#8b5cf6', yellow: '#eab308', amber: '#f59e0b',
};

// ── 12. Carbon Blue (tipo Stripe) ────────────────────────────────────────────
const carbonBlue: Theme = {
    ...B,
    bg: '#0a0f1c', surface: '#121a2b', surfaceAlt: '#17223a', surfaceDeep: '#060a14',
    accent: '#4f8cff', accentDim: 'rgba(79,140,255,0.08)', accentText: '#0a1f44',
    textPrimary: '#eef4ff', textSecondary: '#7c8db5', textMuted: '#4a5875',
    green: '#22c55e', red: '#ef4444', blue: '#60a5fa',
    purple: '#818cf8', yellow: '#fde047', amber: '#f59e0b',
};

// ── 13. Graphite Clean ───────────────────────────────────────────────────────
const graphiteClean: Theme = {
    ...B,
    bg: '#0e0e10', surface: '#1a1a1d', surfaceAlt: '#232326', surfaceDeep: '#09090b',
    accent: '#ffffff', accentDim: 'rgba(255,255,255,0.05)', accentText: '#111111',
    textPrimary: '#fafafa', textSecondary: '#a1a1aa', textMuted: '#52525b',
    green: '#4ade80', red: '#f87171', blue: '#60a5fa',
    purple: '#a78bfa', yellow: '#fde047', amber: '#fb923c',
};

// ── 14. Indigo Modern ────────────────────────────────────────────────────────
const indigoModern: Theme = {
    ...B,
    bg: '#0c0e1a', surface: '#151832', surfaceAlt: '#1c2044', surfaceDeep: '#080a12',
    accent: '#6366f1', accentDim: 'rgba(99,102,241,0.08)', accentText: '#1e1b4b',
    textPrimary: '#eef2ff', textSecondary: '#8b8fc7', textMuted: '#555a88',
    green: '#34d399', red: '#f87171', blue: '#60a5fa',
    purple: '#a78bfa', yellow: '#fde047', amber: '#f59e0b',
};

// ── 15. Soft Neutral (UI tipo Linear) ────────────────────────────────────────
const softNeutral: Theme = {
    ...B,
    bg: '#0d0f14', surface: '#151821', surfaceAlt: '#1d2230', surfaceDeep: '#090b10',
    accent: '#a1a1aa', accentDim: 'rgba(161,161,170,0.06)', accentText: '#18181b',
    textPrimary: '#f4f4f5', textSecondary: '#a1a1aa', textMuted: '#6b7280',
    green: '#22c55e', red: '#ef4444', blue: '#3b82f6',
    purple: '#8b5cf6', yellow: '#eab308', amber: '#f59e0b',
};

// ── 16. Midnight Purple SaaS ────────────────────────────────────────────────
const midnightPurple: Theme = {
    ...B,
    bg: '#0a0612', surface: '#140d24', surfaceAlt: '#1c1534', surfaceDeep: '#06030a',
    accent: '#a855f7', accentDim: 'rgba(168,85,247,0.08)', accentText: '#2e1065',
    textPrimary: '#f5f3ff', textSecondary: '#a78bfa', textMuted: '#6b5c9a',
    green: '#4ade80', red: '#f87171', blue: '#60a5fa',
    purple: '#c084fc', yellow: '#fde047', amber: '#fb923c',
};

// ── 17. Ocean Glass ──────────────────────────────────────────────────────────
const oceanGlass: Theme = {
    ...B,
    bg: '#06121a', surface: '#0d1f2a', surfaceAlt: '#132a38', surfaceDeep: '#030a10',
    accent: '#22d3ee', accentDim: 'rgba(34,211,238,0.08)', accentText: '#083344',
    textPrimary: '#ecfeff', textSecondary: '#67a6b5', textMuted: '#3b6a75',
    green: '#34d399', red: '#f87171', blue: '#38bdf8',
    purple: '#a78bfa', yellow: '#fde047', amber: '#f59e0b',
};

// ── 18. Emerald Premium ─────────────────────────────────────────────────────
const emeraldPremium: Theme = {
    ...B,
    bg: '#06110c', surface: '#0d1f17', surfaceAlt: '#142a20', surfaceDeep: '#030a07',
    accent: '#10b981', accentDim: 'rgba(16,185,129,0.08)', accentText: '#022c22',
    textPrimary: '#ecfdf5', textSecondary: '#6ea89a', textMuted: '#3d6f63',
    green: '#22c55e', red: '#ef4444', blue: '#3b82f6',
    purple: '#8b5cf6', yellow: '#fde047', amber: '#f59e0b',
};

// ── 19. Warm Gray Luxury ─────────────────────────────────────────────────────
const warmGrayLuxury: Theme = {
    ...B,
    bg: '#111110', surface: '#1c1c1a', surfaceAlt: '#252523', surfaceDeep: '#0a0a09',
    accent: '#e7e5e4', accentDim: 'rgba(231,229,228,0.06)', accentText: '#292524',
    textPrimary: '#fafaf9', textSecondary: '#a8a29e', textMuted: '#6b7280',
    green: '#4ade80', red: '#f87171', blue: '#60a5fa',
    purple: '#a78bfa', yellow: '#fde047', amber: '#fb923c',
};

// ── 20. Deep Red Fintech ─────────────────────────────────────────────────────
const deepRedFintech: Theme = {
    ...B,
    bg: '#140a0a', surface: '#1f1212', surfaceAlt: '#2a1818', surfaceDeep: '#0a0404',
    accent: '#ef4444', accentDim: 'rgba(239,68,68,0.08)', accentText: '#450a0a',
    textPrimary: '#fef2f2', textSecondary: '#b87171', textMuted: '#6f4444',
    green: '#22c55e', red: '#f87171', blue: '#60a5fa',
    purple: '#a78bfa', yellow: '#fde047', amber: '#f59e0b',
};

// ── 21. Sky Soft UI ──────────────────────────────────────────────────────────
const skySoft: Theme = {
    ...B,
    bg: '#0b1220', surface: '#121a2c', surfaceAlt: '#18233a', surfaceDeep: '#060a12',
    accent: '#38bdf8', accentDim: 'rgba(56,189,248,0.08)', accentText: '#082f49',
    textPrimary: '#f0f9ff', textSecondary: '#7aa8c0', textMuted: '#456a80',
    green: '#22c55e', red: '#ef4444', blue: '#60a5fa',
    purple: '#818cf8', yellow: '#fde047', amber: '#f59e0b',
};

// ── 22. Mono Clean ───────────────────────────────────────────────────────────
const monoClean: Theme = {
    ...B,
    bg: '#000000', surface: '#111111', surfaceAlt: '#1a1a1a', surfaceDeep: '#050505',
    accent: '#ffffff', accentDim: 'rgba(255,255,255,0.05)', accentText: '#000000',
    textPrimary: '#ffffff', textSecondary: '#aaaaaa', textMuted: '#666666',
    green: '#22c55e', red: '#ef4444', blue: '#3b82f6',
    purple: '#8b5cf6', yellow: '#eab308', amber: '#f59e0b',
};

// ── 23. Soft Purple Glass ────────────────────────────────────────────────────
const softPurpleGlass: Theme = {
    ...B,
    bg: '#0e0a14', surface: '#181022', surfaceAlt: '#211632', surfaceDeep: '#07040a',
    accent: '#c084fc', accentDim: 'rgba(192,132,252,0.08)', accentText: '#3b0764',
    textPrimary: '#faf5ff', textSecondary: '#b794d4', textMuted: '#6b5a8c',
    green: '#4ade80', red: '#f87171', blue: '#60a5fa',
    purple: '#d8b4fe', yellow: '#fde047', amber: '#fb923c',
};

// ── 24. Steel Blue ───────────────────────────────────────────────────────────
const steelBlue: Theme = {
    ...B,
    bg: '#0c1116', surface: '#141b22', surfaceAlt: '#1b2530', surfaceDeep: '#070b0f',
    accent: '#64748b', accentDim: 'rgba(100,116,139,0.08)', accentText: '#0f172a',
    textPrimary: '#f1f5f9', textSecondary: '#94a3b8', textMuted: '#64748b',
    green: '#22c55e', red: '#ef4444', blue: '#3b82f6',
    purple: '#8b5cf6', yellow: '#eab308', amber: '#f59e0b',
};

// ── 25. Gold Premium Dark ────────────────────────────────────────────────────
const goldPremium: Theme = {
    ...B,
    bg: '#0f0c05', surface: '#1a150a', surfaceAlt: '#241d0f', surfaceDeep: '#080603',
    accent: '#facc15', accentDim: 'rgba(250,204,21,0.08)', accentText: '#422006',
    textPrimary: '#fefce8', textSecondary: '#b8a76a', textMuted: '#6f5f2e',
    green: '#22c55e', red: '#ef4444', blue: '#60a5fa',
    purple: '#a78bfa', yellow: '#fde047', amber: '#f59e0b',
};

// ── 26. Neutral Blue Gray ────────────────────────────────────────────────────
const neutralBlueGray: Theme = {
    ...B,
    bg: '#0f172a', surface: '#1e293b', surfaceAlt: '#273449', surfaceDeep: '#020617',
    accent: '#94a3b8', accentDim: 'rgba(148,163,184,0.08)', accentText: '#0f172a',
    textPrimary: '#f8fafc', textSecondary: '#94a3b8', textMuted: '#64748b',
    green: '#22c55e', red: '#ef4444', blue: '#3b82f6',
    purple: '#8b5cf6', yellow: '#eab308', amber: '#f59e0b',
};

export const C: Theme = graphiteClean; // ← cambia aquí