import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppThemeProvider, useAppTheme } from '@/State/context/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export const queryClient = new QueryClient({
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

function ThemedRoot() {
  const { mode, T } = useAppTheme();

  const paperTheme = mode === 'dark'
    ? { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, primary: T.accent, background: T.bg, surface: T.surface, onSurface: T.textPrimary } }
    : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: T.accent, background: T.bg, surface: T.surface, onSurface: T.textPrimary } };

  return (
    <PaperProvider theme={paperTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="productodetail" options={modalOptions} />
        <Stack.Screen name="settings/perfil" options={modalOptions} />
        <Stack.Screen name="settings/categorias" options={modalOptions} />
        <Stack.Screen name="settings/comprobantes" options={modalOptions} />
        <Stack.Screen name="settings/exportar" options={modalOptions} />
        <Stack.Screen name="settings/seguridad" options={modalOptions} />
        <Stack.Screen name="settings/stock-alertas" options={modalOptions} />
        <Stack.Screen name="settings/tienda" options={modalOptions} />
        <Stack.Screen name="settings/usuarios" options={modalOptions} />
      </Stack>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} backgroundColor="transparent" translucent />
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppThemeProvider>
          <ThemedRoot />
        </AppThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
