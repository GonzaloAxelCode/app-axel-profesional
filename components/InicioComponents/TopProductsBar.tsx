import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/State/context/ThemeContext';
import { useVentas } from '@/State/hooks/useVentas';
import { Text } from 'react-native-paper';

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];

export function TopProductsBar() {
    const { T } = useAppTheme();
    const { topProductosMonth, loadingTopProductosMonth } = useVentas();

    if (loadingTopProductosMonth) {
        return (
            <View style={s(T).card}>
                {[1, 2, 3, 4, 5].map(i => (
                    <View key={i} style={s(T).skeletonRow}>
                        <View style={[s(T).skeletonText, { width: 60 }]} />
                        <View style={s(T).skeletonBar}>
                            <View style={[s(T).skeletonFill, { width: `${70 - i * 10}%` }]} />
                        </View>
                    </View>
                ))}
            </View>
        );
    }

    const results = topProductosMonth?.results ?? [];
    if (results.length === 0) return null;

    const maxCantidad = Math.max(...results.map(r => r.cantidad_total_vendida));
    const top8 = results.slice(0, 8);

    return (
        <View style={s(T).card}>
            <View style={s(T).header}>
                <View>
                    <Text style={s(T).eye}>TOP PRODUCTOS</Text>
                    <Text style={s(T).subtitle}>Por volumen de ventas</Text>
                </View>
                <View style={s(T).countBadge}>
                    <Text style={s(T).countTxt}>{top8.length}</Text>
                </View>
            </View>

            {top8.map((prod, i) => {
                const pct = maxCantidad > 0
                    ? Math.round((prod.cantidad_total_vendida / maxCantidad) * 100)
                    : 0;
                const color = COLORS[i % COLORS.length];

                return (
                    <View key={i} style={s(T).row}>
                        <Text style={s(T).name} numberOfLines={1}>{prod.nombre}</Text>
                        <View style={s(T).barTrack}>
                            <View style={[s(T).barFill, { width: `${pct}%`, backgroundColor: color }]}>
                                <Text style={s(T).barPct}>{pct}%</Text>
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

const s = (T: any) => StyleSheet.create({
    card: {
        backgroundColor: T.surface,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: T.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    eye: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 1.2,
        color: T.textMuted,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '700',
        color: T.textPrimary,
    },
    countBadge: {
        width: 28,
        height: 28,
        borderRadius: 10,
        backgroundColor: T.accentDim,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countTxt: {
        fontSize: 12,
        fontWeight: '800',
        color: T.accent,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
    },
    name: {
        width: 110,
        fontSize: 12,
        fontWeight: '600',
        color: T.textSecondary,
    },
    barTrack: {
        flex: 1,
        height: 22,
        backgroundColor: T.surfaceAlt,
        borderRadius: 11,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 11,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    barPct: {
        fontSize: 10,
        fontWeight: '800',
        color: '#fff',
    },
    skeletonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
    },
    skeletonText: {
        height: 12,
        backgroundColor: T.surfaceAlt,
        borderRadius: 6,
    },
    skeletonBar: {
        flex: 1,
        height: 22,
        backgroundColor: T.surfaceAlt,
        borderRadius: 11,
        overflow: 'hidden',
    },
    skeletonFill: {
        height: '100%',
        backgroundColor: T.borderMedium,
        borderRadius: 11,
    },
});
