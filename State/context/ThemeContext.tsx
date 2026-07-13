import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, Theme, ThemeMode } from '@/constants/THEME';

interface ThemeContextValue {
    mode: ThemeMode;
    T: Theme;
    toggleTheme: () => void;
    setMode: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    mode: 'dark',
    T: themes.dark,
    toggleTheme: () => {},
    setMode: () => {},
});

const STORAGE_KEY = 'theme_mode';

export function AppThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>('dark');

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
            if (stored === 'light' || stored === 'dark') {
                setModeState(stored);
            }
        });
    }, []);

    const setMode = (m: ThemeMode) => {
        setModeState(m);
        AsyncStorage.setItem(STORAGE_KEY, m);
    };

    const toggleTheme = () => {
        setMode(mode === 'dark' ? 'light' : 'dark');
    };

    const T = themes[mode];

    return (
        <ThemeContext.Provider value={{ mode, T, toggleTheme, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useAppTheme = () => useContext(ThemeContext);
