// app/LoaderScreen.tsx
import { useAuthStore } from '@/State/store/useAuthStore';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function LoaderScreen() {
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const loading = useAuthStore((state) => state.loading);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            await checkAuth();

            // Redirige según estado de autenticación
            if (isAuthenticated) {
                router.replace('/inicio'); // Pantalla principal
            } else {
                router.replace('/login');   // Pantalla de login
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#1D4ED8" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});