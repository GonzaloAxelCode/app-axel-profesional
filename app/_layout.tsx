import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/State/store/useAuthStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  PaperProvider
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';



export const unstable_settings = {
  anchor: '(tabs)',

};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

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
    return <QueryClientProvider client={queryClient}>


      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="loader" options={{ headerShown: false }} />
        </Stack>

      </SafeAreaProvider>

    </QueryClientProvider>
  }

  return (<QueryClientProvider client={queryClient}>
    <SafeAreaProvider>


      <PaperProvider>

        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            {!isAuthenticated && <Stack.Screen name="welcome" options={{ headerShown: false }} />}
            {!isAuthenticated && <Stack.Screen name="login" options={{ headerShown: false }} />}
            {isAuthenticated && <Stack.Screen name="(tabs)" options={{ headerShown: false }} />}

            {isAuthenticated && (
              <Stack.Screen
                name="hacerventa"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  headerBackVisible: false,
                  headerTitle: '',
                }}
              />
            )}
            {isAuthenticated && (
              <Stack.Screen
                name="productodetail"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  headerBackVisible: false,
                  headerTitle: '',
                }}
              />
            )}
            {isAuthenticated && (
              <Stack.Screen
                name="settings/perfil"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  headerBackVisible: false,
                  headerTitle: '',
                }}
              />
            )}
            {isAuthenticated && (
              <Stack.Screen
                name="settings/categorias"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  headerBackVisible: false,
                  headerTitle: '',
                }}
              />
            )}
            {isAuthenticated && (
              <Stack.Screen
                name="settings/comprobantes"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  headerBackVisible: false,
                  headerTitle: '',
                }}
              />
            )}
            {isAuthenticated && (
              <Stack.Screen
                name="settings/exportar"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  headerBackVisible: false,
                  headerTitle: '',
                }}
              />
            )}
            {isAuthenticated && (
              <Stack.Screen
                name="settings/seguridad"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  headerBackVisible: false,
                  headerTitle: '',
                }}
              />
            )}
            {isAuthenticated && (
              <Stack.Screen
                name="settings/stock-alertas"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  headerBackVisible: false,
                  headerTitle: '',
                }}
              />
            )}
            {isAuthenticated && (
              <Stack.Screen
                name="settings/tienda"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  headerBackVisible: false,
                  headerTitle: '',
                }}
              />
            )}
            {isAuthenticated && (
              <Stack.Screen
                name="settings/usuaiors"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  headerBackVisible: false,
                  headerTitle: '',
                }}
              />
            )}
          </Stack>

          <StatusBar style="auto" backgroundColor="transparent" translucent />
        </ThemeProvider>

      </PaperProvider>               </SafeAreaProvider>  </QueryClientProvider>
  );
}