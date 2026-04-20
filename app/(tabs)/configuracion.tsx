import { useAuthStore } from '@/State/store/useAuthStore';
import { C } from '@/State/utils/c';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import { Text } from 'react-native-paper';



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
    const router = useRouter();
    return (
        <TouchableOpacity
            style={styles.profileCard}
            onPress={() => router.push('/settings/perfil')}
            activeOpacity={0.85}
        >
            <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>JR</Text>
            </View>
            <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Juan Rodríguez</Text>
                <Text style={styles.profileRole}>Administrador</Text>
                <Text style={styles.profileStore}>Tienda Centro · Lima</Text>
            </View>
            <View style={styles.profileArrow}>
                <Icon name="chevron-right" size={18} color={C.textSecondary} />
            </View>
        </TouchableOpacity>
    );
}

// ─── StatsRow ─────────────────────────────────────────────────────────────────
function StatsRow() {
    const stats = [
        { num: '1,284', label: 'Ventas' },
        { num: '342', label: 'Productos' },
        { num: '98', label: 'Clientes' },
    ];
    return (
        <View style={styles.statsRow}>
            {stats.map((s, i) => (
                <View key={s.label} style={[styles.statBox, i < stats.length - 1 && { marginRight: 10 }]}>
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
                {right ?? <Icon name="chevron-right" size={18} color={C.textMuted} />}
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
    const bgMap = { default: C.surfaceAlt, green: C.green + '18', accent: C.accentDim };
    const fgMap = { default: C.textSecondary, green: C.green, accent: C.accent };
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
        await logout();
        router.replace('/login');
    };

    const negocioItems: RowItem[] = [
        {
            icon: 'store-outline',
            iconBg: '#3b30c415',
            iconColor: '#a78bfa',
            title: 'Mi tienda',
            subtitle: 'Tienda Centro · RUC 20512345678',
            onPress: () => router.push('/settings/tienda'),
        },
        {
            icon: 'receipt-outline',
            iconBg: '#c8f13515',
            iconColor: C.accent,
            title: 'Comprobantes',
            subtitle: 'Series, IGV y configuración SUNAT',
            onPress: () => router.push('/settings/comprobantes'),
        },
        {
            icon: 'account-group-outline',
            iconBg: '#93c5fd15',
            iconColor: '#93c5fd',
            title: 'Usuarios y roles',
            subtitle: 'Gestiona accesos del equipo',
            onPress: () => router.push('/settings/usuarios'),
            right: (
                <View style={styles.rowRight}>
                    <Badge text="3" />
                    <Icon name="chevron-right" size={18} color={C.textMuted} />
                </View>
            ),
        },
    ];

    const inventarioItems: RowItem[] = [
        {
            icon: 'tag-outline',
            iconBg: '#f9a8d415',
            iconColor: '#f9a8d4',
            title: 'Categorías',
            subtitle: 'Organiza tus productos',
            onPress: () => router.push('/settings/categorias'),
        },
        {
            icon: 'chart-bar',
            iconBg: '#22c55e15',
            iconColor: C.green,
            title: 'Alertas de stock',
            subtitle: 'Mínimo para notificarte',
            onPress: () => router.push('/settings/stock-alertas'),
            right: (
                <View style={styles.rowRight}>
                    <Badge text="Activo" color="green" />
                    <Icon name="chevron-right" size={18} color={C.textMuted} />
                </View>
            ),
        },
        {
            icon: 'download-outline',
            iconBg: '#fcd34d15',
            iconColor: '#fcd34d',
            title: 'Exportar datos',
            subtitle: 'Excel, PDF o CSV',
            onPress: () => router.push('/settings/exportar'),
        },
    ];

    const preferenciaItems: RowItem[] = [
        {
            icon: 'weather-night',
            iconBg: C.surfaceAlt,
            iconColor: C.textSecondary,
            title: 'Modo oscuro',
            subtitle: 'Tema de la aplicación',
            right: (
                <Switch
                    value={true}
                    onValueChange={() => { }}
                    trackColor={{ false: C.border, true: C.accent }}
                    thumbColor={C.bg}
                    ios_backgroundColor={C.border}
                />
            ),
        },
        {
            icon: 'bell-outline',
            iconBg: C.surfaceAlt,
            iconColor: C.textSecondary,
            title: 'Notificaciones',
            subtitle: 'Alertas y recordatorios',
            right: (
                <Switch
                    value={true}
                    onValueChange={() => { }}
                    trackColor={{ false: C.border, true: C.accent }}
                    thumbColor={C.bg}
                    ios_backgroundColor={C.border}
                />
            ),
        },
        {
            icon: 'lock-outline',
            iconBg: C.surfaceAlt,
            iconColor: C.textSecondary,
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
                <StatsRow />

                <SectionLabel label="Negocio" />
                <Group items={negocioItems} />

                <SectionLabel label="Inventario" />
                <Group items={inventarioItems} />

                <SectionLabel label="Preferencias" />
                <Group items={preferenciaItems} />

                <SectionLabel label="Cuenta" />
                <TouchableOpacity style={styles.dangerGroup} activeOpacity={0.8} onPress={handleLogOut}>
                    <View style={styles.dangerIcon}>
                        <Icon name="logout" size={17} color={C.red} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.dangerText}>Cerrar sesión</Text>
                        <Text style={styles.dangerSub}>Juan Rodríguez · Administrador</Text>
                    </View>
                    <Icon name="chevron-right" size={18} color={C.red + '60'} />
                </TouchableOpacity>

                <Text style={styles.version}>v2.4.1 · Inventario App</Text>
            </ScrollView>
        </View>
    );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.bg },

    header: {
        paddingHorizontal: 24, paddingTop: 56, paddingBottom: 20,
        backgroundColor: C.bg,
        borderBottomWidth: 1, borderBottomColor: C.border,
    },
    headerTitle: { fontSize: 28, fontWeight: '700', color: C.textPrimary, letterSpacing: -0.8 },

    scrollContent: { paddingBottom: 100 },

    // profile
    profileCard: {
        margin: 20,
        marginBottom: 0,
        backgroundColor: C.surface,
        borderRadius: 20,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: C.border,
    },
    profileAvatar: {
        width: 52, height: 52, borderRadius: 16,
        backgroundColor: C.accent + '18',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: C.accent + '35',
    },
    profileAvatarText: { fontSize: 20, fontWeight: '800', color: C.accent },
    profileInfo: { flex: 1, marginLeft: 14 },
    profileName: { fontSize: 16, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.3 },
    profileRole: { fontSize: 12, color: C.accent, marginTop: 3, fontWeight: '600' },
    profileStore: { fontSize: 12, color: C.textMuted, marginTop: 2 },
    profileArrow: {
        width: 30, height: 30, borderRadius: 10,
        backgroundColor: C.surfaceAlt,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: C.border,
    },

    // stats
    statsRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14 },
    statBox: {
        flex: 1, backgroundColor: C.surface, borderRadius: 14,
        padding: 14, alignItems: 'center',
        borderWidth: 1, borderColor: C.border,
    },
    statNum: { fontSize: 19, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.5 },
    statLbl: { fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '700', marginTop: 3 },

    // section
    sectionLabel: {
        fontSize: 10, color: C.textMuted, textTransform: 'uppercase',
        letterSpacing: 1, fontWeight: '700',
        marginTop: 10, marginBottom: 10,
        paddingHorizontal: 20,
    },

    // group
    group: {
        marginHorizontal: 20,
        backgroundColor: C.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: C.border,
        overflow: 'hidden',
    },
    groupDivider: { height: 1, backgroundColor: C.border, marginLeft: 60 },

    // row
    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13 },
    rowIcon: {
        width: 34, height: 34, borderRadius: 10,
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        borderWidth: 1, borderColor: C.border,
    },
    rowContent: { flex: 1, marginLeft: 12 },
    rowTitle: { fontSize: 14, fontWeight: '700', color: C.textPrimary },
    rowSub: { fontSize: 12, color: C.textMuted, marginTop: 1 },
    rowRight: { flexDirection: 'row', alignItems: 'center' },

    // badge
    badge: {
        borderRadius: 100, paddingHorizontal: 9, paddingVertical: 3,
        marginRight: 8, borderWidth: 1,
    },
    badgeText: { fontSize: 11, fontWeight: '700' },

    // danger
    dangerGroup: {
        marginHorizontal: 20,
        backgroundColor: C.red + '08',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: C.red + '25',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    dangerIcon: {
        width: 34, height: 34, borderRadius: 10,
        backgroundColor: C.red + '15',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: C.red + '25',
    },
    dangerText: { fontSize: 14, fontWeight: '700', color: C.red },
    dangerSub: { fontSize: 12, color: C.red + '70', marginTop: 1 },

    version: {
        textAlign: 'center', fontSize: 12,
        color: C.textMuted, letterSpacing: 0.3,
        marginTop: 28, marginBottom: 12,
    },
});