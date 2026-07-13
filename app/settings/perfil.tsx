import { useAppTheme } from '@/State/context/ThemeContext';
import { useAuthStore } from '@/State/store/useAuthStore';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { Text } from 'react-native-paper';

export default function ProfileScreen() {
    const { user, loadSession } = useAuthStore();
    const { T } = useAppTheme();
    const router = useRouter();

    useEffect(() => {
        loadSession();
    }, []);

    function SectionLabel({ label }: { label: string }) {
        return <Text style={styles.sectionLabel}>{label}</Text>;
    }

    function Badge({ text, color = 'default' }: { text: string; color?: 'default' | 'green' | 'accent' | 'red' }) {
        const bgMap = {
            default: T.surfaceAlt,
            green: T.green + '18',
            accent: T.accentDim,
            red: T.red + '18',
        };

        const fgMap = {
            default: T.textSecondary,
            green: T.green,
            accent: T.accent,
            red: T.red,
        };

        return (
            <View style={[styles.badge, { backgroundColor: bgMap[color], borderColor: fgMap[color] + '30' }]}>
                <Text style={[styles.badgeText, { color: fgMap[color] }]}>{text}</Text>
            </View>
        );
    }

    function Row({ icon, title, value }: { icon: string; title: string; value?: string | null }) {
        if (!value) return null;

        return (
            <View style={styles.row}>
                <View style={styles.rowLeft}>
                    <Icon name={icon as any} size={16} color={T.textSecondary} />
                    <Text style={styles.rowTitle}>{title}</Text>
                </View>
                <Text style={styles.rowValue}>{value}</Text>
            </View>
        );
    }

    if (!user) return null;

    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

    const styles = makeStyles(T);

    return (
        <View style={styles.screen}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Perfil</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* CARD */}
                <View style={styles.card}>
                    <View style={styles.avatarWrap}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user.username?.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View style={[
                            styles.statusDot,
                            { backgroundColor: user.is_active ? T.green : T.red }
                        ]} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.name}>
                            {fullName || user.username}
                        </Text>

                        <Text style={styles.username}>
                            @{user.username}
                        </Text>

                        <View style={styles.badgesRow}>
                            {user.is_superuser && <Badge text="Superuser" color="accent" />}
                            {user.is_staff && <Badge text="Admin" color="accent" />}
                            {user.es_empleado && <Badge text="Empleado" />}
                            {!user.is_active && <Badge text="Inactivo" color="red" />}
                        </View>
                    </View>
                </View>

                {/* INFO */}
                <SectionLabel label="Información" />
                <View style={styles.group}>
                    <Row icon="identifier" title="ID" value={String(user.id)} />
                    <Row icon="account-outline" title="Usuario" value={user.username} />
                </View>

                {/* FECHAS */}
                <SectionLabel label="Actividad" />
                <View style={styles.group}>
                    <Row
                        icon="calendar-plus"
                        title="Creado"
                        value={
                            user.date_created
                                ? new Date(user.date_created).toLocaleDateString('es-PE', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                })
                                : ''
                        }
                    />
                    <Row
                        icon="login"
                        title="Último acceso"
                        value={
                            user.last_login
                                ? new Date(user.last_login).toLocaleString('es-PE', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                                : 'Nunca'
                        }
                    />
                </View>

                {/* ACCIONES */}



            </ScrollView>
        </View>
    );
}

function makeStyles(T: any) {
    return StyleSheet.create({
        screen: { flex: 1, backgroundColor: T.bg },

        header: {
            paddingHorizontal: 20,
            paddingTop: 56,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: T.border,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: '900',
            color: T.textPrimary,
        },

        // card
        card: {
            margin: 20,
            backgroundColor: T.surface,
            borderRadius: T.radiusXl,
            padding: 18,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: T.border,
        },

        avatarWrap: { position: 'relative', marginRight: 14 },
        avatar: {
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: T.accentDim,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: T.accent + '40',
        },
        avatarText: {
            fontSize: 20,
            fontWeight: '900',
            color: T.accent,
        },
        statusDot: {
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: 10,
            height: 10,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: T.surface,
        },

        name: {
            fontSize: 16,
            fontWeight: '800',
            color: T.textPrimary,
        },
        username: {
            fontSize: 12,
            color: T.textMuted,
            marginTop: 2,
        },

        badgesRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
            marginTop: 6,
        },

        // section
        sectionLabel: {
            fontSize: 10,
            color: T.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            fontWeight: '700',
            marginTop: 20,
            marginBottom: 10,
            paddingHorizontal: 20,
        },

        // group
        group: {
            marginHorizontal: 20,
            backgroundColor: T.surface,
            borderRadius: T.radiusLg,
            borderWidth: 1,
            borderColor: T.border,
            overflow: 'hidden',
        },

        // row
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 14,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: T.border,
        },
        rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
        rowTitle: { fontSize: 13, color: T.textSecondary },
        rowValue: {
            fontSize: 13,
            color: T.textPrimary,
            fontWeight: '600',
        },

        // badge
        badge: {
            borderRadius: 20,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderWidth: 1,
        },
        badgeText: { fontSize: 11, fontWeight: '700' },

        // action
        actionBtn: {
            margin: 20,
            backgroundColor: T.surface,
            borderRadius: T.radiusLg,
            borderWidth: 1,
            borderColor: T.border,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 14,
        },
        actionIcon: {
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: T.accentDim,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        actionText: {
            flex: 1,
            fontSize: 14,
            fontWeight: '700',
            color: T.textPrimary,
        },
        chevron: {
            width: 26,
            height: 26,
            borderRadius: 8,
            backgroundColor: T.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: T.border,
        },
    });
}
