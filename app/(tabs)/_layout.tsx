import * as React from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ClientesScreen from './clientes';
import ConfiguracionScreen from './configuracion';
import InicioScreen from './inicio';
import { ProductosScreen } from './productos';
import VentasScreen from './ventas';

import T from '@/constants/THEME';
import { MaterialCommunityIcons as MIcon } from '@expo/vector-icons';

// 🔥 NUEVO
import { useAuthStore } from '@/State/store/useAuthStore';
import LoadingScreen from '@/components/LoadScreen';


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
  { key: 'inicio', title: 'Home', icon: 'home-outline', iconActive: 'home', screen: InicioScreen },
  { key: 'productos', title: 'Stock', icon: 'cube-outline', iconActive: 'cube', screen: ProductosScreen },
  { key: 'ventas', title: 'Ventas', icon: 'cart-outline', iconActive: 'cart', screen: VentasScreen },
  { key: 'clientes', title: 'Clientes', icon: 'account-group-outline', iconActive: 'account-group', screen: ClientesScreen },
  { key: 'configuracion', title: 'Perfil', icon: 'account-circle-outline', iconActive: 'account-circle', screen: ConfiguracionScreen },
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
      tension: 250,
      friction: 14,
    }).start();
  }, [active]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });
  const pillOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const pillScale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  const iconColor = active ? T.bg : T.textMuted;

  return (
    <Pressable onPress={onPress} style={styles.tabItem}>
      <Animated.View style={[
        styles.pill,
        {
          opacity: pillOpacity,
          transform: [{ scaleX: pillScale }],
        }
      ]} />

      <Animated.View style={[styles.tabInner, { transform: [{ scale }] }]}>
        <MIcon
          name={(active ? route.iconActive : route.icon) as any}
          size={20}
          color={iconColor}
        />
      </Animated.View>
    </Pressable>
  );
});

// ─── Screens memo ─────────────────────────────────────────────────────────────
const MemoScreens = ROUTES.reduce((acc, r) => {
  const Memo = React.memo(r.screen);
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


  const { loading, isAuthenticated } = useAuthStore();

  // 🔥 LOADING GLOBAL
  if (loading) {
    return <LoadingScreen text="Cargando aplicación..." />;
  }

  // 🔥 PROTECCIÓN DE SESIÓN
  if (!isAuthenticated) {
    return null;
  }

  const ActiveScreen = MemoScreens[ROUTES[index].key];

  return (
    <View style={styles.root}>
      <View style={styles.screenContainer}>
        <ActiveScreen />
      </View>

      {/* Tab bar */}
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
    backgroundColor: T.bg,
  },
  screenContainer: {
    flex: 1,
  },
  tabBarWrapper: {
    position: 'absolute',
    left: 10,
    right: 10,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 66,
    borderRadius: 36,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  pill: {
    position: 'absolute',
    top: 10,
    bottom: 10,
    left: 4,
    right: 4,
    backgroundColor: T.accent,
    borderRadius: 22,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});