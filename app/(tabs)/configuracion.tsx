import { useAuthStore } from '@/State/store/useAuthStore';
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

// ─── sub-componentes ──────────────────────────────────────────────────────────

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
                <Icon name="chevron-right" size={18} color="#6b7280" />
            </View>
        </TouchableOpacity>
    );
}

function StatsRow() {
    const stats = [
        { num: '1,284', label: 'Ventas' },
        { num: '342', label: 'Productos' },
        { num: '98', label: 'Clientes' },
    ];
    return (
        <View style={styles.statsRow}>
            {stats.map((s) => (
                <View key={s.label} style={styles.statBox}>
                    <Text style={styles.statNum}>{s.num}</Text>
                    <Text style={styles.statLbl}>{s.label}</Text>
                </View>
            ))}
        </View>
    );
}

function SettingRow({ icon, iconBg, iconColor, title, subtitle, onPress, right }: RowItem) {
    return (
        <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
                <Icon name={icon as any} size={18} color={iconColor} />
            </View>
            <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>{title}</Text>
                <Text style={styles.rowSub}>{subtitle}</Text>
            </View>
            <View style={styles.rowRight}>
                {right ?? <Icon name="chevron-right" size={18} color="#d1d5db" />}
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

function Badge({ text, dark = true }: { text: string; dark?: boolean }) {
    return (
        <View style={[styles.badge, !dark && styles.badgeGreen]}>
            <Text style={[styles.badgeText, !dark && styles.badgeTextGreen]}>{text}</Text>
        </View>
    );
}

// ─── SettingsScreen ───────────────────────────────────────────────────────────

export default function SettingsScreen() {
    const router = useRouter();
    const { logout } = useAuthStore();
    const hadleLogOut = () => {
        // Aquí iría la lógica de cierre de sesión, como limpiar tokens, etc.
        logout()
        router.replace('/login');
    }
    const negocioItems: RowItem[] = [
        {
            icon: 'store-outline',
            iconBg: '#f0f0ff',
            iconColor: '#3b30c4',
            title: 'Mi tienda',
            subtitle: 'Tienda Centro · RUC 20512345678',
            onPress: () => router.push('/settings/tienda'),
        },
        {
            icon: 'receipt-outline',
            iconBg: '#f0fff5',
            iconColor: '#065f46',
            title: 'Comprobantes',
            subtitle: 'Series, IGV y configuración SUNAT',
            onPress: () => router.push('/settings/comprobantes'),
        },

        {
            icon: 'account-group-outline',
            iconBg: '#fdf4ff',
            iconColor: '#7e22ce',
            title: 'Usuarios y roles',
            subtitle: 'Gestiona accesos del equipo',
            onPress: () => router.push('/settings/usuarios'),
            right: (
                <View style={styles.rowRight}>
                    <Badge text="3" />
                    <Icon name="chevron-right" size={18} color="#d1d5db" />
                </View>
            ),
        },
    ];

    const inventarioItems: RowItem[] = [
        {
            icon: 'tag-outline',
            iconBg: '#f0f9ff',
            iconColor: '#0369a1',
            title: 'Categorías',
            subtitle: 'Organiza tus productos',
            onPress: () => router.push('/settings/categorias'),
        },
        {
            icon: 'chart-bar',
            iconBg: '#f0fff5',
            iconColor: '#065f46',
            title: 'Alertas de stock',
            subtitle: 'Mínimo para notificarte',
            onPress: () => router.push('/settings/stock-alertas'),
            right: (
                <View style={styles.rowRight}>
                    <Badge text="Activo" dark={false} />
                    <Icon name="chevron-right" size={18} color="#d1d5db" />
                </View>
            ),
        },
        {
            icon: 'download-outline',
            iconBg: '#fffbeb',
            iconColor: '#d97706',
            title: 'Exportar datos',
            subtitle: 'Excel, PDF o CSV',
            onPress: () => router.push('/settings/exportar'),
        },
    ];

    const preferenciaItems: RowItem[] = [
        {
            icon: 'weather-night',
            iconBg: '#f5f5f5',
            iconColor: '#6b7280',
            title: 'Modo oscuro',
            subtitle: 'Tema de la aplicación',
            right: (
                <Switch
                    value={false}
                    onValueChange={() => { }}
                    trackColor={{ false: '#e5e7eb', true: '#0a0a0a' }}
                    thumbColor="#fff"
                />
            ),
        },
        {
            icon: 'bell-outline',
            iconBg: '#f5f5f5',
            iconColor: '#6b7280',
            title: 'Notificaciones',
            subtitle: 'Alertas y recordatorios',
            right: (
                <Switch
                    value={true}
                    onValueChange={() => { }}
                    trackColor={{ false: '#e5e7eb', true: '#0a0a0a' }}
                    thumbColor="#fff"
                />
            ),
        },
        {
            icon: 'lock-outline',
            iconBg: '#f5f5f5',
            iconColor: '#6b7280',
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
                <TouchableOpacity style={styles.dangerGroup} activeOpacity={0.8} onPress={hadleLogOut}>
                    <View style={styles.dangerIcon}>
                        <Icon name="logout" size={18} color="#ef4444" />
                    </View>
                    <Text style={styles.dangerText}>Cerrar sesión</Text>
                </TouchableOpacity>

                <Text style={styles.version}>v2.4.1 · Inventario App</Text>
            </ScrollView>
        </View>
    );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#fff' },

    header: {
        paddingHorizontal: 24, paddingTop: 56, paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5, borderBottomColor: '#ebebeb',
    },
    headerTitle: { fontSize: 28, fontWeight: '700', color: '#0a0a0a', letterSpacing: -0.8 },

    scrollContent: { paddingBottom: 100 },

    // profile
    profileCard: {
        margin: 20,
        marginBottom: 0,
        backgroundColor: '#0a0a0a',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileAvatar: {
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: '#2a2a2a',
        alignItems: 'center', justifyContent: 'center',
    },
    profileAvatarText: { fontSize: 22, fontWeight: '800', color: '#fff' },
    profileInfo: { flex: 1, marginLeft: 14 },
    profileName: { fontSize: 17, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
    profileRole: { fontSize: 12, color: '#9ca3af', marginTop: 3 },
    profileStore: { fontSize: 12, color: '#6b7280', marginTop: 2 },
    profileArrow: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: '#1f1f1f',
        alignItems: 'center', justifyContent: 'center',
    },

    // stats
    statsRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16 },
    statBox: {
        flex: 1, backgroundColor: '#f5f5f5', borderRadius: 14,
        padding: 14, alignItems: 'center',
        borderWidth: 0.5, borderColor: '#ebebeb',
        marginRight: 10,
    },
    statNum: { fontSize: 20, fontWeight: '800', color: '#0a0a0a', letterSpacing: -0.5 },
    statLbl: { fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '700', marginTop: 3 },

    // section
    sectionLabel: {
        fontSize: 10, color: '#9ca3af', textTransform: 'uppercase',
        letterSpacing: 1, fontWeight: '700',
        marginTop: 8, marginBottom: 10,
        paddingHorizontal: 20,
    },

    // group
    group: {
        marginHorizontal: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: '#ebebeb',
        overflow: 'hidden',
    },
    groupDivider: { height: 0.5, backgroundColor: '#ebebeb', marginLeft: 62 },

    // row
    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
    rowIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    rowContent: { flex: 1, marginLeft: 12 },
    rowTitle: { fontSize: 14, fontWeight: '700', color: '#0a0a0a' },
    rowSub: { fontSize: 12, color: '#9ca3af', marginTop: 1 },
    rowRight: { flexDirection: 'row', alignItems: 'center' },

    // badge
    badge: { backgroundColor: '#0a0a0a', borderRadius: 100, paddingHorizontal: 9, paddingVertical: 3, marginRight: 8 },
    badgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
    badgeGreen: { backgroundColor: '#f0fdf4' },
    badgeTextGreen: { color: '#16a34a' },

    // danger
    dangerGroup: {
        marginHorizontal: 20,
        backgroundColor: '#fff9f9',
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: '#fecaca',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    dangerIcon: {
        width: 34, height: 34, borderRadius: 10,
        backgroundColor: '#fef2f2',
        alignItems: 'center', justifyContent: 'center',
    },
    dangerText: { fontSize: 14, fontWeight: '700', color: '#ef4444', marginLeft: 12 },

    version: {
        textAlign: 'center', fontSize: 12,
        color: '#d1d5db', letterSpacing: 0.3,
        marginTop: 28, marginBottom: 12,
    },
});