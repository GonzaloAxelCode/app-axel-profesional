import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";

import { useColorScheme } from '@/hooks/use-color-scheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const modalOptions = {
  presentation: 'modal' as const,
  headerShown: false,
  headerBackVisible: false,
  headerTitle: '',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();


  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <PaperProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="welcome" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="hacerventa" options={modalOptions} />
              <Stack.Screen name="productodetail" options={modalOptions} />
              <Stack.Screen name="settings/perfil" options={modalOptions} />
              <Stack.Screen name="settings/categorias" options={modalOptions} />
              <Stack.Screen name="settings/comprobantes" options={modalOptions} />
              <Stack.Screen name="settings/exportar" options={modalOptions} />
              <Stack.Screen name="settings/seguridad" options={modalOptions} />
              <Stack.Screen name="settings/stock-alertas" options={modalOptions} />
              <Stack.Screen name="settings/tienda" options={modalOptions} />
              <Stack.Screen name="settings/usuaiors" options={modalOptions} />
            </Stack>
            <StatusBar style="auto" backgroundColor="transparent" translucent />
          </ThemeProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}