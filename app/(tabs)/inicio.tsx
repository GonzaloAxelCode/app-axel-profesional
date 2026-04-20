
import { VentasUltimos30DiasChart } from '@/components/venta/VentasChart';
import { useVentas } from '@/State/hooks/useVentas';
import { Venta } from '@/State/models/venta.models';
import { useVentaStore } from '@/State/store/useVentaStore';
import { C } from '@/State/utils/c';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo, useEffect, useMemo } from 'react';
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
    `S/. ${n.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

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

// ─── TopProductRow ────────────────────────────────────────────────────────────
const TopProductRow = memo(({
    nombre, cantidad, total, rank, maxCantidad,
}: {
    nombre: string; cantidad: number; total: number; rank: number; maxCantidad: number;
}) => {
    const pct = maxCantidad > 0 ? cantidad / maxCantidad : 0;
    return (
        <View style={styles.listRow}>
            <View style={[styles.rankBadge, rank === 1 && styles.rankBadge1]}>
                <Text style={[styles.rankText, rank === 1 && styles.rankText1]}>{rank}</Text>
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
    aceptado: C.green, pendiente: C.accentDim, anulado: C.red, cancelado: C.textSecondary,
};

const VentaRow = memo(({ venta }: { venta: Venta }) => {
    const cliente = venta.nombre_cliente || 'Cliente anónimo';
    const initials = getInitials(cliente);
    const dotColor = ESTADO_COLOR[venta.estado?.toLowerCase()] ?? C.textSecondary;

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
                <TouchableOpacity onPress={onAction}>
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
    const { loadVentasRangoFechas } = useVentaStore();

    useEffect(() => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        loadVentasRangoFechas(
            start.toISOString().split('T')[0],
            end.toISOString().split('T')[0],
        );
    }, []);

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
                <View style={{ flex: 1 }}>
                    <Text style={styles.greeting} numberOfLines={1}>{today}</Text>
                    <Text style={styles.storeName}>Axel Accesories</Text>
                </View>
                <TouchableOpacity
                    style={styles.avatarBtn}
                    onPress={() => router.push('/configuracion')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.avatarBtnText}>MT</Text>
                </TouchableOpacity>
            </View>

            {/* ── Hero card ── */}
            <View style={styles.heroCard}>
                <View style={styles.heroDot} />
                <Text style={styles.heroLabel}>Ventas de Hoy</Text>
                <Text style={styles.heroValue}>{fmt(todaySales)}</Text>
                <Text style={styles.heroSub}>Actualizado ahora</Text>
                <View style={styles.heroRule} />
                <View style={styles.heroStats}>
                    <StatPill label="Hoy" value={fmt(todaySales)} />
                    <View style={styles.heroStatDivider} />
                    <StatPill label="Semana" value={fmt(weekSales)} />
                    <View style={styles.heroStatDivider} />
                    <StatPill label="Mes" value={fmt(monthSales)} />
                </View>
            </View>

            {/* ── Chart ── */}
            <SectionHeader title="Estadísticas" />
            <View style={styles.card}>

                <VentasUltimos30DiasChart />
            </View>

            {/* ── Top productos ── */}
            {(topProductosHoy?.length ?? 0) > 0 && (
                <>
                    <SectionHeader
                        title="Top productos"
                        action={`${topProductosHoy!.length} items`}
                    />
                    <View style={styles.card}>
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
                    <Icon name="receipt-text-outline" size={28} color={C.textMuted} />
                    <Text style={styles.emptyText}>Sin ventas hoy todavía</Text>
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
    root: { flex: 1, backgroundColor: C.bg },
    content: { paddingTop: Platform.OS === 'ios' ? 56 : 24, paddingBottom: 24 },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, marginBottom: 20, paddingTop: 16, gap: 12,
    },
    greeting: { fontSize: 12, color: C.textSecondary, fontWeight: '500', textTransform: 'capitalize', marginBottom: 3 },
    storeName: { fontSize: 24, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.5 },
    avatarBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: C.accentDim, borderWidth: 1, borderColor: C.accent + '40',
        alignItems: 'center', justifyContent: 'center',
    },
    avatarBtnText: { fontSize: 12, fontWeight: '800', color: C.accent },

    // Hero
    heroCard: {
        marginHorizontal: 20, backgroundColor: C.surface,
        borderRadius: 24, padding: 22, marginBottom: 28,
        borderWidth: 1, borderColor: C.border,
    },
    heroDot: {
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: C.accent, marginBottom: 10,
    },
    heroLabel: { fontSize: 13, color: C.textSecondary, marginBottom: 6 },
    heroValue: { fontSize: 42, fontWeight: '800', color: C.textPrimary, letterSpacing: -2, lineHeight: 46 },
    heroSub: { fontSize: 12, color: C.textMuted, marginTop: 6 },
    heroRule: { height: 1, backgroundColor: C.border, marginVertical: 18 },
    heroStats: { flexDirection: 'row' },
    heroStatDivider: { width: 1, backgroundColor: C.border },
    statPill: { flex: 1, alignItems: 'center', gap: 4 },
    statPillVal: { fontSize: 18, fontWeight: '700', color: C.textPrimary },
    statPillLbl: { fontSize: 11, color: C.textSecondary },

    // Section
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: 20, marginBottom: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: C.textPrimary },
    sectionAction: { fontSize: 12, color: C.accent },

    // Card
    card: {
        marginHorizontal: 20, backgroundColor: C.surface,
        borderRadius: 20, padding: 0, marginBottom: 24,
        borderWidth: 1, borderColor: C.border,
    },

    // Chart
    chartTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    chartLabel: { fontSize: 13, color: C.textSecondary },
    chipAccent: { backgroundColor: C.accentDim, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    chipAccentText: { fontSize: 12, fontWeight: '700', color: C.accent },

    // List
    listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
    rowDivider: { height: 1, backgroundColor: C.border },

    // Rank
    rankBadge: {
        width: 26, height: 26, borderRadius: 8,
        backgroundColor: C.surfaceAlt, alignItems: 'center', justifyContent: 'center',
    },
    rankBadge1: { backgroundColor: C.accent },
    rankText: { fontSize: 12, fontWeight: '700', color: C.textSecondary },
    rankText1: { color: C.bg },

    // Progress
    prog: { height: 2, backgroundColor: C.border, borderRadius: 1, marginTop: 6, overflow: 'hidden' },
    progFill: { height: '100%', backgroundColor: C.accent, borderRadius: 1 },

    // Avatar
    avatarCircle: {
        width: 36, height: 36, borderRadius: 12,
        backgroundColor: C.surfaceAlt, alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { fontSize: 12, fontWeight: '700', color: C.textSecondary },

    // Text
    listName: { fontSize: 13, fontWeight: '600', color: C.textPrimary },
    listSub: { fontSize: 11, color: C.textSecondary, marginTop: 2 },
    listAmt: { fontSize: 14, fontWeight: '700', color: C.textPrimary },
    estadoDot: { width: 6, height: 6, borderRadius: 3 },

    // Empty
    emptyState: {
        alignItems: 'center', justifyContent: 'center',
        gap: 10, paddingVertical: 48, marginBottom: 110,
    },
    emptyText: { fontSize: 13, color: C.textMuted },
});