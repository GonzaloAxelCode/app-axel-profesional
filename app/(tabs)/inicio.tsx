
import SectionHeader from '@/components/InicioComponents/SectionHeader';
import ServiceChip from '@/components/InicioComponents/ServiceChip';
import StatPill from '@/components/InicioComponents/StarPill';
import TopProductsHoy from '@/components/InicioComponents/TopProductsHoy';
import { fmt } from '@/components/InicioComponents/utils';
import VentaRow from '@/components/InicioComponents/VentaRow';
import { VentasChart } from '@/components/venta/VentasChart';
import { VentasChart2 } from '@/components/venta/VentasChart copy';
import T from '@/constants/THEME';
import { useVentas } from '@/State/hooks/useVentas';
import { useAuthStore } from '@/State/store/useAuthStore';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTabRouter } from './_layout';

export default function InicioScreen() {
    const router = useRouter();
    const { resumenVentas, ventasHoy, } = useVentas();



    const navigateToTab = useTabRouter();

    const todaySales = resumenVentas?.todaySales ?? 0;
    const weekSales = resumenVentas?.thisWeekSales ?? 0;
    const monthSales = resumenVentas?.thisMonthSales ?? 0;


    const today = new Date().toLocaleDateString('es-PE', {
        weekday: 'long', day: 'numeric', month: 'long',
    });
    const ventasDeHoy = ventasHoy?.slice(0, 8) ?? [];
    const { user, tienda } = useAuthStore()
    return (
        <ScrollView
            style={styles.root}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >

            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.locationRow}>
                        <Icon name="map-marker-outline" size={12} color={T.textSecondary} />
                        <Text style={styles.locationText}>Puente Pieda, Lima, Perú</Text>
                    </View>
                    <View style={styles.greetingRow}>
                        <Text style={styles.greeting}>Hola, </Text>
                        <Text style={styles.greetingBold}>Bienvenido 👋</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>

                    <TouchableOpacity
                        style={styles.avatarBtn}
                        onPress={() => navigateToTab('configuracion')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.avatarBtnText}>MT</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Store name ── */}
            <View style={styles.storeNameWrap}>
                <Text style={styles.storeName}> {tienda?.nombre}</Text>

                <Text style={styles.storeSubtitle}>{tienda?.direccion} · {today}</Text>
            </View>

            {/* ── Hero card ── */}
            <View style={styles.heroCard}>
                <View style={styles.heroGlow} />
                <View style={styles.heroTopRow}>
                    <View>
                        <Text style={styles.heroLabel}>Ventas de Hoy</Text>
                        <Text style={styles.heroValue}>{fmt(todaySales)}</Text>
                    </View>
                    <View style={styles.heroLiveBadge}>
                        <View style={styles.heroLiveDot} />
                        <Text style={styles.heroLiveText}>En vivo</Text>
                    </View>
                </View>
                <Text style={styles.heroSub}>Actualizado ahora mismo</Text>
                <View style={styles.heroRule} />
                <View style={styles.heroStats}>
                    <StatPill label="Hoy" value={fmt(todaySales)} />
                    <View style={styles.heroStatDivider} />
                    <StatPill label="Semana" value={fmt(weekSales)} />
                    <View style={styles.heroStatDivider} />
                    <StatPill label="Mes" value={fmt(monthSales)} />
                </View>
            </View>


            <SectionHeader title="Servicios rápidos" />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.servicesScroll}
                style={{ marginBottom: 24 }}
            >


                <ServiceChip icon="cart-plus" label="Nueva Venta" time="Rápido" onPress={() => router.push('/hacerventa')} />
                <ServiceChip icon="package-variant" label="Productos" time="Inventario" onPress={() => navigateToTab('productos')} />
                <ServiceChip icon="account-group" label="Clientes" time="Registros" onPress={() => navigateToTab('clientes')} />
                <ServiceChip icon="chart-line" label="Perfil" time="Perfil" onPress={() => navigateToTab('configuracion')} />
            </ScrollView>

            {/* ── Chart ── */}
            <SectionHeader title="Estadísticas 30 días" />
            <View style={styles.card}>
                <VentasChart />
                <VentasChart2 />

            </View>



            <TopProductsHoy />


            <SectionHeader
                title="Ventas de hoy"
                action="Ver todas"
                onAction={() => navigateToTab('ventas')}
            />

            {ventasDeHoy.length === 0 ? (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconWrap}>
                        <Icon name="receipt-text-outline" size={28} color={T.accent} />
                    </View>
                    <Text style={styles.emptyText}>Sin ventas hoy todavía</Text>
                    <Text style={styles.emptySubText}>Las ventas aparecerán aquí</Text>
                </View>
            ) : (
                <View style={[styles.card, { marginBottom: 110 }]}>
                    {ventasDeHoy.map((v, i) => (
                        <React.Fragment key={v.id}>
                            <VentaRow venta={v} />
                            {i < ventasDeHoy.length - 1 && <View style={styles.rowDivider} />}
                        </React.Fragment>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: T.bg },
    content: { paddingTop: Platform.OS === 'ios' ? 56 : 24, paddingBottom: 24 },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 16, marginBottom: 8,
    },
    headerLeft: { flex: 1 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
    locationText: { fontSize: 11, color: T.textSecondary, fontWeight: '500' },
    greetingRow: { flexDirection: 'row', alignItems: 'baseline' },
    greeting: { fontSize: 22, color: T.textSecondary, fontWeight: '500' },
    greetingBold: { fontSize: 22, color: T.textPrimary, fontWeight: '800', letterSpacing: -0.5 },
    iconBtn: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: T.surface, borderWidth: 1, borderColor: T.border,
        alignItems: 'center', justifyContent: 'center',
    },
    notifDot: {
        position: 'absolute', top: 8, right: 8,
        width: 7, height: 7, borderRadius: 4,
        backgroundColor: T.red, borderWidth: 1.5, borderColor: T.bg,
    },
    avatarBtn: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: T.accentDim, borderWidth: 1, borderColor: T.accent + '40',
        alignItems: 'center', justifyContent: 'center',
    },
    avatarBtnText: { fontSize: 13, fontWeight: '800', color: T.accent },

    // Store name
    storeNameWrap: { paddingHorizontal: 20, marginBottom: 20 },
    storeName: { fontSize: 32, fontWeight: '900', color: T.textPrimary, letterSpacing: -1.5 },
    storeSubtitle: { fontSize: 18, color: T.textMuted, marginTop: 4, textTransform: 'capitalize' },

    // Hero
    heroCard: {
        marginHorizontal: 20, backgroundColor: T.surface,
        borderRadius: 24, padding: 22, marginBottom: 28,
        borderWidth: 1, borderColor: T.border,
        overflow: 'hidden',
    },
    heroGlow: {
        position: 'absolute', top: -40, right: -40,
        width: 160, height: 160, borderRadius: 80,
        backgroundColor: T.accent + '08',
    },
    heroTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    heroLabel: { fontSize: 14, color: T.textSecondary, marginBottom: 8, fontWeight: '500' },
    heroValue: { fontSize: 40, fontWeight: '900', color: T.textPrimary, letterSpacing: -2, lineHeight: 44 },
    heroLiveBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: T.green + '15', borderRadius: 20,
        paddingHorizontal: 10, paddingVertical: 5,
        borderWidth: 1, borderColor: T.green + '30',
    },
    heroLiveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.green },
    heroLiveText: { fontSize: 11, color: T.green, fontWeight: '700' },
    heroSub: { fontSize: 14, color: T.textMuted, marginTop: 6 },
    heroRule: { height: 1, backgroundColor: T.border, marginVertical: 18 },
    heroStats: { flexDirection: 'row' },
    heroStatDivider: { width: 1, backgroundColor: T.border },


    // Services
    servicesScroll: { paddingLeft: 20, paddingRight: 8, gap: 10 },
    serviceChip: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: T.surface, borderRadius: 16,
        borderWidth: 1, borderColor: T.border,
        paddingHorizontal: 14, paddingVertical: 12,
    },
    serviceIconWrap: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: T.accentDim, borderWidth: 1, borderColor: T.accent + '30',
        alignItems: 'center', justifyContent: 'center',
    },
    serviceTime: { fontSize: 9, color: T.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    serviceLabel: { fontSize: 13, fontWeight: '600', color: T.textPrimary, marginTop: 1 },


    // Card
    card: {
        marginHorizontal: 20, backgroundColor: T.surface,
        borderRadius: 20, padding: 16, marginBottom: 24,
        borderWidth: 1, borderColor: T.border,
    },

    // Recent card (PureSpin-style)
    recentCard: {
        marginHorizontal: 20, backgroundColor: T.surface,
        borderRadius: 20, padding: 16, marginBottom: 24,
        borderWidth: 1, borderColor: T.border,
    },
    recentCardHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 14,
    },
    recentCardDate: { fontSize: 11, color: T.textMuted, fontWeight: '500', textTransform: 'capitalize' },
    recentCardBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: T.accentDim, borderRadius: 20,
        paddingHorizontal: 8, paddingVertical: 3,
    },
    recentCardBadgeText: { fontSize: 11, color: T.accent, fontWeight: '700' },

    // List
    listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
    rowDivider: { height: 1, backgroundColor: T.border },



    // Text
    listName: { fontSize: 13, fontWeight: '600', color: T.textPrimary },
    listSub: { fontSize: 11, color: T.textSecondary, marginTop: 2 },
    listAmt: { fontSize: 14, fontWeight: '700', color: T.textPrimary },
    estadoDot: { width: 6, height: 6, borderRadius: 3 },

    // Empty
    emptyState: {
        alignItems: 'center', justifyContent: 'center',
        gap: 8, paddingVertical: 48, marginBottom: 110,
    },
    emptyIconWrap: {
        width: 60, height: 60, borderRadius: 18,
        backgroundColor: T.accentDim, borderWidth: 1, borderColor: T.accent + '30',
        alignItems: 'center', justifyContent: 'center', marginBottom: 4,
    },
    emptyText: { fontSize: 14, color: T.textSecondary, fontWeight: '600' },
    emptySubText: { fontSize: 12, color: T.textMuted },
});