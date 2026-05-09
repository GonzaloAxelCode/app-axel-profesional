// ─── StatPill ─────────────────────────────────────────────────────────────────
import T from "@/constants/THEME";
import React, { memo } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';



const StatPill = memo(({ label, value }: { label: string; value: string }) => (
    <View style={styles.statPill}>
        <Text style={styles.statPillVal}>{value}</Text>
        <Text style={styles.statPillLbl}>{label}</Text>
    </View>
));

StatPill.displayName = "StatPill"
export default StatPill


// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
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
    heroLabel: { fontSize: 14, color: T.textSecondary, marginBottom: 8, fontWeight: '500' },
    heroValue: { fontSize: 40, fontWeight: '900', color: T.textPrimary, letterSpacing: -2, lineHeight: 44 },
    heroLiveBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: T.green + '15', borderRadius: 20,
        paddingHorizontal: 10, paddingVertical: 5,
        borderWidth: 1, borderColor: T.green + '30',
    },
    heroLiveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.green },
    heroLiveText: { fontSize: 11, color: T.green, fontWeight: '700' },
    heroSub: { fontSize: 14, color: T.textMuted, marginTop: 6 },
    heroRule: { height: 1, backgroundColor: T.border, marginVertical: 18 },
    heroStats: { flexDirection: 'row' },
    heroStatDivider: { width: 1, backgroundColor: T.border },
    statPill: { flex: 1, alignItems: 'center', gap: 4 },
    statPillVal: { fontSize: 25, fontWeight: '700', color: T.textPrimary },
    statPillLbl: { fontSize: 15, color: T.textSecondary, fontWeight: '500' },

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

    // Text
    listName: { fontSize: 13, fontWeight: '600', color: T.textPrimary },
    listSub: { fontSize: 11, color: T.textSecondary, marginTop: 2 },
    listAmt: { fontSize: 14, fontWeight: '700', color: T.textPrimary },
    estadoDot: { width: 6, height: 6, borderRadius: 3 },

});