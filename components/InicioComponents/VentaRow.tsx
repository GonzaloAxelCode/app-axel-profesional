
import T from '@/constants/THEME';
import { Venta } from '@/State/models/venta.models';
import React, { memo } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { ESTADO_COLOR, fmt, formatHour, getInitials } from './utils';

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

VentaRow.displayName = "VentaRow"

export default VentaRow

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({


    // Store name
    storeNameWrap: { paddingHorizontal: 20, marginBottom: 20 },
    storeName: { fontSize: 32, fontWeight: '900', color: T.textPrimary, letterSpacing: -1.5 },
    storeSubtitle: { fontSize: 12, color: T.textMuted, marginTop: 4, textTransform: 'capitalize' },



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

});