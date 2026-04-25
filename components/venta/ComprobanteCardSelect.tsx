
import T from '@/constants/THEME';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

export type ComprobanteMethod = 'Boleta' | 'Factura' | 'Anonima';

const COMPROBANTE_OPTIONS: {
    key: ComprobanteMethod;
    label: string;
    icon: string;
}[] = [
        { key: 'Boleta', label: 'Boleta', icon: 'receipt' },
        { key: 'Factura', label: 'Factura', icon: 'file-document' },
        { key: 'Anonima', label: 'Anónima', icon: 'incognito' },
    ];

interface ComprobanteCardProps {
    comprobanteMethod: ComprobanteMethod;
    onSelect: (method: ComprobanteMethod) => void;
}

export function ComprobanteCardSelect({
    comprobanteMethod,
    onSelect,
}: ComprobanteCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>COMPROBANTE</Text>
            </View>

            <View style={styles.row}>
                {COMPROBANTE_OPTIONS.map(opt => {
                    const isActive = comprobanteMethod === opt.key;

                    return (
                        <TouchableOpacity
                            key={opt.key}
                            style={[styles.option, isActive && styles.optionActive]}
                            onPress={() => onSelect(opt.key)}
                            activeOpacity={0.85}
                        >
                            <Icon
                                source={opt.icon as any}
                                size={16}
                                color={isActive ? T.bg : T.textSecondary}
                            />

                            <Text
                                style={[
                                    styles.label,
                                    isActive && styles.labelActive,
                                ]}
                            >
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: T.surface,
        borderRadius: T.radiusLg,
        borderWidth: 1,
        borderColor: T.border,
        overflow: 'hidden',
        ...T.shadowCard,
    },

    header: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: T.border,
        backgroundColor: T.surfaceAlt,
    },

    title: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.3,
        color: T.textMuted,
    },

    row: {
        flexDirection: 'row',
        padding: 12,
        gap: 10,
    },

    option: {
        flex: 1,
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',

        paddingVertical: 12,
        borderRadius: T.radiusMd,

        backgroundColor: T.surfaceAlt,
        borderWidth: 1,
        borderColor: T.border,
    },

    optionActive: {
        backgroundColor: T.accent,
        borderColor: T.accent,
        ...T.shadowAccent,
    },

    label: {
        fontSize: 13,
        fontWeight: '700',
        color: T.textSecondary,
    },

    labelActive: {
        color: T.bg,
    },
});