import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { loginApi } from '../api/auth.api';
import { AuthState } from '../models/auth.models';



export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    user: null,
    tienda: null,
    loading: false,
    login: async (username, password) => {
        set({ loading: true });

        try {
            const data = await loginApi(username, password);

            if (!data?.access || !data?.refresh) {
                throw new Error('Tokens inválidos');
            }

            // ── TOKENS ─────────────────────────────
            await AsyncStorage.setItem('access', data.access);
            await AsyncStorage.setItem('refresh', data.refresh);

            // ── USER & TIENDA ──────────────────────
            if (data.user) {
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
            }

            if (data.tienda) {
                await AsyncStorage.setItem('tienda', JSON.stringify(data.tienda));
            }

            // ── STORE STATE ────────────────────────
            set({
                accessToken: data.access,
                refreshToken: data.refresh,
                user: data.user,
                tienda: data.tienda,
                isAuthenticated: true,
                loading: false,
            });

        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },
    logout: async () => {
        await AsyncStorage.multiRemove([
            'access',
            'refresh',
            'user',
            'tienda',
        ]);

        set({
            accessToken: null,
            refreshToken: null,
            user: null,
            tienda: null,
            isAuthenticated: false,
        });
    },
    loadSession: async () => {
        const access = await AsyncStorage.getItem('access');
        const refresh = await AsyncStorage.getItem('refresh');
        const user = await AsyncStorage.getItem('user');
        const tienda = await AsyncStorage.getItem('tienda');

        set({
            accessToken: access,
            refreshToken: refresh,
            user: user ? JSON.parse(user) : null,
            tienda: tienda ? JSON.parse(tienda) : null,
            isAuthenticated: !!access,
        });
    },
    checkAuth: async () => {
        set({ loading: true });
        const access = await AsyncStorage.getItem('access');
        const refresh = await AsyncStorage.getItem('refresh');
        const user = await AsyncStorage.getItem('user');
        const tienda = await AsyncStorage.getItem('tienda');


        set({
            accessToken: access,
            refreshToken: refresh,
            user: user ? JSON.parse(user) : null,
            tienda: tienda ? JSON.parse(tienda) : null,
            isAuthenticated: !!access,
            loading: false,
        });

    },
}));