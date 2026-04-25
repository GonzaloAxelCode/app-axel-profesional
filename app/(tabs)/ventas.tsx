import VentaDetalleModal from "@/components/venta/VentaDetailModal";
import T from "@/constants/THEME";
import { useVentas } from "@/State/hooks/useVentas";
import { Venta } from "@/State/models/venta.models";
import { useVentaStore } from "@/State/store/useVentaStore";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import { Text } from "react-native-paper";

// ─── (MISMAS HELPERS, NO CAMBIO) ─────────────────────────────────────────────
const formatFecha = (fecha: string) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-PE', {
        month: 'short', day: 'numeric', year: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });
};

const ESTADO_CFG: Record<string, { color: string; bg: string }> = {
    aceptado: { color: T.green, bg: T.green + '18' },
    pendiente: { color: T.amber, bg: T.amber + '18' },
    anulado: { color: T.red, bg: T.red + '18' },
    cancelado: { color: T.textSecondary, bg: T.border },
};
const getEstado = (e: string) => ESTADO_CFG[e?.toLowerCase()] ?? ESTADO_CFG.cancelado;

const COMPROBANTE_LABEL: Record<string, string> = {
    '01': 'FACTURA', '03': 'BOLETA', boleta: 'BOLETA', factura: 'FACTURA',
};
const getTipoLabel = (tipo: string) =>
    COMPROBANTE_LABEL[tipo?.toLowerCase()] ?? tipo?.toUpperCase() ?? '—';

const getInitial = (n: string) => n?.trim()?.charAt(0)?.toUpperCase() ?? '?';

const AVATAR_COLORS = [T.accent, T.green, T.blue, '#f9a8d4', T.amber, T.purple];
const getAvatarColor = (n: string) =>
    AVATAR_COLORS[(n?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

type ListItem =
    | { type: 'divider'; fecha: string; count: number }
    | { type: 'venta'; data: Venta };

const getFechaKey = (f: string) => f.slice(0, 10);
const formatDivider = (f: string) =>
    new Date(f).toLocaleDateString('es-PE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

const buildList = (ventas: Venta[]): ListItem[] => {
    const result: ListItem[] = [];
    let lastKey = '';
    for (const v of ventas) {
        const key = getFechaKey(v.fecha_hora);
        if (key !== lastKey) {
            const count = ventas.filter((x) => getFechaKey(x.fecha_hora) === key).length;
            result.push({ type: 'divider', fecha: v.fecha_hora, count });
            lastKey = key;
        }
        result.push({ type: 'venta', data: v });
    }
    return result;
};

// ─── CARD PREMIUM ─────────────────────────────────────────────────────────────
function VentaCard({ venta, onPress }: { venta: Venta; onPress: () => void }) {
    const estado = getEstado(venta.estado);
    const tipoLabel = getTipoLabel(venta.comprobante?.tipo_comprobante ?? venta.tipo_comprobante);
    const serie = venta.comprobante?.serie ?? '—';
    const correlativo = venta.comprobante?.correlativo ?? '—';
    const avatarColor = getAvatarColor(venta.nombre_cliente ?? '');

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>

            {/* TOP */}
            <View style={styles.topRow}>
                <View style={[styles.avatar, { backgroundColor: avatarColor + '25' }]}>
                    <Text style={[styles.avatarText, { color: avatarColor }]}>
                        {getInitial(venta.nombre_cliente)}
                    </Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.cliente} numberOfLines={1}>
                        {venta.nombre_cliente || 'Anónimo'}
                    </Text>

                    <Text style={styles.serie}>
                        {serie}-{correlativo} · {tipoLabel}
                    </Text>
                </View>

                <View style={[styles.badge, { backgroundColor: estado.bg }]}>
                    <View style={[styles.dot, { backgroundColor: estado.color }]} />
                    <Text style={[styles.badgeText, { color: estado.color }]}>
                        {venta.estado}
                    </Text>
                </View>
            </View>

            {/* DIVIDER */}
            <View style={styles.divider} />

            {/* BOTTOM */}
            <View style={styles.bottomRow}>
                <View style={styles.meta}>
                    <Text style={styles.metaLabel}>MÉTODO</Text>
                    <Text style={styles.metaValue}>{venta.metodo_pago?.toUpperCase()}</Text>
                </View>

                <View style={styles.meta}>
                    <Text style={styles.metaLabel}>FECHA</Text>
                    <Text style={styles.metaValue}>{formatFecha(venta.fecha_hora)}</Text>
                </View>

                <View style={[styles.meta, { alignItems: 'flex-end' }]}>
                    <Text style={styles.metaLabel}>TOTAL</Text>
                    <Text style={styles.total}>S/ {venta.total}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

// ─── SCREEN ───────────────────────────────────────────────────────────────────
export default function VentasScreenPremium() {
    const {
        ventasPorTienda,
        loadingVentasHoy,
        fetchNextVentasPage,
        hasNextVentasPage,
        isFetchingNextVentasPage,
        refreshVentasPorTienda,
    } = useVentas();

    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const { temporaryVenta, showVentaDetailTemporary, } = useVentaStore();


    const listData = useMemo(
        () => buildList(ventasPorTienda ?? []),
        [ventasPorTienda],
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        try { await refreshVentasPorTienda(); }
        finally { setRefreshing(false); }
    };

    if (loadingVentasHoy) {
        return (
            <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color={T.accent} />
                <Text style={styles.loadingText}>Cargando ventas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>

            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Ventas</Text>
                    <Text style={styles.subtitle}>
                        {ventasPorTienda?.length ?? 0} registros
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => router.push('/hacerventa')}
                >
                    <Icon name="plus" size={18} color={T.bg} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={listData}
                keyExtractor={(item, index) =>
                    item.type === 'divider' ? `d-${item.fecha}` : `v-${item.data.id}`
                }
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={T.accent}
                    />
                }
                onEndReached={() => {
                    if (hasNextVentasPage && !isFetchingNextVentasPage) fetchNextVentasPage();
                }}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                    isFetchingNextVentasPage ? (
                        <ActivityIndicator size="small" color={T.accent} style={{ marginVertical: 16 }} />
                    ) : null
                }
                renderItem={({ item }) => {
                    if (item.type === 'divider') {
                        return (
                            <View style={styles.dividerWrap}>
                                <View style={styles.line} />
                                <Text style={styles.dividerText}>{formatDivider(item.fecha)}</Text>
                                <View style={styles.count}>
                                    <Text style={styles.countText}>{item.count}</Text>
                                </View>
                                <View style={styles.line} />
                            </View>
                        );
                    }

                    return (
                        <VentaCard
                            venta={item.data}
                            onPress={() => {
                                useVentaStore.setState({
                                    temporaryVenta: item.data,
                                    showVentaDetailTemporary: true
                                });
                            }}
                        />
                    );
                }}
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <View style={styles.emptyIcon}>
                            <Icon name="package-variant-closed" size={32} color={T.accent} />
                        </View>
                        <Text style={styles.emptyText}>Sin resultados</Text>
                        <Text style={styles.emptySub}>No hay ventas</Text>
                    </View>
                }
            />

            <VentaDetalleModal
                venta={temporaryVenta}
                visible={showVentaDetailTemporary}
                onClose={() =>
                    useVentaStore.setState({
                        showVentaDetailTemporary: false,
                        temporaryVenta: {} as Venta
                    })
                }
            />
        </View>
    );
}

// ─── STYLES PREMIUM ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: T.bg },

    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: { fontSize: 28, fontWeight: '900', color: T.textPrimary },
    subtitle: { fontSize: 12, color: T.textSecondary },

    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: T.accent,
        alignItems: 'center',
        justifyContent: 'center',
        ...T.shadowAccent,
    },

    list: { paddingBottom: 120 },

    card: {
        marginHorizontal: 20,
        marginBottom: 14,
        padding: 16,
        borderRadius: T.radiusLg,
        backgroundColor: T.surface,
        borderWidth: 1,
        borderColor: T.border,
        ...T.shadowCard,
    },

    topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },

    avatar: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { fontSize: 20, fontWeight: '900' },

    cliente: { fontSize: 15, fontWeight: '800', color: T.textPrimary },
    serie: { fontSize: 12, color: T.textSecondary, marginTop: 2 },

    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    dot: { width: 6, height: 6, borderRadius: 3 },
    badgeText: { fontSize: 11, fontWeight: '700' },

    divider: {
        height: 1,
        backgroundColor: T.border,
        marginVertical: 12,
    },

    bottomRow: { flexDirection: 'row' },

    meta: { flex: 1 },
    metaLabel: {
        fontSize: 10,
        color: T.textMuted,
        textTransform: 'uppercase',
    },
    metaValue: {
        fontSize: 13,
        color: T.textSecondary,
        marginTop: 3,
    },
    total: {
        fontSize: 20,
        fontWeight: '900',
        color: T.accent,
    },

    dividerWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 18,
        gap: 10,
        paddingHorizontal: 20,
    },
    line: { flex: 1, height: 1, backgroundColor: T.border },
    dividerText: { fontSize: 12, color: T.textSecondary },
    count: {
        backgroundColor: T.accentDim,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    countText: { fontSize: 10, color: T.accent, fontWeight: '700' },

    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: T.bg,
        gap: 10,
    },
    loadingText: { color: T.textSecondary },
    emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyIcon: {
        width: 64, height: 64, borderRadius: 20,
        backgroundColor: T.accentDim, borderWidth: 1, borderColor: T.accent + '30',
        alignItems: 'center', justifyContent: 'center',
    },
    emptyText: { fontSize: 15, color: T.textSecondary, fontWeight: '600' },
    emptySub: { fontSize: 12, color: T.textMuted },
});