
import T from '@/constants/THEME';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import React, { memo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';




const ServiceChip = memo(({ icon, label, time, onPress }: { icon: string; label: string; time: string; onPress: () => void }) => {


    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View style={styles.serviceChip}>
                <View style={styles.serviceIconWrap}>
                    <Icon name={icon as any} size={18} color={T.accent} />
                </View>
                <View>
                    <Text style={styles.serviceTime}>{time}</Text>
                    <Text style={styles.serviceLabel}>{label}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});
ServiceChip.displayName = "ServiceChip"

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

    // Services
    servicesScroll: { paddingLeft: 20, paddingRight: 8, gap: 10 },
    serviceChip: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: T.surface, borderRadius: 16,
        borderWidth: 1, borderColor: T.border,
        paddingHorizontal: 14, paddingVertical: 12,
    },
    serviceIconWrap: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: T.accentDim, borderWidth: 1, borderColor: T.accent + '30',
        alignItems: 'center', justifyContent: 'center',
    },
    serviceTime: { fontSize: 9, color: T.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    serviceLabel: { fontSize: 13, fontWeight: '600', color: T.textPrimary, marginTop: 1 },

});
export default ServiceChip