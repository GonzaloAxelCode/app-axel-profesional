import * as React from 'react';
import { Platform, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { MD3LightTheme, Provider as PaperProvider, Text } from 'react-native-paper';


import ConfiguracionScreen from './configuracion';
import InicioScreen from './inicio';
import { ProductosScreen } from './productos';
import VentasScreen from './ventas';

import LoadingScreen from '@/components/LoadScreen';
import T from '@/constants/THEME';
import { useAuthStore } from '@/State/store/useAuthStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HacerVentaScreen from '../hacerventa';

// ─── Paper Theme ──────────────────────────────────────────────────────────────
const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: T.accent,
    secondary: T.accent2,
    background: T.bg,
    surface: T.surface,
    surfaceVariant: T.surfaceAlt,
    onSurface: T.textPrimary,
    onSurfaceVariant: T.textMuted,
    secondaryContainer: T.accentDim,
    onSecondaryContainer: T.accent,
    outline: T.border,
    error: T.red,
  },
};

// ─── Tab Context ──────────────────────────────────────────────────────────────
export const TabContext = React.createContext<(key: string) => void>(() => { });
export const useTabRouter = () => React.useContext(TabContext);

// ─── Rutas ────────────────────────────────────────────────────────────────────
type RouteKey = 'inicio' | 'productos' | 'hacerventa' | 'ventas' | 'configuracion';

const ROUTES: {
  key: RouteKey;
  title: string;
  icon: string;
  isFab?: boolean;
}[] = [
    { key: 'inicio', title: 'Home', icon: 'home' },
    { key: 'productos', title: 'Stock', icon: 'cube' },
    { key: 'hacerventa', title: '', icon: 'cart', isFab: true },
    { key: 'ventas', title: 'Ventas', icon: 'chart-bar' },
    { key: 'configuracion', title: 'Perfil', icon: 'account-circle' },
  ];

// ─── Scenes ───────────────────────────────────────────────────────────────────
const SCENES: Record<string, React.ComponentType<any>> = {
  inicio: InicioScreen,
  productos: ProductosScreen,
  ventas: VentasScreen,
  hacerventa: HacerVentaScreen,
  configuracion: ConfiguracionScreen,
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function TabLayout() {
  const [index, setIndex] = React.useState(0);
  const { loading, isAuthenticated } = useAuthStore();
  const insets = useSafeAreaInsets();

  const navigateToTab = React.useCallback((key: string) => {
    const i = ROUTES.findIndex(r => r.key === key);
    if (i !== -1) setIndex(i);
  }, []);

  if (loading) return <LoadingScreen text="Cargando aplicación..." />;
  if (!isAuthenticated) return null;

  const activeRoute = ROUTES[index];
  const SceneComponent = SCENES[activeRoute?.key ?? 'inicio'];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={paperTheme}>
        <StatusBar barStyle="light-content" backgroundColor={T.bg} />
        <TabContext.Provider value={navigateToTab}>
          <View style={styles.root}>

            {/* CONTENIDO */}
            <View style={styles.scene}>
              {SceneComponent ? <SceneComponent /> : null}
            </View>

            {/* BARRA CUSTOM */}
            <View style={[styles.barWrapper, { paddingBottom: insets.bottom || 12 }]}>
              <View style={styles.bar}>
                {ROUTES.map((route: any, i) => {
                  const focused = index === i;

                  // ── FAB central ──────────────────────────────────────────────
                  if (route.isFab) {
                    return (
                      <Pressable
                        key={route.key}
                        onPress={() => setIndex(i)}
                        style={styles.fabBtn}
                        android_ripple={null}
                      >
                        <View style={styles.fab}>
                          <MaterialCommunityIcons
                            name="cart"
                            size={24}
                            color={T.bg}
                          />
                        </View>
                      </Pressable>
                    );
                  }

                  // ── Tab normal ───────────────────────────────────────────────
                  return (
                    <Pressable
                      key={route.key}
                      onPress={() => setIndex(i)}
                      style={styles.tab}
                      android_ripple={null}
                    >
                      <MaterialCommunityIcons
                        name={route.icon}
                        size={24}
                        color={focused ? '#FFFFFF' : T.textMuted}
                      />
                      <Text
                        style={[
                          styles.label,
                          { color: focused ? '#FFFFFF' : T.textMuted },
                          focused && styles.labelActive,
                        ]}
                      >
                        {route.title}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

          </View>
        </TabContext.Provider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.bg,
  },

  scene: {
    flex: 1,
  },

  barWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 0,
    backgroundColor: T.bg,
  },

  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "transparent",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
      android: { elevation: 16 },
    }),
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },

  label: {
    fontSize: 11,
    fontWeight: '500',
  },

  labelActive: {
    fontWeight: '700',
  },

  fabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fab: {
    width: 60,
    height: 60,
    borderRadius: 56,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: T.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.55,
        shadowRadius: 16,
      },
      android: { elevation: 10 },
    }),
  },
});