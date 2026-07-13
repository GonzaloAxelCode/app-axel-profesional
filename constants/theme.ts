type Shadow = {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
};

export type Theme = {
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

const dark: Theme = {
    bg: '#050505',
    surface: '#0D0D0D',
    surfaceAlt: '#151515',
    surfaceElevated: '#1D1D1D',

    accent: '#C6FF00',
    accent2: '#B2F000',
    accent3: '#98D600',
    accent4: '#D4FF4D',
    accent5: '#E4FF8A',
    accent6: '#F1FFC2',
    accentDim: '#C6FF0018',
    accentHover: '#AEE000',

    textPrimary: '#F5F5F5',
    textSecondary: '#B0B0B0',
    textMuted: '#707070',
    textDisabled: '#404040',

    border: 'transparent',
    borderMedium: '#262626',

    green: '#6DFF7A',
    red: '#FF5A5A',
    amber: '#FFB020',
    yellow: '#F8FF72',
    blue: '#3BA7FF',
    purple: '#9B6DFF',

    radiusSm: 10,
    radiusMd: 14,
    radiusLg: 20,
    radiusXl: 28,
    radiusFull: 100,

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

const light: Theme = {
    bg: '#F5F5F7',
    surface: '#FFFFFF',
    surfaceAlt: '#F0F0F2',
    surfaceElevated: '#FFFFFF',

    accent: '#FF6B35',
    accent2: '#FF4444',
    accent3: '#5B5FEF',
    accent4: '#00C9A7',
    accent5: '#FFB800',
    accent6: '#FF3CAC',
    accentDim: '#FF6B3512',
    accentHover: '#E85D2C',

    textPrimary: '#1A1A2E',
    textSecondary: '#555770',
    textMuted: '#9898AD',
    textDisabled: '#CDCDD4',

    border: '#E4E4E9',
    borderMedium: '#D0D0D6',

    green: '#00C9A7',
    red: '#FF4444',
    amber: '#FFB800',
    yellow: '#FFD600',
    blue: '#5B5FEF',
    purple: '#FF3CAC',

    radiusSm: 10,
    radiusMd: 14,
    radiusLg: 20,
    radiusXl: 28,
    radiusFull: 100,

    shadowAccent: {
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 3,
    },
    shadowCard: {
        shadowColor: '#1A1A2E',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
};

export const themes = { dark, light };
export type ThemeMode = 'dark' | 'light';

export default dark;
