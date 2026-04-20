import { C } from '@/State/utils/c';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

export type ComprobanteMethod = 'Boleta' | 'Factura' | 'Anonima';

const COMPROBANTE_OPTIONS: { key: ComprobanteMethod; label: string }[] = [
    { key: 'Boleta', label: 'Boleta' },
    { key: 'Factura', label: 'Factura' },
    { key: 'Anonima', label: 'Anónima' },
];

interface ComprobanteCardProps {
    comprobanteMethod: ComprobanteMethod;
    onSelect: (method: ComprobanteMethod) => void;
}


// ═══════════════════════════════════════════════════════════════════════════════
// ComprobanteCardSelect.tsx
// ═══════════════════════════════════════════════════════════════════════════════


interface ComprobanteCardProps {
    comprobanteMethod: ComprobanteMethod;
    onSelect: (method: ComprobanteMethod) => void;
}

export function ComprobanteCardSelect({ comprobanteMethod, onSelect }: ComprobanteCardProps) {
    return (
        <View style={compStyles.card}>
            <View style={compStyles.cardHead}>
                <Text style={compStyles.secLabel}>COMPROBANTE</Text>
            </View>
            <View style={compStyles.optRow}>
                {COMPROBANTE_OPTIONS.map((opt: any) => {
                    const isActive = comprobanteMethod === opt.key;
                    return (
                        <TouchableOpacity
                            key={opt.key}
                            style={[compStyles.opt, isActive && compStyles.optActive]}
                            onPress={() => onSelect(opt.key)}
                            activeOpacity={0.8}
                        >
                            <Icon
                                source={opt.icon as any}
                                size={15}
                                color={isActive ? C.bg : C.textSecondary}
                            />
                            <Text style={[compStyles.optLabel, isActive && compStyles.optLabelActive]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const compStyles = StyleSheet.create({
    card: {
        borderRadius: 16, backgroundColor: C.surface,
        borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    },
    cardHead: {
        padding: 14, paddingHorizontal: 16,
        borderBottomWidth: 1, borderBottomColor: C.border,
    },
    secLabel: { fontSize: 10, fontWeight: '800', color: C.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' },
    optRow: { flexDirection: 'row', gap: 8, padding: 12, paddingHorizontal: 14 },
    opt: {
        flex: 1, paddingVertical: 11, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: C.surfaceAlt,
        borderWidth: 1, borderColor: C.border,
        flexDirection: 'row', gap: 6,
    },
    optActive: { backgroundColor: C.accent, borderColor: C.accent },
    optLabel: { fontSize: 13, fontWeight: '700', color: C.textSecondary },
    optLabelActive: { color: C.bg },
});
