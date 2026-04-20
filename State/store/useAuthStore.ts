import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { loginApi } from '../api/auth.api';
import { AuthState } from '../models/auth.models';



export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,

    login: async (username, password) => {
        set({ loading: true });
        try {
            const tokens = await loginApi(username, password);

            if (!tokens?.access || !tokens?.refresh) {
                throw new Error('Tokens inválidos');
            }

            await AsyncStorage.setItem('access', tokens.access);
            await AsyncStorage.setItem('refresh', tokens.refresh);

            set({
                accessToken: tokens.access,
                refreshToken: tokens.refresh,
                isAuthenticated: true,
                loading: false,
            });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    logout: async () => {
        await AsyncStorage.removeItem('access');
        await AsyncStorage.removeItem('refresh');

        set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        });
    },

    checkAuth: async () => {
        set({ loading: true });
        const access = await AsyncStorage.getItem('access');
        const refresh = await AsyncStorage.getItem('refresh');


        set({
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: !!access,
            loading: false,
        });

    },
}));