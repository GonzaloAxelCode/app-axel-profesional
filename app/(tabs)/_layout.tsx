import * as React from 'react';
import { Dimensions, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import ConfiguracionScreen from './configuracion';
import InicioScreen from './inicio';
import { ProductosScreen } from './productos';
import VentasScreen from './ventas';
import ClientesScreen from './clientes';
import PedidosScreen from './pedidos';
import TikTokScreen from './tiktok';

import LoadingScreen from '@/components/LoadScreen';
import { useAppTheme } from '@/State/context/ThemeContext';
import { useAuthStore } from '@/State/store/useAuthStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HacerVentaScreen from '../hacerventa';
import DrawerMenu from '@/components/DrawerMenu';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

// ─── Tab Context ──────────────────────────────────────────────────────────────
export const TabContext = React.createContext<(key: string) => void>(() => { });
export const useTabRouter = () => React.useContext(TabContext);

export const DrawerContext = React.createContext<() => void>(() => { });
export const useDrawer = () => React.useContext(DrawerContext);

// ─── Rutas (solo las que aparecen en la barra de tabs) ────────────────────────
type RouteKey = 'inicio' | 'productos' | 'hacerventa' | 'ventas' | 'clientes' | 'configuracion' | 'ajustes' | 'pedidos' | 'tiktok';

const ROUTES: {
    key: RouteKey;
    title: string;
    icon: string;
    isFab?: boolean;
    hidden?: boolean;
}[] = [
    { key: 'inicio', title: 'Inicio', icon: 'home' },
    { key: 'productos', title: 'Stock', icon: 'cube' },
    { key: 'ventas', title: 'Ventas', icon: 'chart-bar' },
    { key: 'hacerventa', title: '', icon: 'cart', isFab: true },
    { key: 'clientes', title: 'Clientes', icon: 'account-group' },
    { key: 'ajustes', title: 'Config', icon: 'cog-outline' },
    { key: 'configuracion', title: 'Más', icon: 'dots-horizontal' },
    { key: 'pedidos', title: 'Pedidos', icon: 'clipboard-list', hidden: true },
    { key: 'tiktok', title: 'TikTok', icon: 'video', hidden: true },
];

// ─── Scenes ───────────────────────────────────────────────────────────────────
const SCENES: Record<string, React.ComponentType<any>> = {
    inicio: InicioScreen,
    productos: ProductosScreen,
    ventas: VentasScreen,
    hacerventa: HacerVentaScreen,
    clientes: ClientesScreen,
    configuracion: ConfiguracionScreen,
    ajustes: ConfiguracionScreen,
    pedidos: PedidosScreen,
    tiktok: TikTokScreen,
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function TabLayout() {
    const [index, setIndex] = React.useState(0);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const { loading, isAuthenticated } = useAuthStore();
    const insets = useSafeAreaInsets();
    const { T } = useAppTheme();

    const navigateToTab = React.useCallback((key: string) => {
        const i = ROUTES.findIndex(r => r.key === key);
        if (i !== -1) setIndex(i);
    }, []);

    const openDrawer = React.useCallback(() => {
        setDrawerOpen(true);
    }, []);

    const closeDrawer = React.useCallback(() => {
        setDrawerOpen(false);
    }, []);

    if (loading) return <LoadingScreen text="Cargando aplicación..." />;
    if (!isAuthenticated) return null;

    const activeRoute = ROUTES[index];
    const SceneComponent = SCENES[activeRoute?.key ?? 'inicio'];

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar barStyle={T.bg === '#050505' ? 'light-content' : 'dark-content'} backgroundColor={T.bg} />
            <TabContext.Provider value={navigateToTab}>
                <DrawerContext.Provider value={openDrawer}>
                    <View style={{ flex: 1, backgroundColor: T.bg }}>

                        {/* CONTENIDO */}
                        <View style={{ flex: 1 }}>
                            {SceneComponent ? <SceneComponent /> : null}
                        </View>

                        {/* BARRA DE TABS - Estilo WhatsApp */}
                        <View style={[styles.barWrapper, { backgroundColor: T.surface }]}>
                            <View style={[styles.barInner, { paddingBottom: insets.bottom || 0, borderTopColor: T.border, borderTopWidth: 1 }]}>
                                <View style={[styles.bar, { backgroundColor: T.surface }]}>
                                    {ROUTES.filter(route => !route.hidden).map((route: any, i) => {
                                        const focused = index === ROUTES.indexOf(route);

                                        if (route.isFab) {
                                            return (
                                                <Pressable
                                                    key={route.key}
                                                    onPress={() => setIndex(ROUTES.indexOf(route))}
                                                    style={styles.fabBtn}
                                                    android_ripple={null}
                                                >
                                                    <View style={[styles.fab, { backgroundColor: T.accent }]}>
                                                        <MaterialCommunityIcons name="cart" size={22} color={T.bg} />
                                                    </View>
                                                </Pressable>
                                            );
                                        }

                                        return (
                                            <Pressable
                                                key={route.key}
                                                onPress={() => {
                                                    if (route.key === 'configuracion') {
                                                        openDrawer();
                                                    } else {
                                                        setIndex(ROUTES.indexOf(route));
                                                    }
                                                }}
                                                style={styles.tab}
                                                android_ripple={null}
                                            >
                                                <View style={styles.tabIconWrap}>
                                                    <MaterialCommunityIcons
                                                        name={route.icon}
                                                        size={22}
                                                        color={focused ? T.accent : T.textMuted}
                                                    />
                                                    {focused && <View style={[styles.activeDot, { backgroundColor: T.accent }]} />}
                                                </View>
                                                <Text
                                                    style={{
                                                        fontSize: 10,
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

                        {/* DRAWER OVERLAY */}
                        {drawerOpen && (
                            <Pressable
                                style={styles.overlay}
                                onPress={closeDrawer}
                            >
                                <View style={styles.overlayBg} />
                            </Pressable>
                        )}

                        {/* DRAWER MENU */}
                        <DrawerMenu
                            visible={drawerOpen}
                            onClose={closeDrawer}
                            width={DRAWER_WIDTH}
                        />

                    </View>
                </DrawerContext.Provider>
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
    },

    barInner: {
        alignItems: 'center',
        paddingHorizontal: 0,
    },

    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 0,
        paddingVertical: 6,
        paddingHorizontal: 4,
        width: '100%',
    },

    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        paddingVertical: 4,
    },

    tabIconWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
    },

    activeDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
    },

    fabBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },

    fab: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 90,
    },

    overlayBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});
