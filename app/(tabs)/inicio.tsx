
import TopProductsMostSales from '@/components/venta/TopProductsMostSales';
import { VentasChart } from '@/components/venta/VentasChart';
import { VentasChart2 } from '@/components/venta/VentasChart copy';
import T from '@/constants/THEME';
import { useVentas } from '@/State/hooks/useVentas';
import { Venta } from '@/State/models/venta.models';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo, useMemo } from 'react';
import {
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


const { width: W } = Dimensions.get('window');

// ─── Utils ────────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
    `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

const formatHour = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleTimeString('es-PE', {
            hour: '2-digit', minute: '2-digit',
        });
    } catch { return ''; }
};

const today = new Date().toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long',
});

// ─── StatPill ─────────────────────────────────────────────────────────────────
const StatPill = memo(({ label, value }: { label: string; value: string }) => (
    <View style={styles.statPill}>
        <Text style={styles.statPillVal}>{value}</Text>
        <Text style={styles.statPillLbl}>{label}</Text>
    </View>
));
StatPill.displayName = 'StatPill';

// ─── ServiceChip ─────────────────────────────────────────────────────────────
const ServiceChip = memo(({ icon, label, time }: { icon: string; label: string; time: string }) => (
    <View style={styles.serviceChip}>
        <View style={styles.serviceIconWrap}>
            <Icon name={icon as any} size={18} color={T.accent} />
        </View>
        <View>
            <Text style={styles.serviceTime}>{time}</Text>
            <Text style={styles.serviceLabel}>{label}</Text>
        </View>
    </View>
));
ServiceChip.displayName = 'ServiceChip';

// ─── TopProductRow ────────────────────────────────────────────────────────────
const TopProductRow = memo(({
    nombre, cantidad, total, rank, maxCantidad,
}: {
    nombre: string; cantidad: number; total: number; rank: number; maxCantidad: number;
}) => {
    const pct = maxCantidad > 0 ? cantidad / maxCantidad : 0;
    const isFirst = rank === 1;
    return (
        <View style={styles.listRow}>
            <View style={[styles.rankBadge, isFirst && styles.rankBadge1]}>
                <Text style={[styles.rankText, isFirst && styles.rankText1]}>{rank}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.listName} numberOfLines={1}>{nombre}</Text>
                <Text style={styles.listSub}>{cantidad} uds · {fmt(total)}</Text>
                <View style={styles.prog}>
                    <View style={[styles.progFill, { width: `${pct * 100}%` as any }]} />
                </View>
            </View>
        </View>
    );
});
TopProductRow.displayName = 'TopProductRow';

// ─── VentaRow ─────────────────────────────────────────────────────────────────
const ESTADO_COLOR: Record<string, string> = {
    aceptado: T.green, pendiente: T.amber, anulado: T.red, cancelado: T.textSecondary,
};

const VentaRow = memo(({ venta }: { venta: Venta }) => {
    const cliente = venta.nombre_cliente || 'Cliente anónimo';
    const initials = getInitials(cliente);
    const dotColor = ESTADO_COLOR[venta.estado?.toLowerCase()] ?? T.textSecondary;

    return (
        <View style={styles.listRow}>
            <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initials.slice(0, 2)}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.listName} numberOfLines={1}>{cliente}</Text>
                <Text style={styles.listSub}>
                    {venta.tipo_comprobante} · {formatHour(venta.fecha_hora)}
                </Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={styles.listAmt}>{fmt(venta.total)}</Text>
                <View style={[styles.estadoDot, { backgroundColor: dotColor }]} />
            </View>
        </View>
    );
});
VentaRow.displayName = 'VentaRow';

// ─── SectionHeader ────────────────────────────────────────────────────────────
function SectionHeader({
    title, action, onAction,
}: { title: string; action?: string; onAction?: () => void }) {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {action && (
                <TouchableOpacity onPress={onAction} style={styles.seeAllBtn}>
                    <Text style={styles.sectionAction}>{action}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function InicioScreen() {
    const router = useRouter();
    const { resumenVentas, ventasHoy, topProductosHoy } = useVentas();




    const todaySales = resumenVentas?.todaySales ?? 0;
    const weekSales = resumenVentas?.thisWeekSales ?? 0;
    const monthSales = resumenVentas?.thisMonthSales ?? 0;

    const maxCantidad = useMemo(
        () => Math.max(...(topProductosHoy?.map((p) => p.cantidad_total_vendida) ?? [1])),
        [topProductosHoy],
    );

    const ventasDeHoy = ventasHoy?.slice(0, 8) ?? [];

    return (
        <ScrollView
            style={styles.root}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* ── Header ── */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.locationRow}>
                        <Icon name="map-marker-outline" size={12} color={T.textSecondary} />
                        <Text style={styles.locationText}>Lima, Perú</Text>
                    </View>
                    <View style={styles.greetingRow}>
                        <Text style={styles.greeting}>Hola, </Text>
                        <Text style={styles.greetingBold}>Bienvenido 👋</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Icon name="bell-outline" size={20} color={T.textPrimary} />
                        <View style={styles.notifDot} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.avatarBtn}
                        onPress={() => router.push('/configuracion')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.avatarBtnText}>MT</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Store name ── */}
            <View style={styles.storeNameWrap}>
                <Text style={styles.storeName}>Axel Accesories</Text>
                <Text style={styles.storeSubtitle}>Panel de control · {today}</Text>
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

            {/* ── Services row (decorativo como en el diseño) ── */}
            <SectionHeader title="Servicios rápidos" action="Ver todo" />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.servicesScroll}
                style={{ marginBottom: 24 }}
            >
                <ServiceChip icon="cart-plus" label="Nueva Venta" time="Rápido" />
                <ServiceChip icon="package-variant" label="Productos" time="Inventario" />
                <ServiceChip icon="account-group" label="Clientes" time="Registros" />
                <ServiceChip icon="chart-line" label="Reportes" time="Estadísticas" />
            </ScrollView>

            {/* ── Chart ── */}
            <SectionHeader title="Estadísticas 30 días" />
            <View style={styles.card}>
                <VentasChart />
                <VentasChart2 />

            </View>

            <TopProductsMostSales />









            {/* ── Recent Laundry style card — Top productos ── */}
            {(topProductosHoy?.length ?? 0) > 0 && (
                <>
                    <SectionHeader
                        title="Top productos hoy"
                        action={`${topProductosHoy!.length} items`}
                    />
                    <View style={styles.recentCard}>
                        <View style={styles.recentCardHeader}>
                            <Text style={styles.recentCardDate}>
                                Hoy, {new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })}
                            </Text>
                            <View style={styles.recentCardBadge}>
                                <Icon name="trending-up" size={12} color={T.accent} />
                                <Text style={styles.recentCardBadgeText}>+12%</Text>
                            </View>
                        </View>
                        {topProductosHoy!.slice(0, 5).map((p, i) => (
                            <React.Fragment key={p.producto_id ?? i}>
                                <TopProductRow
                                    rank={i + 1}
                                    nombre={p.producto_nombre ?? p.nombre}
                                    cantidad={p.cantidad_total_vendida}
                                    total={p.precio_unitario * p.cantidad_total_vendida}
                                    maxCantidad={maxCantidad}
                                />
                                {i < Math.min(topProductosHoy!.length, 5) - 1 && (
                                    <View style={styles.rowDivider} />
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                </>
            )}

            {/* ── Ventas de hoy ── */}
            <SectionHeader
                title="Ventas de hoy"
                action="Ver todas"
                onAction={() => router.replace('/ventas')}
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

// ─── Styles ───────────────────────────────────────────────────────────────────
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
    storeSubtitle: { fontSize: 12, color: T.textMuted, marginTop: 4, textTransform: 'capitalize' },

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
    heroLabel: { fontSize: 12, color: T.textSecondary, marginBottom: 8, fontWeight: '500' },
    heroValue: { fontSize: 40, fontWeight: '900', color: T.textPrimary, letterSpacing: -2, lineHeight: 44 },
    heroLiveBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: T.green + '15', borderRadius: 20,
        paddingHorizontal: 10, paddingVertical: 5,
        borderWidth: 1, borderColor: T.green + '30',
    },
    heroLiveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.green },
    heroLiveText: { fontSize: 11, color: T.green, fontWeight: '700' },
    heroSub: { fontSize: 11, color: T.textMuted, marginTop: 6 },
    heroRule: { height: 1, backgroundColor: T.border, marginVertical: 18 },
    heroStats: { flexDirection: 'row' },
    heroStatDivider: { width: 1, backgroundColor: T.border },
    statPill: { flex: 1, alignItems: 'center', gap: 4 },
    statPillVal: { fontSize: 16, fontWeight: '700', color: T.textPrimary },
    statPillLbl: { fontSize: 10, color: T.textSecondary, fontWeight: '500' },

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

    // Section
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: 20, marginBottom: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: T.textPrimary, letterSpacing: -0.3 },
    seeAllBtn: {
        backgroundColor: T.surface, borderRadius: 20,
        paddingHorizontal: 12, paddingVertical: 5,
        borderWidth: 1, borderColor: T.border,
    },
    sectionAction: { fontSize: 11, color: T.accent, fontWeight: '600' },

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

    // Rank
    rankBadge: {
        width: 28, height: 28, borderRadius: 9,
        backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: T.border,
    },
    rankBadge1: { backgroundColor: T.accent, borderColor: T.accent },
    rankText: { fontSize: 12, fontWeight: '700', color: T.textSecondary },
    rankText1: { color: T.bg },

    // Progress
    prog: { height: 3, backgroundColor: T.border, borderRadius: 2, marginTop: 6, overflow: 'hidden' },
    progFill: { height: '100%', backgroundColor: T.accent, borderRadius: 2 },

    // Avatar
    avatarCircle: {
        width: 38, height: 38, borderRadius: 12,
        backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: T.border,
    },
    avatarText: { fontSize: 12, fontWeight: '700', color: T.accent },

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