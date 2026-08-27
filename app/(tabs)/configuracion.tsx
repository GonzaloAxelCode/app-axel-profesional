import { useAppTheme } from '@/State/context/ThemeContext';
import { useAuthStore } from '@/State/store/useAuthStore';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import {
    Animated,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { queryClient } from '../_layout';

const TABS = [
    { key: 'cuenta', label: 'Mi Cuenta' },
    { key: 'permisos', label: 'Mis Permisos' },
    { key: 'temas', label: 'Temas y UI' },
];

export default function SettingsScreen() {
    const { T, mode, toggleTheme } = useAppTheme();
    const { user, tienda, logout } = useAuthStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const indicatorAnim = useRef(new Animated.Value(0)).current;
    const [tabXs, setTabXs] = useState<number[]>([]);
    const [textWidths, setTextWidths] = useState<number[]>([]);

    useEffect(() => {
        Animated.spring(indicatorAnim, {
            toValue: activeTab,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
    }, [activeTab]);

    const handleTabLayout = (index: number, e: any) => {
        const { x } = e.nativeEvent.layout;
        setTabXs(prev => { const next = [...prev]; next[index] = x; return next; });
    };

    const handleTextLayout = (index: number, e: any) => {
        const { width } = e.nativeEvent.layout;
        setTextWidths(prev => { const next = [...prev]; next[index] = width; return next; });
    };

    const indicatorX = indicatorAnim.interpolate({
        inputRange: TABS.map((_, i) => i),
        outputRange: TABS.map((_, i) => (tabXs[i] || 0) + 16),
    });

    const indicatorWidth = textWidths[activeTab] || 0;

    const handleLogout = async () => {
        await logout();
        queryClient.clear();
        queryClient.removeQueries();
        router.replace('/login');
    };

    const isDark = mode === 'dark';

    return (
        <View style={st.root}>
            {/* Header */}
            <View style={st.headerWrap}>
                <View style={st.header}>
                    <Text style={st.title}>Configuración</Text>
                    <Text style={st.subtitle}>Administra tu cuenta, permisos y preferencias</Text>
                </View>

                {/* Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.tabsScroll}>
                    <View style={st.tabsRow}>
                        {TABS.map((tab, i) => {
                            const focused = activeTab === i;
                            return (
                                <TouchableOpacity key={tab.key} onPress={() => setActiveTab(i)} onLayout={(e) => handleTabLayout(i, e)} activeOpacity={0.7} style={st.tab}>
                                    <Text onLayout={(e) => handleTextLayout(i, e)} style={[st.tabLabel, { color: focused ? T.accent : T.textMuted }]}>
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                        {indicatorWidth > 0 && (
                            <Animated.View style={[st.indicator, { backgroundColor: T.accent, width: indicatorWidth, transform: [{ translateX: indicatorX }] }]} />
                        )}
                    </View>
                </ScrollView>
            </View>

            {/* Contenido */}
            <ScrollView style={st.content} contentContainerStyle={st.contentScroll} showsVerticalScrollIndicator={false}>

                {/* TAB: Mi Cuenta */}
                {activeTab === 0 && (
                    <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                        {/* Perfil card */}
                        <View style={{ backgroundColor: T.surface, borderRadius: 16, borderWidth: 1, borderColor: T.border, overflow: 'hidden', marginBottom: 16 }}>
                            <View style={{ height: 60, backgroundColor: T.surfaceAlt }} />
                            <View style={{ padding: 18, paddingTop: 0 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -30 }}>
                                    <View style={{
                                        width: 64, height: 64, borderRadius: 20,
                                        backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center',
                                        borderWidth: 3, borderColor: T.surface,
                                    }}>
                                        <Text style={{ fontSize: 24, fontWeight: '900', color: T.textSecondary }}>
                                            {user?.username?.charAt(0)?.toUpperCase() || '?'}
                                        </Text>
                                    </View>
                                    <View style={{ backgroundColor: T.surfaceAlt, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                                        <Text style={{ fontSize: 11, fontWeight: '600', color: T.textSecondary }}>
                                            {user?.is_staff ? 'Administrador' : 'Empleado'}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={{ fontSize: 18, fontWeight: '800', color: T.textPrimary, marginTop: 8 }}>
                                    {user?.first_name || user?.username || 'Usuario'}
                                </Text>
                                <Text style={{ fontSize: 13, color: T.textMuted }}>@{user?.username}</Text>
                            </View>

                            {/* Stats */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: T.border }}>
                                {[
                                    { label: 'Miembro desde', value: '2025' },
                                    { label: 'Estado', value: 'Activo', isGreen: true },
                                    { label: 'Rol', value: user?.is_staff ? 'Admin' : 'Empleado' },
                                ].map((s, i) => (
                                    <View key={i} style={{ flex: 1, padding: 12, alignItems: 'center', borderRightWidth: i < 2 ? 1 : 0, borderRightColor: T.border }}>
                                        <Text style={{ fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.label}</Text>
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: s.isGreen ? T.green : T.textPrimary, marginTop: 2 }}>{s.value}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Datos de la cuenta */}
                        <Text style={{ fontSize: 12, fontWeight: '700', color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Datos de la cuenta</Text>
                        <View style={{ backgroundColor: T.surface, borderRadius: 16, borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 16 }}>
                            {[
                                { label: 'Nombre', value: user?.first_name || '—' },
                                { label: 'Apellido', value: user?.last_name || '—' },
                                { label: 'Usuario', value: user?.username || '—' },
                                { label: 'Rol', value: user?.is_staff ? 'Administrador' : 'Empleado' },
                            ].map((d, i) => (
                                <View key={i} style={{ marginBottom: i < 3 ? 12 : 0 }}>
                                    <Text style={{ fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 }}>{d.label}</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: T.textPrimary, marginTop: 2 }}>{d.value}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Tienda asignada */}
                        {tienda?.nombre && (
                            <>
                                <Text style={{ fontSize: 12, fontWeight: '700', color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Tienda asignada</Text>
                                <View style={{ backgroundColor: T.surface, borderRadius: 16, borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 16 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                                        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon name="storefront-outline" size={20} color={T.textSecondary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 15, fontWeight: '700', color: T.textPrimary }}>{tienda.nombre}</Text>
                                            <Text style={{ fontSize: 11, color: T.textMuted }}>Tienda asignada</Text>
                                        </View>
                                    </View>
                                    {[
                                        { label: 'RUC', value: tienda.ruc },
                                        { label: 'Razón social', value: tienda.razon_social },
                                        { label: 'Dirección', value: tienda.direccion },
                                        { label: 'Teléfono', value: tienda.telefono },
                                        { label: 'Email', value: tienda.email },
                                    ].map((d, i) => (
                                        <View key={i} style={{ marginBottom: i < 5 ? 10 : 0 }}>
                                            <Text style={{ fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 }}>{d.label}</Text>
                                            <Text style={{ fontSize: 13, color: T.textPrimary, marginTop: 1 }}>{d.value || '—'}</Text>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}

                        {/* Cerrar sesión */}
                        <TouchableOpacity
                            onPress={handleLogout}
                            activeOpacity={0.8}
                            style={{
                                flexDirection: 'row', alignItems: 'center', gap: 12,
                                backgroundColor: T.red + '0a', borderRadius: 16,
                                padding: 16, borderWidth: 1, borderColor: T.red + '25',
                                marginBottom: 40,
                            }}
                        >
                            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: T.red + '18', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon name="logout" size={20} color={T.red} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: T.red }}>Cerrar sesión</Text>
                                <Text style={{ fontSize: 11, color: T.red + '80' }}>Salir de tu cuenta</Text>
                            </View>
                            <Icon name="chevron-right" size={20} color={T.red + '60'} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* TAB: Mis Permisos */}
                {activeTab === 1 && (
                    <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                        <View style={{ backgroundColor: T.surface, borderRadius: 16, borderWidth: 1, borderColor: T.border, overflow: 'hidden' }}>
                            {/* Ventas */}
                            <View style={{ padding: 18 }}>
                                <Text style={{ fontSize: 10, fontWeight: '700', color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14 }}>Ventas</Text>
                                {[
                                    { label: 'Realizar ventas', value: user?.permissions?.can_make_sale },
                                    { label: 'Cancelar ventas', value: user?.permissions?.can_cancel_sale },
                                ].map((p, i) => (
                                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: i === 0 ? 14 : 0 }}>
                                        <Text style={{ fontSize: 14, color: T.textPrimary }}>{p.label}</Text>
                                        <View style={{
                                            width: 48, height: 26, borderRadius: 13,
                                            backgroundColor: p.value ? T.green : T.surfaceAlt,
                                            justifyContent: 'center', paddingHorizontal: 3,
                                        }}>
                                            <View style={{
                                                width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff',
                                                alignSelf: p.value ? 'flex-end' : 'flex-start',
                                                alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Text style={{ fontSize: 10, fontWeight: '700', color: p.value ? T.green : T.textMuted }}>
                                                    {p.value ? '✓' : '✕'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            <View style={{ height: 1, backgroundColor: T.border }} />

                            {/* Inventario */}
                            <View style={{ padding: 18 }}>
                                <Text style={{ fontSize: 10, fontWeight: '700', color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14 }}>Inventario</Text>
                                {[
                                    { label: 'Crear inventario', value: user?.permissions?.can_create_inventory },
                                    { label: 'Modificar inventario', value: user?.permissions?.can_modify_inventory },
                                    { label: 'Eliminar inventario', value: user?.permissions?.can_delete_inventory },
                                ].map((p, i) => (
                                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: i < 2 ? 14 : 0 }}>
                                        <Text style={{ fontSize: 14, color: T.textPrimary }}>{p.label}</Text>
                                        <View style={{
                                            width: 48, height: 26, borderRadius: 13,
                                            backgroundColor: p.value ? T.green : T.surfaceAlt,
                                            justifyContent: 'center', paddingHorizontal: 3,
                                        }}>
                                            <View style={{
                                                width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff',
                                                alignSelf: p.value ? 'flex-end' : 'flex-start',
                                                alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Text style={{ fontSize: 10, fontWeight: '700', color: p.value ? T.green : T.textMuted }}>
                                                    {p.value ? '✓' : '✕'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            <View style={{ height: 1, backgroundColor: T.border }} />

                            {/* Productos */}
                            <View style={{ padding: 18 }}>
                                <Text style={{ fontSize: 10, fontWeight: '700', color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14 }}>Productos</Text>
                                {[
                                    { label: 'Crear productos', value: user?.permissions?.can_create_product },
                                    { label: 'Actualizar productos', value: user?.permissions?.can_update_product },
                                    { label: 'Eliminar productos', value: user?.permissions?.can_delete_product },
                                ].map((p, i) => (
                                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: i < 2 ? 14 : 0 }}>
                                        <Text style={{ fontSize: 14, color: T.textPrimary }}>{p.label}</Text>
                                        <View style={{
                                            width: 48, height: 26, borderRadius: 13,
                                            backgroundColor: p.value ? T.green : T.surfaceAlt,
                                            justifyContent: 'center', paddingHorizontal: 3,
                                        }}>
                                            <View style={{
                                                width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff',
                                                alignSelf: p.value ? 'flex-end' : 'flex-start',
                                                alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Text style={{ fontSize: 10, fontWeight: '700', color: p.value ? T.green : T.textMuted }}>
                                                    {p.value ? '✓' : '✕'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            <View style={{ height: 1, backgroundColor: T.border }} />

                            {/* Categorías */}
                            <View style={{ padding: 18 }}>
                                <Text style={{ fontSize: 10, fontWeight: '700', color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14 }}>Categorías</Text>
                                {[
                                    { label: 'Crear categorías', value: user?.permissions?.can_create_category },
                                    { label: 'Modificar categorías', value: user?.permissions?.can_modify_category },
                                    { label: 'Eliminar categorías', value: user?.permissions?.can_delete_category },
                                ].map((p, i) => (
                                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: i < 2 ? 14 : 0 }}>
                                        <Text style={{ fontSize: 14, color: T.textPrimary }}>{p.label}</Text>
                                        <View style={{
                                            width: 48, height: 26, borderRadius: 13,
                                            backgroundColor: p.value ? T.green : T.surfaceAlt,
                                            justifyContent: 'center', paddingHorizontal: 3,
                                        }}>
                                            <View style={{
                                                width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff',
                                                alignSelf: p.value ? 'flex-end' : 'flex-start',
                                                alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Text style={{ fontSize: 10, fontWeight: '700', color: p.value ? T.green : T.textMuted }}>
                                                    {p.value ? '✓' : '✕'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                )}

                {/* TAB: Temas y UI */}
                {activeTab === 2 && (
                    <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                        {/* Apariencia */}
                        <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Apariencia</Text>
                        <Text style={{ fontSize: 12, color: T.textMuted, marginBottom: 12 }}>Personaliza la apariencia de la interfaz</Text>

                        <View style={{ backgroundColor: T.surface, borderRadius: 16, borderWidth: 1, borderColor: T.border, overflow: 'hidden', marginBottom: 24 }}>
                            {/* Modo Oscuro */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: isDark ? T.accent + '18' : T.amber + '18', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon name={isDark ? 'weather-night' : 'white-balance-sunny'} size={20} color={isDark ? T.accent : T.amber} />
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: T.textPrimary }}>Modo Oscuro</Text>
                                        <Text style={{ fontSize: 11, color: T.textMuted }}>{isDark ? 'Interfaz oscura' : 'Interfaz clara'}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', backgroundColor: T.surfaceAlt, borderRadius: 10, padding: 3 }}>
                                    <TouchableOpacity
                                        onPress={() => { if (isDark) toggleTheme(); }}
                                        style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: !isDark ? T.surface : 'transparent' }}
                                    >
                                        <Text style={{ fontSize: 12, fontWeight: !isDark ? '700' : '500', color: !isDark ? T.textPrimary : T.textMuted }}>Claro</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => { if (!isDark) toggleTheme(); }}
                                        style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: isDark ? T.surface : 'transparent' }}
                                    >
                                        <Text style={{ fontSize: 12, fontWeight: isDark ? '700' : '500', color: isDark ? T.textPrimary : T.textMuted }}>Oscuro</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Interfaz */}
                        <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Interfaz</Text>
                        <Text style={{ fontSize: 12, color: T.textMuted, marginBottom: 12 }}>Ajustes de la interfaz de usuario</Text>

                        <View style={{ backgroundColor: T.surface, borderRadius: 16, borderWidth: 1, borderColor: T.border, overflow: 'hidden' }}>
                            {[
                                { icon: 'view-dashboard-outline', label: 'Sidebar Compacto', desc: 'Mostrar solo iconos en la barra lateral' },
                                { icon: 'palette-outline', label: 'Color de Acento', desc: 'Color principal de la interfaz' },
                                { icon: 'translate', label: 'Idioma', desc: 'Español (predeterminado)' },
                            ].map((item, i) => (
                                <View key={i}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}>
                                        <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon name={item.icon as any} size={20} color={T.textSecondary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 14, fontWeight: '600', color: T.textPrimary }}>{item.label}</Text>
                                            <Text style={{ fontSize: 11, color: T.textMuted }}>{item.desc}</Text>
                                        </View>
                                        <View style={{ backgroundColor: T.surfaceAlt, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                                            <Text style={{ fontSize: 10, color: T.textMuted }}>Próximamente</Text>
                                        </View>
                                    </View>
                                    {i < 2 && <View style={{ height: 1, backgroundColor: T.border, marginLeft: 68 }} />}
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const st = StyleSheet.create({
    root: { flex: 1, backgroundColor: 'transparent' },
    headerWrap: { backgroundColor: 'transparent', paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 4 },
    header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, marginBottom: 8 },
    title: { fontSize: 26, fontWeight: '900', color: '#F5F5F5', letterSpacing: -0.5 },
    subtitle: { fontSize: 14, color: '#707070', marginTop: 6, lineHeight: 20 },
    tabsScroll: { paddingHorizontal: 16 },
    tabsRow: { flexDirection: 'row', position: 'relative' },
    tab: { paddingHorizontal: 16, paddingVertical: 12 },
    tabLabel: { fontSize: 13, fontWeight: '600' },
    indicator: { position: 'absolute', bottom: 0, height: 3, borderRadius: 2 },
    content: { flex: 1, backgroundColor: 'transparent' },
    contentScroll: { paddingBottom: 120 },
});
