import { useAuthStore } from '@/State/store/useAuthStore';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        (async () => {
            await checkAuth();
            setChecking(false);
        })();
    }, []);

    if (checking) {
        return (
            <View style={{ flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#c8f55a" />
            </View>
        );
    }

    return <Redirect href={isAuthenticated ? '/(tabs)/inicio' : '/login'} />;

}