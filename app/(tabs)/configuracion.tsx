import { useAppTheme } from '@/State/context/ThemeContext';
import { useAuthStore } from '@/State/store/useAuthStore';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { queryClient } from '../_layout';


// ─── tipos ────────────────────────────────────────────────────────────────────
type RowItem = {
    icon: string;
    iconBg: string;
    iconColor: string;
    title: string;
    subtitle: string;
    onPress?: () => void;
    right?: ReactNode;
};

// ─── ProfileCard ──────────────────────────────────────────────────────────────
function ProfileCard({ T }: { T: any }) {
    const { user, tienda, loadSession } = useAuthStore();
    const router = useRouter();
    useEffect(() => {
        loadSession();
    }, []);
    return (
        <TouchableOpacity
            style={{ margin: 20, marginBottom: 0, backgroundColor: T.surface, borderRadius: T.radiusXl, padding: 18, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: T.border }}
            onPress={() => router.push('/settings/perfil')}
            activeOpacity={0.85}
        >
            <View style={{ position: 'relative' }}>
                <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: T.accentDim, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: T.accent + '40' }}>
                    <Text style={{ fontSize: 20, fontWeight: '900', color: T.accent }}> {user?.username.charAt(0) || ''}</Text>
                </View>
                <View style={{ position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: T.green, borderWidth: 2, borderColor: T.surface }} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, letterSpacing: -0.3 }}>{user?.first_name}</Text>
                <View style={{ alignSelf: 'flex-start', backgroundColor: T.accentDim, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4, borderWidth: 1, borderColor: T.accent + '30' }}>
                    <Text style={{ fontSize: 11, color: T.accent, fontWeight: '700' }}>{user?.is_staff ? 'Administrador' : 'Empleado'}</Text>
                </View>
                <Text style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>{tienda?.nombre} · {tienda?.direccion}</Text>
            </View>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.border }}>
                <Icon name="chevron-right" size={18} color={T.textSecondary} />
            </View>
        </TouchableOpacity>
    );
}

// ─── SettingRow ───────────────────────────────────────────────────────────────
function SettingRow({ icon, iconBg, iconColor, title, subtitle, onPress, right, T }: RowItem & { T: any }) {
    return (
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14 }} onPress={onPress} activeOpacity={0.7}>
            <View style={{ width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderWidth: 1, borderColor: T.border, backgroundColor: iconBg }}>
                <Icon name={icon as any} size={17} color={iconColor} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: T.textPrimary }}>{title}</Text>
                <Text style={{ fontSize: 12, color: T.textMuted, marginTop: 1 }}>{subtitle}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {right ?? (
                    <View style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.border }}>
                        <Icon name="chevron-right" size={15} color={T.textMuted} />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

function Group({ items, T }: { items: RowItem[]; T: any }) {
    return (
        <View style={{ marginHorizontal: 20, backgroundColor: T.surface, borderRadius: T.radiusLg, borderWidth: 1, borderColor: T.border, overflow: 'hidden' }}>
            {items.map((item, i) => (
                <View key={item.title}>
                    <SettingRow {...item} T={T} />
                    {i < items.length - 1 && <View style={{ height: 1, backgroundColor: T.border, marginLeft: 62 }} />}
                </View>
            ))}
        </View>
    );
}

function SectionLabel({ label, T }: { label: string; T: any }) {
    return <Text style={{ fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: '700', marginTop: 20, marginBottom: 10, paddingHorizontal: 20 }}>{label}</Text>;
}

function Badge({ text, color = 'default', T }: { text: string; color?: 'default' | 'green' | 'accent'; T: any }) {
    const bgMap = { default: T.surfaceAlt, green: T.green + '18', accent: T.accentDim };
    const fgMap = { default: T.textSecondary, green: T.green, accent: T.accent };
    return (
        <View style={{ borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, backgroundColor: bgMap[color], borderColor: fgMap[color] + '30' }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: fgMap[color] }}>{text}</Text>
        </View>
    );
}

// ─── SettingsScreen ───────────────────────────────────────────────────────────
export default function SettingsScreen() {
    const router = useRouter();
    const { logout } = useAuthStore();
    const { T, mode, toggleTheme } = useAppTheme();

    const handleLogOut = async () => {
        await logout();
        queryClient.clear();
        queryClient.removeQueries();
        router.replace('/login');
    };

    const negocioItems: RowItem[] = [
        { icon: 'store-outline', iconBg: T.purple + '18', iconColor: T.purple, title: 'Mi tienda', subtitle: 'Configura tu tienda', onPress: () => router.push('/settings/tienda') },
        { icon: 'receipt-outline', iconBg: T.accentDim, iconColor: T.accent, title: 'Comprobantes', subtitle: 'Series, IGV y configuración SUNAT', onPress: () => router.push('/settings/comprobantes') },
        { icon: 'account-group-outline', iconBg: T.blue + '18', iconColor: T.blue, title: 'Usuarios y roles', subtitle: 'Gestiona accesos del equipo', onPress: () => router.push('/settings/usuarios') },
    ];

    const inventarioItems: RowItem[] = [
        { icon: 'tag-outline', iconBg: '#f9a8d4' + '18', iconColor: '#f9a8d4', title: 'Categorías', subtitle: 'Organiza tus productos', onPress: () => router.push('/settings/categorias') },
        { icon: 'chart-bar', iconBg: T.green + '18', iconColor: T.green, title: 'Alertas de stock', subtitle: 'Mínimo para notificarte', onPress: () => router.push('/settings/stock-alertas'), right: (<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Badge text="Activo" color="green" T={T} /><View style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.border }}><Icon name="chevron-right" size={15} color={T.textMuted} /></View></View>) },
        { icon: 'download-outline', iconBg: T.yellow + '18', iconColor: T.yellow, title: 'Exportar datos', subtitle: 'Excel, PDF o CSV', onPress: () => router.push('/settings/exportar') },
    ];

    const preferenciaItems: RowItem[] = [
        {
            icon: mode === 'dark' ? 'weather-night' : 'white-balance-sunny',
            iconBg: T.surfaceAlt,
            iconColor: T.accent,
            title: 'Modo oscuro',
            subtitle: mode === 'dark' ? 'Tema oscuro activado' : 'Tema claro activado',
            right: (
                <Switch
                    value={mode === 'dark'}
                    onValueChange={toggleTheme}
                    trackColor={{ false: T.borderMedium, true: T.accent }}
                    thumbColor={mode === 'dark' ? T.bg : T.surface}
                    ios_backgroundColor={T.borderMedium}
                />
            ),
        },
        { icon: 'bell-outline', iconBg: T.surfaceAlt, iconColor: T.textSecondary, title: 'Notificaciones', subtitle: 'Alertas y recordatorios', right: (<Switch value={true} onValueChange={() => { }} trackColor={{ false: T.borderMedium, true: T.accent }} thumbColor={T.bg} ios_backgroundColor={T.borderMedium} />) },
        { icon: 'lock-outline', iconBg: T.surfaceAlt, iconColor: T.textSecondary, title: 'Seguridad', subtitle: 'PIN y biometría', onPress: () => router.push('/settings/seguridad') },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: T.bg }}>
            <View style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20, backgroundColor: T.bg, borderBottomWidth: 1, borderBottomColor: T.border }}>
                <Text style={{ fontSize: 30, fontWeight: '900', color: T.textPrimary, letterSpacing: -1 }}>Ajustes</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <ProfileCard T={T} />

                <SectionLabel label="Negocio" T={T} />
                <Group items={negocioItems} T={T} />

                <SectionLabel label="Inventario" T={T} />
                <Group items={inventarioItems} T={T} />

                <SectionLabel label="Preferencias" T={T} />
                <Group items={preferenciaItems} T={T} />

                <SectionLabel label="Cuenta" T={T} />
                <TouchableOpacity
                    style={{ marginBottom: 12, marginHorizontal: 20, backgroundColor: T.red + '0a', borderRadius: T.radiusLg, borderWidth: 1, borderColor: T.red + '25', flexDirection: 'row', alignItems: 'center', padding: 14 }}
                    activeOpacity={0.8}
                    onPress={handleLogOut}
                >
                    <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: T.red + '18', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.red + '30' }}>
                        <Icon name="logout" size={17} color={T.red} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: T.red }}>Cerrar sesión</Text>
                    </View>
                    <View style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.red + '20' }}>
                        <Icon name="chevron-right" size={15} color={T.red + '80'} />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
