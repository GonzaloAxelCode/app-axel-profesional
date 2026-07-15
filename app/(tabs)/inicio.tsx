
import SectionHeader from '@/components/InicioComponents/SectionHeader';
import ServiceChip from '@/components/InicioComponents/ServiceChip';
import StatPill from '@/components/InicioComponents/StarPill';
import TopProductsHoy from '@/components/InicioComponents/TopProductsHoy';
import { fmt } from '@/components/InicioComponents/utils';
import VentaRow from '@/components/InicioComponents/VentaRow';
import { VentasChart } from '@/components/venta/VentasChart';
import { GaugeChart } from '@/components/InicioComponents/GaugeChart';
import { DonutChart } from '@/components/InicioComponents/DonutChart';
import { ProgressCircles } from '@/components/InicioComponents/ProgressCircles';
import { TopProductsBar } from '@/components/InicioComponents/TopProductsBar';
import { SparklineChart } from '@/components/InicioComponents/SparklineChart';
import { useAppTheme } from '@/State/context/ThemeContext';
import { useVentas } from '@/State/hooks/useVentas';
import { useAuthStore } from '@/State/store/useAuthStore';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTabRouter } from './_layout';

export default function InicioScreen() {
    const router = useRouter();
    const { T } = useAppTheme();
    const { resumenVentas, ventasHoy, refreshAll } = useVentas();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refreshAll();
        setRefreshing(false);
    }, [refreshAll]);

    useFocusEffect(
        useCallback(() => {
            refreshAll();
        }, [refreshAll])
    );

    const navigateToTab = useTabRouter();

    const isAccepted = (v: any) => {
        const e = v?.estado?.toLowerCase();
        return e === 'aceptado' || e === 'pendiente';
    };

    const todaySales = (ventasHoy ?? []).filter(isAccepted).reduce((sum, v) => sum + (v.total ?? 0), 0);
    const weekSales = resumenVentas?.thisWeekSales ?? 0;
    const monthSales = resumenVentas?.thisMonthSales ?? 0;

    const today = new Date().toLocaleDateString('es-PE', {
        weekday: 'long', day: 'numeric', month: 'long',
    });
    const ventasDeHoy = (ventasHoy ?? []).filter(isAccepted).slice(0, 8);
    const { user, tienda } = useAuthStore();

    const st = styles(T);

    return (
        <ScrollView
            style={st.root}
            contentContainerStyle={st.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={T.accent}
                    colors={[T.accent]}
                    progressBackgroundColor={T.surface}
                />
            }
        >
            <View style={st.header}>
                <View style={st.headerLeft}>
                    <View style={st.locationRow}>
                        <Icon name="map-marker-outline" size={12} color={T.textSecondary} />
                        <Text style={st.locationText}>Puente Pieda, Lima, Perú</Text>
                    </View>
                    <View style={st.greetingRow}>
                        <Text style={st.greeting}>Hola, </Text>
                        <Text style={st.greetingBold}>Bienvenido 👋</Text>
                    </View>
                </View>
                <View style={st.headerRight}>
                    <TouchableOpacity
                        style={st.avatarBtn}
                        onPress={() => navigateToTab('configuracion')}
                        activeOpacity={0.8}
                    >
                        <Text style={st.avatarBtnText}>MT</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={st.storeNameWrap}>
                <Text style={st.storeName}> {tienda?.nombre}</Text>
                <Text style={st.storeSubtitle}>{tienda?.direccion} · {today}</Text>
            </View>

            <View style={st.heroCard}>
                <View style={st.heroGlow} />
                <View style={st.heroTopRow}>
                    <View>
                        <Text style={st.heroLabel}>Ventas de Hoy</Text>
                        <Text style={st.heroValue}>{fmt(todaySales)}</Text>
                    </View>
                    <View style={st.heroLiveBadge}>
                        <View style={st.heroLiveDot} />
                        <Text style={st.heroLiveText}>En vivo</Text>
                    </View>
                </View>
                <Text style={st.heroSub}>Actualizado ahora mismo</Text>
                <View style={st.heroRule} />
                <View style={st.heroStats}>
                    <StatPill label="Hoy" value={fmt(todaySales)} />
                    <View style={st.heroStatDivider} />
                    <StatPill label="Semana" value={fmt(weekSales)} />
                    <View style={st.heroStatDivider} />
                    <StatPill label="Mes" value={fmt(monthSales)} />
                </View>
            </View>

            <SectionHeader title="Estadísticas generales" />

            {/* Gauge */}
            <View style={st.chartFull}>
                <GaugeChart />
            </View>

            {/* Donut */}
            <View style={st.chartFull}>
                <DonutChart />
            </View>

            {/* Top Products */}
            <View style={st.chartFull}>
                <TopProductsBar />
            </View>

            {/* Sparkline */}
            <View style={st.chartFull}>
                <SparklineChart />
            </View>

            {/* Progress Circles */}
            <View style={st.chartFull}>
                <ProgressCircles />
            </View>

            <SectionHeader title="Servicios rápidos" />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={st.servicesScroll}
                style={{ marginBottom: 24 }}
            >
                <ServiceChip icon="cart-plus" label="Nueva Venta" time="Rápido" onPress={() => router.push('/hacerventa')} />
                <ServiceChip icon="package-variant" label="Productos" time="Inventario" onPress={() => navigateToTab('productos')} />
                <ServiceChip icon="account-group" label="Clientes" time="Registros" onPress={() => navigateToTab('clientes')} />
                <ServiceChip icon="chart-line" label="Perfil" time="Perfil" onPress={() => navigateToTab('configuracion')} />
            </ScrollView>

            <SectionHeader title="Estadísticas 30 días" />
            <View style={st.card}>
                <VentasChart />
            </View>

            <TopProductsHoy />

            <SectionHeader
                title="Ventas de hoy"
                action="Ver todas"
                onAction={() => navigateToTab('ventas')}
            />

            {ventasDeHoy.length === 0 ? (
                <View style={st.emptyState}>
                    <View style={st.emptyIconWrap}>
                        <Icon name="receipt-text-outline" size={28} color={T.accent} />
                    </View>
                    <Text style={st.emptyText}>Sin ventas hoy todavía</Text>
                    <Text style={st.emptySubText}>Las ventas aparecerán aquí</Text>
                </View>
            ) : (
                <View style={[st.card, { marginBottom: 110 }]}>
                    {ventasDeHoy.map((v, i) => (
                        <React.Fragment key={v.id}>
                            <VentaRow venta={v} />
                            {i < ventasDeHoy.length - 1 && <View style={st.rowDivider} />}
                        </React.Fragment>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = (T: any) => StyleSheet.create({
    root: { flex: 1, backgroundColor: T.bg },
    content: { paddingTop: Platform.OS === 'ios' ? 56 : 24, paddingBottom: 24 },

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
    avatarBtn: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: T.accentDim, borderWidth: 1, borderColor: T.accent + '40',
        alignItems: 'center', justifyContent: 'center',
    },
    avatarBtnText: { fontSize: 13, fontWeight: '800', color: T.accent },

    storeNameWrap: { paddingHorizontal: 20, marginBottom: 20 },
    storeName: { fontSize: 32, fontWeight: '900', color: T.textPrimary, letterSpacing: -1.5 },
    storeSubtitle: { fontSize: 18, color: T.textMuted, marginTop: 4, textTransform: 'capitalize' },

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

    servicesScroll: { paddingLeft: 20, paddingRight: 8, gap: 10 },

    chartFull: {
        paddingHorizontal: 20,
        marginBottom: 12,
    },

    card: {
        marginHorizontal: 20, backgroundColor: T.surface,
        borderRadius: 20, padding: 16, marginBottom: 24,
        borderWidth: 1, borderColor: T.border,
    },

    rowDivider: { height: 1, backgroundColor: T.border },

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
