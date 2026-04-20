import { VentaDetalleModal } from "@/components/venta/VentaDetailModal";
import { useVentas } from "@/State/hooks/useVentas";
import { Venta } from "@/State/models/venta.models";
import { C } from "@/State/utils/c";
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatFecha = (fecha: string) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-PE', {
        month: 'short', day: 'numeric', year: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });
};

const ESTADO_CFG: Record<string, { color: string; bg: string }> = {
    aceptado: { color: '#4ade80', bg: '#4ade8014' },
    pendiente: { color: C.amber, bg: C.amber + '14' },
    anulado: { color: C.red, bg: C.red + '14' },
    cancelado: { color: C.textSecondary, bg: C.border },
};
const getEstado = (e: string) => ESTADO_CFG[e?.toLowerCase()] ?? ESTADO_CFG.cancelado;

const COMPROBANTE_LABEL: Record<string, string> = {
    '01': 'FACTURA', '03': 'BOLETA', boleta: 'BOLETA', factura: 'FACTURA',
};
const getTipoLabel = (tipo: string) =>
    COMPROBANTE_LABEL[tipo?.toLowerCase()] ?? tipo?.toUpperCase() ?? '—';

const getInitial = (n: string) => n?.trim()?.charAt(0)?.toUpperCase() ?? '?';

const AVATAR_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
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

// ─── VentaCard ────────────────────────────────────────────────────────────────
function VentaCard({ venta, onPress }: { venta: Venta; onPress: () => void }) {
    const estado = getEstado(venta.estado);
    const tipoLabel = getTipoLabel(venta.comprobante?.tipo_comprobante ?? venta.tipo_comprobante);
    const serie = venta.comprobante?.serie ?? '—';
    const correlativo = venta.comprobante?.correlativo ?? '—';
    const avatarColor = getAvatarColor(venta.nombre_cliente ?? '');

    return (
        <TouchableOpacity style={styles.ventaCard} onPress={onPress} activeOpacity={0.7}>
            {/* Top row */}
            <View style={styles.cardTop}>
                <View style={[styles.cardAvatar, { backgroundColor: avatarColor + '18' }]}>
                    <Text style={[styles.cardAvatarText, { color: avatarColor }]}>
                        {getInitial(venta.nombre_cliente)}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardCliente} numberOfLines={1}>
                        {venta.nombre_cliente || 'Anónimo'}
                    </Text>
                    <Text style={styles.cardSerie}>{serie}-{correlativo} · {tipoLabel}</Text>
                </View>
                <View style={[styles.estadoBadge, { backgroundColor: estado.bg }]}>
                    <View style={[styles.estadoDot, { backgroundColor: estado.color }]} />
                    <Text style={[styles.estadoText, { color: estado.color }]}>
                        {venta.estado?.charAt(0).toUpperCase() + venta.estado?.slice(1)}
                    </Text>
                </View>
            </View>

            {/* Bottom row */}
            <View style={styles.cardBottom}>
                <View style={styles.cardMeta}>
                    <Text style={styles.cardMetaLabel}>MÉTODO</Text>
                    <Text style={styles.cardMetaValue}>{venta.metodo_pago?.toUpperCase() ?? '—'}</Text>
                </View>
                <View style={styles.cardMeta}>
                    <Text style={styles.cardMetaLabel}>FECHA</Text>
                    <Text style={styles.cardMetaValue}>{formatFecha(venta.fecha_hora)}</Text>
                </View>
                <View style={[styles.cardMeta, { alignItems: 'flex-end' }]}>
                    <Text style={styles.cardMetaLabel}>TOTAL</Text>
                    <Text style={styles.cardTotal}>S/ {venta.total}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}


// ─── VentasScreen ─────────────────────────────────────────────────────────────
export default function VentasScreen() {
    const {
        ventasPorTienda,
        loadingVentasHoy,
        fetchNextVentasPage,
        hasNextVentasPage,
        isFetchingNextVentasPage,
        refetchVentas,
    } = useVentas();
    const router = useRouter();
    const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const listData = useMemo(
        () => buildList(ventasPorTienda ?? []),
        [ventasPorTienda],
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        try { await refetchVentas(); }
        finally { setRefreshing(false); }
    };

    if (loadingVentasHoy) {
        return (
            <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color={C.accent} />
                <Text style={styles.loadingText}>Cargando ventas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Ventas</Text>
                    <Text style={styles.headerSub}>
                        {ventasPorTienda?.length} registro{ventasPorTienda?.length !== 1 ? 's' : ''}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => router.push('/hacerventa')}
                    activeOpacity={0.85}
                >
                    <Icon name="plus" size={15} color={C.bg} />
                    <Text style={styles.fabText}>Nueva Venta</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={listData}
                keyExtractor={(item, index) =>
                    item.type === 'divider' ? `d-${item.fecha}` : `v-${item.data.id}`
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={C.accent}
                        colors={[C.accent]}
                    />
                }
                onEndReached={() => {
                    if (hasNextVentasPage && !isFetchingNextVentasPage) fetchNextVentasPage();
                }}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                    isFetchingNextVentasPage ? (
                        <ActivityIndicator size="small" color={C.accent} style={{ marginVertical: 16 }} />
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <Icon name="receipt-text-outline" size={48} color={C.textMuted} />
                        <Text style={styles.emptyTitle}>Sin ventas</Text>
                        <Text style={styles.emptySubtitle}>No hay registros para mostrar</Text>
                    </View>
                }
                renderItem={({ item }) => {
                    if (item.type === 'divider') {
                        return (
                            <View style={styles.dividerWrap}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>{formatDivider(item.fecha)}</Text>
                                <View style={styles.dividerCount}>
                                    <Text style={styles.dividerCountText}>{item.count}</Text>
                                </View>
                                <View style={styles.dividerLine} />
                            </View>
                        );
                    }
                    return (
                        <VentaCard venta={item.data} onPress={() => setSelectedVenta(item.data)} />
                    );
                }}
            />

            <VentaDetalleModal
                venta={selectedVenta}
                visible={!!selectedVenta}
                onClose={() => setSelectedVenta(null)}
            />
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.bg },
    loadingWrap: { flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 14, color: C.textSecondary },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
        borderBottomWidth: 1, borderBottomColor: C.border,
    },
    headerTitle: { fontSize: 28, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.5 },
    headerSub: { fontSize: 12, color: C.textSecondary, marginTop: 2 },

    fab: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: C.accent, borderRadius: 20,
        paddingHorizontal: 14, paddingVertical: 10,
    },
    fabText: { color: C.bg, fontWeight: '700', fontSize: 13 },

    listContent: { padding: 16, paddingBottom: 110 },

    ventaCard: {
        backgroundColor: C.surface, borderRadius: 16,
        padding: 14, marginBottom: 10,
        borderWidth: 1, borderColor: C.border,
    },
    cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    cardAvatar: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    cardAvatarText: { fontSize: 16, fontWeight: '800' },
    cardCliente: { fontSize: 14, fontWeight: '600', color: C.textPrimary },
    cardSerie: { fontSize: 11, color: C.textSecondary, marginTop: 2 },

    estadoBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
    estadoDot: { width: 5, height: 5, borderRadius: 3 },
    estadoText: { fontSize: 11, fontWeight: '600' },

    cardBottom: { flexDirection: 'row', alignItems: 'flex-end' },
    cardMeta: { flex: 1 },
    cardMetaLabel: { fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
    cardMetaValue: { fontSize: 12, fontWeight: '500', color: C.textSecondary },
    cardTotal: { fontSize: 16, fontWeight: '800', color: C.textPrimary },

    dividerWrap: { flexDirection: 'row', alignItems: 'center', marginVertical: 14, gap: 8 },
    dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
    dividerText: { fontSize: 11, color: C.textSecondary, textTransform: 'capitalize' },
    dividerCount: { backgroundColor: C.surfaceAlt, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
    dividerCountText: { fontSize: 10, color: C.textSecondary, fontWeight: '600' },

    emptyWrap: { alignItems: 'center', paddingTop: 80, gap: 10 },
    emptyTitle: { fontSize: 17, fontWeight: '600', color: C.textSecondary },
    emptySubtitle: { fontSize: 13, color: C.textMuted },
});





