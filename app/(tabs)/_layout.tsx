
import * as React from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C } from '@/State/utils/c';
import { Icon } from 'react-native-paper';
import ClientesScreen from './clientes';
import ConfiguracionScreen from './configuracion';
import InicioScreen from './inicio';
import { ProductosScreen } from './productos';
import VentasScreen from './ventas';

// ─── Paleta del rediseño ──────────────────────────────────────────────────────



// ─── Tipos ────────────────────────────────────────────────────────────────────

type Route = {
  key: string;
  title: string;
  icon: string;
  iconActive: string;
  badge?: boolean;
  screen: React.ComponentType;
};

// ─── Rutas ────────────────────────────────────────────────────────────────────

const ROUTES: Route[] = [
  { key: 'inicio', title: 'Inicio', icon: 'home-outline', iconActive: 'home', screen: InicioScreen },
  { key: 'productos', title: 'Productos', icon: 'cube-outline', iconActive: 'cube', screen: ProductosScreen },
  { key: 'ventas', title: 'Ventas', icon: 'cart-outline', iconActive: 'cart', screen: VentasScreen, badge: true },
  { key: 'clientes', title: 'Clientes', icon: 'account-group-outline', iconActive: 'account-group', screen: ClientesScreen },
  { key: 'configuracion', title: 'Settings', icon: 'cog-outline', iconActive: 'cog', screen: ConfiguracionScreen },
];

// ─── Tab Item ─────────────────────────────────────────────────────────────────

const TabItem = React.memo(function TabItem({
  route,
  active,
  onPress,
}: {
  route: Route;
  active: boolean;
  onPress: () => void;
}) {
  const anim = React.useRef(new Animated.Value(active ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(anim, {
      toValue: active ? 1 : 0,
      useNativeDriver: true,
      tension: 220,
      friction: 12,
      overshootClamping: false,
    }).start();
  }, [active]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const pillOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const labelOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
  const iconColor = active ? C.accent : C.textMuted;

  return (
    <Pressable
      onPress={onPress}
      style={styles.tabItem}
      hitSlop={8}
      android_ripple={null}
    >
      {/* Píldora de fondo */}
      <Animated.View style={[styles.pill, { opacity: pillOpacity }]} />

      {/* Ícono */}
      <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
        <Icon
          source={active ? route.iconActive : route.icon}
          size={22}
          color={iconColor}
        />
      </Animated.View>

      {/* Etiqueta — Text nativo de react-native (NO de react-native-paper) */}
      <Animated.Text
        numberOfLines={1}
        style={[styles.tabLabel, { opacity: labelOpacity }]}
      >
        {route.title}
      </Animated.Text>

      {/* Badge */}
      {route.badge && <View style={styles.badge} />}

      {/* Punto indicador activo */}
      {active && <View style={styles.activeDot} />}
    </Pressable>
  );
});

// ─── Screens en memo — con displayName explícito para evitar el TypeError ─────

const MemoScreens = ROUTES.reduce((acc, r) => {
  const Memo = React.memo(r.screen);
  Memo.displayName = r.key;
  acc[r.key] = Memo;
  return acc;
}, {} as Record<string, React.MemoExoticComponent<React.ComponentType>>);

// ─── Layout principal ─────────────────────────────────────────────────────────

export default function TabLayout() {
  const [index, setIndex] = React.useState(0);
  const insets = useSafeAreaInsets();

  const handlers = React.useMemo(
    () => ROUTES.map((_, i) => () => setIndex(i)),
    [],
  );

  const ActiveScreen = MemoScreens[ROUTES[index].key];

  return (
    <View style={styles.root}>
      <View style={styles.screenContainer}>
        <ActiveScreen />
      </View>

      <View style={[styles.tabBarWrapper, { bottom: Math.max(insets.bottom + 10, 18) }]}>
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

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  screenContainer: {
    flex: 1,
  },
  tabBarWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 68,
    borderRadius: 36,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 3,
    position: 'relative',
  },
  pill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 230, 74, 0.10)',
    borderRadius: 20,
    marginHorizontal: 4,
    marginVertical: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: C.accent,
    letterSpacing: 0.3,
  },
  activeDot: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.accent,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: C.surface,
    zIndex: 10,
  },
});