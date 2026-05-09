

import T from "@/constants/THEME";
import { Venta } from "@/State/models/venta.models";
import {
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import { Text } from "react-native-paper";
import { formatFecha, getAvatarColor, getEstado, getInitial, getTipoLabel } from "./utils";


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

                        {serie}-{correlativo || "-"}
                    </Text>

                    <Text style={styles.serie}>
                        {venta.nombre_cliente || 'Anónimo'}
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


const styles = StyleSheet.create({

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

    cliente: { fontSize: 18, fontWeight: '800', color: T.textPrimary },
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

export default VentaCard;