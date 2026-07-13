import * as React from 'react';
import { Platform, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import ConfiguracionScreen from './configuracion';
import InicioScreen from './inicio';
import { ProductosScreen } from './productos';
import VentasScreen from './ventas';

import LoadingScreen from '@/components/LoadScreen';
import { useAppTheme } from '@/State/context/ThemeContext';
import { useAuthStore } from '@/State/store/useAuthStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HacerVentaScreen from '../hacerventa';

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
  const { T } = useAppTheme();

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
      <StatusBar barStyle={T.bg === '#050505' ? 'light-content' : 'dark-content'} backgroundColor={T.bg} />
      <TabContext.Provider value={navigateToTab}>
        <View style={{ flex: 1, backgroundColor: T.bg }}>

          {/* CONTENIDO */}
          <View style={{ flex: 1 }}>
            {SceneComponent ? <SceneComponent /> : null}
          </View>

          {/* BARRA CUSTOM */}
          <View style={[styles.barWrapper, { paddingBottom: insets.bottom || 0, backgroundColor: T.surface, borderTopColor: T.border, borderTopWidth: 1 }]}>
            <View style={[styles.bar, { backgroundColor: T.surface }]}>
              {ROUTES.map((route: any, i) => {
                const focused = index === i;

                if (route.isFab) {
                  return (
                    <Pressable
                      key={route.key}
                      onPress={() => setIndex(i)}
                      style={styles.fabBtn}
                      android_ripple={null}
                    >
                      <View style={[styles.fab, { backgroundColor: T.accent }]}>
                        <MaterialCommunityIcons name="cart" size={24} color={T.bg} />
                      </View>
                    </Pressable>
                  );
                }

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
                      color={focused ? T.accent : T.textMuted}
                    />
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: focused ? '700' : '500',
                        color: focused ? T.accent : T.textMuted,
                      }}
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
    </GestureHandlerRootView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  barWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 0,
  },

  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 0,
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: '100%',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },

  fabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fab: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
