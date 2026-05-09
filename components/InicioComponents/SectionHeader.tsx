import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';



import T from "@/constants/THEME";

function SectionHeader({
    title, action, onAction,
}: { title: string; action?: string; onAction?: () => void }) {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {action && (
                <TouchableOpacity onPress={onAction} style={styles.seeAllBtn}>
                    <Text style={styles.sectionAction}>{action}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}


// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({


    // Header
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 16, marginBottom: 8,
    },
    headerLeft: { flex: 1 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
    locationText: { fontSize: 11, color: T.textSecondary, fontWeight: '500' },
    greetingRow: { flexDirection: 'row', alignItems: 'baseline' },
    greeting: { fontSize: 22, color: T.textSecondary, fontWeight: '500' },
    greetingBold: { fontSize: 22, color: T.textPrimary, fontWeight: '800', letterSpacing: -0.5 },
    iconBtn: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: T.surface, borderWidth: 1, borderColor: T.border,
        alignItems: 'center', justifyContent: 'center',
    },
    notifDot: {
        position: 'absolute', top: 8, right: 8,
        width: 7, height: 7, borderRadius: 4,
        backgroundColor: T.red, borderWidth: 1.5, borderColor: T.bg,
    },
    avatarBtn: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: T.accentDim, borderWidth: 1, borderColor: T.accent + '40',
        alignItems: 'center', justifyContent: 'center',
    },
    avatarBtnText: { fontSize: 13, fontWeight: '800', color: T.accent },



    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: 20, marginBottom: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: T.textPrimary, letterSpacing: -0.3 },
    seeAllBtn: {
        backgroundColor: T.surface, borderRadius: 20,
        paddingHorizontal: 12, paddingVertical: 5,
        borderWidth: 1, borderColor: T.border,
    },
    sectionAction: { fontSize: 11, color: T.accent, fontWeight: '600' },


});

export default SectionHeader