// ─── TopProductRow ────────────────────────────────────────────────────────────
import T from "@/constants/THEME";
import React, { memo } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { fmt } from "./utils";


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
TopProductRow.displayName = "TopProductRow"



const styles = StyleSheet.create({



    listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
    rowDivider: { height: 1, backgroundColor: T.border },


    rankBadge: {
        width: 28, height: 28, borderRadius: 9,
        backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: T.border,
    },
    rankBadge1: { backgroundColor: T.accent, borderColor: T.accent },
    rankText: { fontSize: 12, fontWeight: '700', color: T.textSecondary },
    rankText1: { color: T.bg },


    prog: { height: 3, backgroundColor: T.border, borderRadius: 2, marginTop: 6, overflow: 'hidden' },
    progFill: { height: '100%', backgroundColor: T.accent, borderRadius: 2 },


    listName: { fontSize: 13, fontWeight: '600', color: T.textPrimary },
    listSub: { fontSize: 11, color: T.textSecondary, marginTop: 2 },
    listAmt: { fontSize: 14, fontWeight: '700', color: T.textPrimary },
    estadoDot: { width: 6, height: 6, borderRadius: 3 },

});
export default TopProductRow