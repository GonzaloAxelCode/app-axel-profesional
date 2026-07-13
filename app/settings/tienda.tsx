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

const MyStoreScreen = () => {
    const { tienda, loadSession } = useAuthStore();
    const { T } = useAppTheme();
    const router = useRouter();

    useEffect(() => {
        loadSession();
    }, []);

    function SectionLabel({ label }: { label: string }) {
        return <Text style={styles.sectionLabel}>{label}</Text>;
    }

    function Badge({ text, color = 'default' }: { text: string; color?: 'default' | 'green' | 'red' }) {
        const bgMap = { default: T.surfaceAlt, green: T.green + '18', red: T.red + '18' };
        const fgMap = { default: T.textSecondary, green: T.green, red: T.red };

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

    if (!tienda) return null;

    const styles = makeStyles(T);

    return (
        <View style={styles.screen}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mi Tienda</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* CARD PRINCIPAL */}
                <View style={styles.card}>
                    <View style={styles.logoWrap}>
                        <View style={styles.logo}>
                            <Text style={styles.logoText}>
                                {tienda.nombre?.charAt(0)}
                            </Text>
                        </View>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.storeName}>{tienda.nombre}</Text>

                        {tienda.razon_social && (
                            <Text style={styles.storeSub}>{tienda.razon_social}</Text>
                        )}

                        <View style={{ flexDirection: 'row', marginTop: 6 }}>
                            <Badge
                                text={tienda.activo ? 'Activo' : 'Inactivo'}
                                color={tienda.activo ? 'green' : 'red'}
                            />
                        </View>
                    </View>
                </View>

                {/* INFO LEGAL */}
                <SectionLabel label="Información legal" />
                <View style={styles.group}>
                    <Row icon="identifier" title="RUC" value={tienda.ruc} />
                    <Row
                        icon="calendar"
                        title="Creado"
                        value={
                            tienda.date_created
                                ? new Date(tienda.date_created).toLocaleDateString('es-PE', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                })
                                : ''
                        }
                    />
                </View>

                {/* CONTACTO */}
                <SectionLabel label="Contacto" />
                <View style={styles.group}>
                    <Row icon="map-marker-outline" title="Dirección" value={tienda.direccion} />
                    <Row icon="phone-outline" title="Teléfono" value={tienda.telefono} />
                    <Row icon="email-outline" title="Email" value={tienda.email} />
                </View>

                {/* ACCIONES */}

            </ScrollView>
        </View>
    );
};

export default MyStoreScreen;

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
        logoWrap: { marginRight: 14 },
        logo: {
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: T.accentDim,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: T.accent + '40',
        },
        logoText: {
            fontSize: 20,
            fontWeight: '900',
            color: T.accent,
        },

        storeName: {
            fontSize: 16,
            fontWeight: '800',
            color: T.textPrimary,
        },
        storeSub: {
            fontSize: 12,
            color: T.textMuted,
            marginTop: 2,
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
            maxWidth: '55%',
            textAlign: 'right',
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
