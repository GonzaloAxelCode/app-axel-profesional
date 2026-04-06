import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as React from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from 'react-native-paper';
import ClientesScreen from './clientes';
import ConfiguracionScreen from './configuracion';
import InicioScreen from './inicio';
import { ProductosScreen } from './productos';
import VentasScreen from './ventas';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Route = {
  key: string;
  title: string;
  icon: string;        // ícono inactivo (outline)
  iconActive: string;  // ícono activo (filled)
  badge?: boolean;
  screen: React.ComponentType;
};

// ─── Constantes fuera del componente para evitar recreación ──────────────────

const ROUTES: Route[] = [
  { key: 'inicio', title: 'Inicio', icon: 'home-outline', iconActive: 'home', screen: InicioScreen },
  { key: 'productos', title: 'Productos', icon: 'cube-outline', iconActive: 'cube', screen: ProductosScreen },
  { key: 'ventas', title: 'Ventas', icon: 'cart-outline', iconActive: 'cart', screen: VentasScreen, badge: true },
  { key: 'clientes', title: 'Clientes', icon: 'account-group-outline', iconActive: 'account-group', screen: ClientesScreen },
  { key: 'configuracion', title: 'Settings', icon: 'cog-outline', iconActive: 'cog', screen: ConfiguracionScreen },
];

// ─── Tab Item — memo para evitar re-renders innecesarios ──────────────────────

const TabItem = React.memo(function TabItem({
  route,
  active,
  onPress,
}: {
  route: any;
  active: boolean;
  onPress: () => void;
}) {
  // Una sola Animated.Value por tab, no se recrea entre renders
  const anim = React.useRef(new Animated.Value(active ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(anim, {
      toValue: active ? 1 : 0,
      useNativeDriver: true,   // siempre nativo — sin JS thread
      tension: 220,
      friction: 12,
      overshootClamping: false,
    }).start();
  }, [active]);

  // Derivar escala y opacidad del mismo valor animado (un solo driver)
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });
  const iconOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });
  const labelOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });
  const bgOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Pressable
      onPress={onPress}
      style={styles.tabItem}
      hitSlop={8}
      android_ripple={null}  // desactivar ripple nativo (causa janks en Android)
    >
      {/* Fondo pill activo */}
      <Animated.View style={[styles.pill, { opacity: bgOpacity }]} />

      <Animated.View style={{ transform: [{ scale }], opacity: iconOpacity, alignItems: 'center' }}>
        <Icon
          name={active ? route.iconActive : route.icon}
          size={22}
          color="#1a1a2e"
        />
      </Animated.View>

      <Animated.Text style={[styles.tabLabel, { opacity: labelOpacity }]}>
        <Text>

          {route.title}
        </Text>

      </Animated.Text>

      {/* Badge */}
      {route.badge && <View style={styles.badge} />}

      {/* Punto indicador */}
      {active && <View style={styles.activeDot} />}
    </Pressable>
  );
});

// ─── Screens en memo — evita rerenderizar la pantalla al cambiar de tab ───────

const screens = ROUTES.reduce((acc, r) => {
  acc[r.key] = React.memo(r.screen);
  return acc;
}, {} as Record<string, React.ComponentType>);

// ─── Layout principal ─────────────────────────────────────────────────────────

export default function TabLayout() {
  const [index, setIndex] = React.useState(0);
  const insets = useSafeAreaInsets();

  // Callbacks memorizados — evita recrear función en cada render
  const handlers = React.useMemo(
    () => ROUTES.map((_, i) => () => setIndex(i)),
    []
  );

  const ActiveScreen = screens[ROUTES[index].key];

  return (
    <View style={styles.root}>
      <View style={styles.screenContainer}>
        <ActiveScreen />
      </View>

      <View style={[styles.tabBarWrapper, { bottom: Math.max(insets.bottom + 8, 16) }]}>
        <View style={styles.tabBar}>
          {ROUTES.map((route, i) => (
            <TabItem
              key={route.key}
              route={route}
              active={index === i}
              onPress={handlers[i]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Estilos (fuera del componente, se crean una sola vez) ────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f0f2f8',
  },
  screenContainer: {
    flex: 1,
  },
  tabBarWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 68,
    borderRadius: 35,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.07)',
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 4,
    position: 'relative',
  },
  pill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderRadius: 18,
    marginHorizontal: 4,
    marginVertical: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1a1a2e',
    letterSpacing: 0.2,
  },
  activeDot: {
    position: 'absolute',
    bottom: 7,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#fff',
    zIndex: 10,
  },
});