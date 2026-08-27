import { useAppTheme } from '@/State/context/ThemeContext';
import { useAuthStore } from '@/State/store/useAuthStore';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,
    PanResponder,
    StatusBar,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useTabRouter } from '@/app/(tabs)/_layout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DrawerItem = {
    icon: string;
    label: string;
    subtitle?: string;
    route?: string;
    color?: string;
    dividerBefore?: boolean;
    isBeta?: boolean;
};

const DRAWER_ITEMS: DrawerItem[] = [
    { icon: 'clipboard-list-outline', label: 'Pedidos', subtitle: 'Historial y registro', route: '/(tabs)/pedidos', isBeta: true },
    { icon: 'video-outline', label: 'TikTok Live', subtitle: 'Ventas en vivo', route: '/(tabs)/tiktok', isBeta: true },
    { icon: 'cog-outline', label: 'Configuración', subtitle: 'Cuenta y preferencias', route: '/(tabs)/configuracion', dividerBefore: true },
];

interface Props {
    visible: boolean;
    onClose: () => void;
    width: number;
}

export default function DrawerMenu({ visible, onClose, width }: Props) {
    const { T } = useAppTheme();
    const { user, tienda, logout } = useAuthStore();
    const navigateToTab = useTabRouter();
    const translateX = useRef(new Animated.Value(width)).current;
    const lastTranslateX = useRef(width);

    useEffect(() => {
        const toValue = visible ? 0 : width;
        lastTranslateX.current = toValue;
        Animated.spring(translateX, {
            toValue,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
    }, [visible]);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => {
                return Math.abs(g.dx) > 10 && g.dx > 0;
            },
            onPanResponderMove: (_, g) => {
                const newVal = Math.max(0, Math.min(width, lastTranslateX.current + g.dx));
                translateX.setValue(newVal);
            },
            onPanResponderRelease: (_, g) => {
                const currentVal = lastTranslateX.current + g.dx;
                if (currentVal < width * 0.4) {
                    onClose();
                } else {
                    Animated.spring(translateX, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
                    lastTranslateX.current = 0;
                }
            },
        })
    ).current;

    const handleItemPress = (item: DrawerItem) => {
        onClose();
        if (item.route) {
            const tabName = item.route.replace('/(tabs)/', '').replace('/', '');
            setTimeout(() => navigateToTab(tabName), 300);
        }
    };

    const handleLogout = () => {
        onClose();
        setTimeout(() => logout(), 300);
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.drawer,
                {
                    width,
                    backgroundColor: T.surface,
                    transform: [{ translateX }],
                    borderLeftColor: T.border,
                },
            ]}
            {...panResponder.panHandlers}
        >
            <StatusBar barStyle={T.bg === '#050505' ? 'light-content' : 'dark-content'} />

            {/* Header del drawer */}
            <View style={[styles.header, { borderBottomColor: T.border }]}>
                <View style={[styles.avatar, { backgroundColor: T.accent + '22' }]}>
                    <Icon name="storefront-outline" size={28} color={T.accent} />
                </View>
                <View style={styles.headerInfo}>
                    <Text style={[styles.tiendaName, { color: T.textPrimary }]} numberOfLines={1}>
                        {tienda?.nombre || 'Mi Tienda'}
                    </Text>
                    <Text style={[styles.userName, { color: T.textSecondary }]} numberOfLines={1}>
                        {user?.first_name || user?.username || 'Usuario'}
                    </Text>
                </View>
            </View>

            {/* Items */}
            <View style={styles.items}>
                {DRAWER_ITEMS.map((item, i) => (
                    <React.Fragment key={i}>
                        {item.dividerBefore && (
                            <View style={[styles.divider, { backgroundColor: T.border }]} />
                        )}
                        <TouchableOpacity
                            style={[styles.item, { backgroundColor: 'transparent' }]}
                            onPress={() => handleItemPress(item)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.itemIcon, { backgroundColor: T.surfaceAlt }]}>
                                <Icon name={item.icon as any} size={20} color={T.textSecondary} />
                            </View>
                            <View style={styles.itemText}>
                                <View style={styles.itemLabelRow}>
                                    <Text style={[styles.itemLabel, { color: T.textPrimary }]}>{item.label}</Text>
                                    {item.isBeta && (
                                        <View style={[styles.betaBadge, { backgroundColor: T.accent + '20' }]}>
                                            <Text style={[styles.betaText, { color: T.accent }]}>Beta</Text>
                                        </View>
                                    )}
                                </View>
                                {item.subtitle && (
                                    <Text style={[styles.itemSubtitle, { color: T.textMuted }]}>{item.subtitle}</Text>
                                )}
                            </View>
                            <Icon name="chevron-right" size={18} color={T.textMuted} />
                        </TouchableOpacity>
                    </React.Fragment>
                ))}
            </View>

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: T.border }]}>
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <Icon name="logout" size={20} color={T.red} />
                    <Text style={[styles.logoutText, { color: T.red }]}>Cerrar sesión</Text>
                </TouchableOpacity>
                <Text style={[styles.version, { color: T.textMuted }]}>GV Software Plus v1.0</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    drawer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        borderLeftWidth: 1,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: -4, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },

    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },

    avatar: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerInfo: {
        flex: 1,
    },

    tiendaName: {
        fontSize: 17,
        fontWeight: '800',
    },

    userName: {
        fontSize: 13,
        marginTop: 2,
    },

    items: {
        flex: 1,
        paddingTop: 8,
        paddingHorizontal: 12,
    },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 14,
    },

    itemIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    itemText: {
        flex: 1,
    },

    itemLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    itemLabel: {
        fontSize: 14,
        fontWeight: '600',
    },

    betaBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },

    betaText: {
        fontSize: 9,
        fontWeight: '700',
        textTransform: 'uppercase',
    },

    itemSubtitle: {
        fontSize: 11,
        marginTop: 1,
    },

    divider: {
        height: 1,
        marginVertical: 8,
        marginHorizontal: 12,
    },

    footer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        gap: 12,
    },

    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
    },

    logoutText: {
        fontSize: 14,
        fontWeight: '600',
    },

    version: {
        fontSize: 11,
        textAlign: 'center',
    },
});
