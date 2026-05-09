import React, { useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import SectionHeader from './SectionHeader';


import TopProductRow from '@/components/InicioComponents/TopProductRow';
import T from '@/constants/THEME';
import { useVentas } from '@/State/hooks/useVentas';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';




const TopProductsHoy = () => {
    const { topProductosHoy } = useVentas();
    const maxCantidad = useMemo(
        () => Math.max(...(topProductosHoy?.map((p) => p.cantidad_total_vendida) ?? [1])),
        [topProductosHoy],
    );
    return (
        <React.Fragment>
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
        </React.Fragment>
    )
}
// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({



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

});
export default TopProductsHoy