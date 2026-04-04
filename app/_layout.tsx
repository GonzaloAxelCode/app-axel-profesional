import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/State/store/useAuthStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  MD3LightTheme, PaperProvider
} from 'react-native-paper';
import { queryClient } from './queryclient';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await checkAuth();
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <Stack>
      <Stack.Screen name="loader" options={{ headerShown: false }} />
    </Stack>;
  }

  return (
    <PaperProvider theme={MD3LightTheme}>


      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            {!isAuthenticated && <Stack.Screen name="welcome" options={{ headerShown: false }} />}
            {!isAuthenticated && <Stack.Screen name="login" options={{ headerShown: false }} />}
            {isAuthenticated && <Stack.Screen name="(tabs)" options={{ headerShown: false }} />}
            {isAuthenticated && <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', header: () => null, }} />}
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </PaperProvider>
  );
}