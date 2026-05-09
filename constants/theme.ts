type Shadow = {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
};

type Theme = {
    bg: string;
    surface: string;
    surfaceAlt: string;
    surfaceElevated: string;

    accent: string;
    accent2: string;
    accent3: string;
    accent4: string;
    accent5: string;
    accent6: string;
    accentDim: string;
    accentHover: string;

    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textDisabled: string;

    border: string;
    borderMedium: string;

    green: string;
    red: string;
    amber: string;
    yellow: string;
    blue: string;
    purple: string;

    radiusSm: number;
    radiusMd: number;
    radiusLg: number;
    radiusXl: number;
    radiusFull: number;

    shadowAccent: Shadow;
    shadowCard: Shadow;
};

const arounda: Theme = {
    // ── NEGROS PROFUNDOS (sin verde ni azul) ─────────────────────
    bg: '#050505',
    surface: '#0D0D0D',
    surfaceAlt: '#151515',
    surfaceElevated: '#1D1D1D',

    // ── ACCENT VERDE NEÓN ────────────────────────────────────────
    accent: '#C6FF00',
    accent2: '#B2F000',
    accent3: '#98D600',
    accent4: '#D4FF4D',
    accent5: '#E4FF8A',
    accent6: '#F1FFC2',

    accentDim: '#C6FF0018',
    accentHover: '#AEE000',

    // ── TEXTO ────────────────────────────────────────────────────
    textPrimary: '#F5F5F5',
    textSecondary: '#B0B0B0',
    textMuted: '#707070',
    textDisabled: '#404040',

    // ── BORDES ───────────────────────────────────────────────────
    border: 'transparent',
    borderMedium: '#262626',

    // ── COLORES SEMÁNTICOS ───────────────────────────────────────
    green: '#6DFF7A',
    red: '#FF5A5A',
    amber: '#FFB020',
    yellow: '#F8FF72',
    blue: '#3BA7FF',
    purple: '#9B6DFF',

    // ── RADIOS ───────────────────────────────────────────────────
    radiusSm: 10,
    radiusMd: 14,
    radiusLg: 20,
    radiusXl: 28,
    radiusFull: 100,

    // ── SOMBRAS ──────────────────────────────────────────────────
    shadowAccent: {
        shadowColor: '#C6FF00',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.22,
        shadowRadius: 22,
        elevation: 8,
    },

    shadowCard: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.65,
        shadowRadius: 24,
        elevation: 10,
    },
};

export default arounda;