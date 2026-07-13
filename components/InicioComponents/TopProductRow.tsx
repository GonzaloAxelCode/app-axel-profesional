import { useAppTheme } from "@/State/context/ThemeContext";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    rank: number;
    nombre: string;
    cantidad: number;
    total: number;
    maxCantidad: number;
}

const TopProductRow = ({ rank, nombre, cantidad, total, maxCantidad }: Props) => {
    const { T } = useAppTheme();
    const pct = maxCantidad > 0 ? (cantidad / maxCantidad) * 100 : 0;
    return (
        <View style={styles(T).row}>
            <View style={[styles(T).rankBadge, rank === 1 && styles(T).rankBadge1]}>
                <Text style={[styles(T).rankText, rank === 1 && styles(T).rankText1]}>{rank}</Text>
            </View>
            <View style={styles(T).info}>
                <Text style={styles(T).name} numberOfLines={1}>{nombre}</Text>
                <View style={styles(T).barBg}>
                    <View style={[styles(T).barFill, { width: `${pct}%` }]} />
                </View>
            </View>
            <View style={styles(T).right}>
                <Text style={styles(T).qty}>{cantidad} u.</Text>
                <Text style={styles(T).total}>S/ {total.toFixed(0)}</Text>
            </View>
        </View>
    );
};

const styles = (T: any) => StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
    rankBadge: {
        width: 26, height: 26, borderRadius: 8,
        backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: T.border,
    },
    rankBadge1: { backgroundColor: T.accent, borderColor: T.accent },
    rankText: { fontSize: 11, fontWeight: '700', color: T.textSecondary },
    rankText1: { color: T.bg },
    info: { flex: 1 },
    name: { fontSize: 13, fontWeight: '600', color: T.textPrimary, marginBottom: 4 },
    barBg: { height: 4, borderRadius: 2, backgroundColor: T.surfaceAlt, overflow: 'hidden' },
    barFill: { height: 4, borderRadius: 2, backgroundColor: T.accent },
    right: { alignItems: 'flex-end' },
    qty: { fontSize: 11, color: T.textMuted, fontWeight: '500' },
    total: { fontSize: 13, fontWeight: '700', color: T.textPrimary },
});

export default TopProductRow;
