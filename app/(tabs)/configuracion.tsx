import T from '@/constants/THEME';
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
function ProfileCard() {
    const { user, tienda, loadSession } = useAuthStore();
    const router = useRouter();
    useEffect(() => {
        loadSession();
    }, []);
    return (
        <TouchableOpacity
            style={styles.profileCard}
            onPress={() => router.push('/settings/perfil')}
            activeOpacity={0.85}
        >
            {/* Avatar grande al estilo de las imágenes */}
            <View style={styles.profileAvatarWrap}>
                <View style={styles.profileAvatar}>
                    <Text style={styles.profileAvatarText}> {user?.username.charAt(0) || ''}</Text>
                </View>
                <View style={styles.profileOnlineDot} />
            </View>
            <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.first_name}</Text>
                <View style={styles.profileRoleBadge}>
                    <Text style={styles.profileRole}>{user?.is_staff ? 'Administrador' : 'Empleado'}</Text>
                </View>
                <Text style={styles.profileStore}>{tienda?.nombre} · {tienda?.direccion}</Text>
            </View>
            <View style={styles.profileArrow}>
                <Icon name="chevron-right" size={18} color={T.textSecondary} />
            </View>
        </TouchableOpacity>
    );
}

// ─── StatsRow ─────────────────────────────────────────────────────────────────
function StatsRow() {
    const stats = [
        { num: '1,284', label: 'Ventas', icon: 'cart-outline', color: T.accent },
        { num: '342', label: 'Productos', icon: 'cube-outline', color: T.blue },
        { num: '98', label: 'Clientes', icon: 'account-group-outline', color: T.purple },
    ];
    return (
        <View style={styles.statsRow}>
            {stats.map((s, i) => (
                <View key={s.label} style={[styles.statBox, i < stats.length - 1 && { marginRight: 8 }]}>
                    <View style={[styles.statIcon, { backgroundColor: s.color + '18' }]}>
                        <Icon name={s.icon as any} size={16} color={s.color} />
                    </View>
                    <Text style={styles.statNum}>{s.num}</Text>
                    <Text style={styles.statLbl}>{s.label}</Text>
                </View>
            ))}
        </View>
    );
}

// ─── SettingRow ───────────────────────────────────────────────────────────────
function SettingRow({ icon, iconBg, iconColor, title, subtitle, onPress, right }: RowItem) {
    return (
        <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
                <Icon name={icon as any} size={17} color={iconColor} />
            </View>
            <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>{title}</Text>
                <Text style={styles.rowSub}>{subtitle}</Text>
            </View>
            <View style={styles.rowRight}>
                {right ?? (
                    <View style={styles.rowChevron}>
                        <Icon name="chevron-right" size={15} color={T.textMuted} />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

function Group({ items }: { items: RowItem[] }) {
    return (
        <View style={styles.group}>
            {items.map((item, i) => (
                <View key={item.title}>
                    <SettingRow {...item} />
                    {i < items.length - 1 && <View style={styles.groupDivider} />}
                </View>
            ))}
        </View>
    );
}

function SectionLabel({ label }: { label: string }) {
    return <Text style={styles.sectionLabel}>{label}</Text>;
}

function Badge({ text, color = 'default' }: { text: string; color?: 'default' | 'green' | 'accent' }) {
    const bgMap = { default: T.surfaceAlt, green: T.green + '18', accent: T.accentDim };
    const fgMap = { default: T.textSecondary, green: T.green, accent: T.accent };
    return (
        <View style={[styles.badge, { backgroundColor: bgMap[color], borderColor: fgMap[color] + '30' }]}>
            <Text style={[styles.badgeText, { color: fgMap[color] }]}>{text}</Text>
        </View>
    );
}

// ─── SettingsScreen ───────────────────────────────────────────────────────────
export default function SettingsScreen() {
    const router = useRouter();
    const { logout } = useAuthStore();

    const handleLogOut = async () => {
        await logout();           // 1. primero mata sesión
        queryClient.clear();
        queryClient.removeQueries(); // 2. luego limpia cache
        router.replace('/login'); // 3. navega
    };
    const negocioItems: RowItem[] = [
        {
            icon: 'store-outline',
            iconBg: T.purple + '18',
            iconColor: T.purple,
            title: 'Mi tienda',
            subtitle: 'Tienda Centro · RUC 20512345678',
            onPress: () => router.push('/settings/tienda'),
        },
        {
            icon: 'receipt-outline',
            iconBg: T.accentDim,
            iconColor: T.accent,
            title: 'Comprobantes',
            subtitle: 'Series, IGV y configuración SUNAT',
            onPress: () => router.push('/settings/comprobantes'),
        },
        {
            icon: 'account-group-outline',
            iconBg: T.blue + '18',
            iconColor: T.blue,
            title: 'Usuarios y roles',
            subtitle: 'Gestiona accesos del equipo',
            onPress: () => router.push('/settings/usuarios'),
            right: (
                <View style={styles.rowRight}>
                    <Badge text="3" />
                    <View style={styles.rowChevron}>
                        <Icon name="chevron-right" size={15} color={T.textMuted} />
                    </View>
                </View>
            ),
        },
    ];

    const inventarioItems: RowItem[] = [
        {
            icon: 'tag-outline',
            iconBg: '#f9a8d4' + '18',
            iconColor: '#f9a8d4',
            title: 'Categorías',
            subtitle: 'Organiza tus productos',
            onPress: () => router.push('/settings/categorias'),
        },
        {
            icon: 'chart-bar',
            iconBg: T.green + '18',
            iconColor: T.green,
            title: 'Alertas de stock',
            subtitle: 'Mínimo para notificarte',
            onPress: () => router.push('/settings/stock-alertas'),
            right: (
                <View style={styles.rowRight}>
                    <Badge text="Activo" color="green" />
                    <View style={styles.rowChevron}>
                        <Icon name="chevron-right" size={15} color={T.textMuted} />
                    </View>
                </View>
            ),
        },
        {
            icon: 'download-outline',
            iconBg: T.yellow + '18',
            iconColor: T.yellow,
            title: 'Exportar datos',
            subtitle: 'Excel, PDF o CSV',
            onPress: () => router.push('/settings/exportar'),
        },
    ];

    const preferenciaItems: RowItem[] = [
        {
            icon: 'weather-night',
            iconBg: T.surfaceAlt,
            iconColor: T.textSecondary,
            title: 'Modo oscuro',
            subtitle: 'Tema de la aplicación',
            right: (
                <Switch
                    value={true}
                    onValueChange={() => { }}
                    trackColor={{ false: T.border, true: T.accent }}
                    thumbColor={T.bg}
                    ios_backgroundColor={T.border}
                />
            ),
        },
        {
            icon: 'bell-outline',
            iconBg: T.surfaceAlt,
            iconColor: T.textSecondary,
            title: 'Notificaciones',
            subtitle: 'Alertas y recordatorios',
            right: (
                <Switch
                    value={true}
                    onValueChange={() => { }}
                    trackColor={{ false: T.border, true: T.accent }}
                    thumbColor={T.bg}
                    ios_backgroundColor={T.border}
                />
            ),
        },
        {
            icon: 'lock-outline',
            iconBg: T.surfaceAlt,
            iconColor: T.textSecondary,
            title: 'Seguridad',
            subtitle: 'PIN y biometría',
            onPress: () => router.push('/settings/seguridad'),
        },
    ];

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Ajustes</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <ProfileCard />


                <SectionLabel label="Negocio" />
                <Group items={negocioItems} />

                <SectionLabel label="Inventario" />
                <Group items={inventarioItems} />

                <SectionLabel label="Preferencias" />
                <Group items={preferenciaItems} />

                <SectionLabel label="Cuenta" />
                <TouchableOpacity style={styles.dangerGroup} activeOpacity={0.8} onPress={handleLogOut}>
                    <View style={styles.dangerIcon}>
                        <Icon name="logout" size={17} color={T.red} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12, }}>
                        <Text style={styles.dangerText}>Cerrar sesión</Text>

                    </View>
                    <View style={[styles.rowChevron, { borderColor: T.red + '20' }]}>
                        <Icon name="chevron-right" size={15} color={T.red + '80'} />
                    </View>
                </TouchableOpacity>


            </ScrollView>
        </View>
    );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: T.bg },

    header: {
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20,
        backgroundColor: T.bg, borderBottomWidth: 1, borderBottomColor: T.border,
    },
    headerTitle: { fontSize: 30, fontWeight: '900', color: T.textPrimary, letterSpacing: -1 },

    scrollContent: { paddingBottom: 100 },

    // profile
    profileCard: {
        margin: 20, marginBottom: 0,
        backgroundColor: T.surface,
        borderRadius: T.radiusXl,
        padding: 18,
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: T.border,
    },
    profileAvatarWrap: { position: 'relative' },
    profileAvatar: {
        width: 56, height: 56, borderRadius: 18,
        backgroundColor: T.accentDim,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: T.accent + '40',
    },
    profileAvatarText: { fontSize: 20, fontWeight: '900', color: T.accent },
    profileOnlineDot: {
        position: 'absolute', bottom: 2, right: 2,
        width: 10, height: 10, borderRadius: 5,
        backgroundColor: T.green, borderWidth: 2, borderColor: T.surface,
    },
    profileInfo: { flex: 1, marginLeft: 14 },
    profileName: { fontSize: 16, fontWeight: '800', color: T.textPrimary, letterSpacing: -0.3 },
    profileRoleBadge: {
        alignSelf: 'flex-start',
        backgroundColor: T.accentDim, borderRadius: 20,
        paddingHorizontal: 8, paddingVertical: 2, marginTop: 4,
        borderWidth: 1, borderColor: T.accent + '30',
    },
    profileRole: { fontSize: 11, color: T.accent, fontWeight: '700' },
    profileStore: { fontSize: 12, color: T.textMuted, marginTop: 4 },
    profileArrow: {
        width: 32, height: 32, borderRadius: 10,
        backgroundColor: T.surfaceAlt,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: T.border,
    },

    // stats
    statsRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14 },
    statBox: {
        flex: 1, backgroundColor: T.surface, borderRadius: T.radiusMd,
        padding: 14, alignItems: 'center',
        borderWidth: 1, borderColor: T.border, gap: 4,
    },
    statIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    statNum: { fontSize: 18, fontWeight: '900', color: T.textPrimary, letterSpacing: -0.5 },
    statLbl: { fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '700' },

    // section
    sectionLabel: {
        fontSize: 10, color: T.textMuted, textTransform: 'uppercase',
        letterSpacing: 1.5, fontWeight: '700',
        marginTop: 20, marginBottom: 10,
        paddingHorizontal: 20,
    },

    // group
    group: {
        marginHorizontal: 20,
        backgroundColor: T.surface,
        borderRadius: T.radiusLg,
        borderWidth: 1, borderColor: T.border,
        overflow: 'hidden',
    },
    groupDivider: { height: 1, backgroundColor: T.border, marginLeft: 62 },

    // row
    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14 },
    rowIcon: {
        width: 36, height: 36, borderRadius: 11,
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        borderWidth: 1, borderColor: T.border,
    },
    rowContent: { flex: 1, marginLeft: 12 },
    rowTitle: { fontSize: 14, fontWeight: '700', color: T.textPrimary },
    rowSub: { fontSize: 12, color: T.textMuted, marginTop: 1 },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    rowChevron: {
        width: 26, height: 26, borderRadius: 8,
        backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: T.border,
    },

    // badge
    badge: {
        borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3,
        borderWidth: 1,
    },
    badgeText: { fontSize: 11, fontWeight: '700' },

    // danger
    dangerGroup: {
        marginBottom: 12,
        marginHorizontal: 20,
        backgroundColor: T.red + '0a',
        borderRadius: T.radiusLg,
        borderWidth: 1, borderColor: T.red + '25',
        flexDirection: 'row', alignItems: 'center',
        padding: 14,
    },
    dangerIcon: {
        width: 36, height: 36, borderRadius: 11,
        backgroundColor: T.red + '18',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: T.red + '30',
    },
    dangerText: { fontSize: 14, fontWeight: '700', color: T.red },
    dangerSub: { fontSize: 12, color: T.red + '70', marginTop: 1 },

    version: {
        textAlign: 'center', fontSize: 11,
        color: T.textMuted, letterSpacing: 0.5, fontWeight: '500',
        marginTop: 28, marginBottom: 12,
    },
});