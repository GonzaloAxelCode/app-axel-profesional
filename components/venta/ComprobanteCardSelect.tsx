import { useAppTheme } from '@/State/context/ThemeContext';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

export type ComprobanteMethod = 'Boleta' | 'Factura' | 'Anonima';

const COMPROBANTE_OPTIONS: {
    key: ComprobanteMethod;
    label: string;
    icon: string;
    description: string;
}[] = [
        {
            key: 'Boleta',
            label: 'Boleta',
            icon: 'receipt',
            description: 'Para personas naturales.',
        },
        {
            key: 'Factura',
            label: 'Factura',
            icon: 'file-document-outline',
            description: 'Requiere RUC válido.',
        },
        {
            key: 'Anonima',
            label: 'Anónima',
            icon: 'incognito',
            description: 'Sin comprobante.',
        },
    ];

interface ComprobanteCardProps {
    comprobanteMethod: ComprobanteMethod;
    onSelect: (method: ComprobanteMethod) => void;
}

export function ComprobanteCardSelect({
    comprobanteMethod,
    onSelect,
}: ComprobanteCardProps) {
    const { T } = useAppTheme();
    const makeStyles = (T: any) => StyleSheet.create({
        wrapper: {
            gap: 10,
            backgroundColor: T.surfaceAlt,
            borderRadius: T.radiusLg,
            padding: 14,
        },
        sectionTitle: {
            fontSize: 13,
            fontWeight: '700',
            color: T.textMuted,
            paddingHorizontal: 2,
        },
        list: {
            flexDirection: 'row',
            gap: 8,
        },
        card: {
            flex: 1,
            position: 'relative',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            backgroundColor: T.surface,
            borderRadius: T.radiusMd,
            borderWidth: 1.5,
            borderColor: T.border,
            padding: 14,
        },
        cardActive: {
            borderColor: T.accent,
            backgroundColor: T.accentDim,
        },
        iconBox: {
            width: 44,
            height: 44,
            borderRadius: T.radiusMd,
            backgroundColor: T.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconBoxActive: {
            backgroundColor: T.accent,
        },
        textBox: {
            alignItems: 'center',
            gap: 2,
        },
        label: {
            fontSize: 13,
            fontWeight: '700',
            color: T.textPrimary,
            textAlign: 'center',
        },
        labelActive: {
            color: T.textPrimary,
        },
        description: {
            fontSize: 10,
            color: T.textMuted,
            lineHeight: 14,
            textAlign: 'center',
        },
        check: {
            position: 'absolute',
            top: 8,
            right: 8,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: T.accent,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
    const styles = makeStyles(T);

    return (
        <View style={styles.wrapper}>
            <Text style={styles.sectionTitle}>Tipo de comprobante</Text>

            <View style={styles.list}>
                {COMPROBANTE_OPTIONS.map((opt) => {
                    const isActive = comprobanteMethod === opt.key;

                    return (
                        <TouchableOpacity
                            key={opt.key}
                            style={[styles.card, isActive && styles.cardActive]}
                            onPress={() => onSelect(opt.key)}
                            activeOpacity={0.85}
                        >
                            {/* CHECK esquina */}
                            {isActive && (
                                <View style={styles.check}>
                                    <Icon source="check" size={12} color="#0A0A0A" />
                                </View>
                            )}

                            {/* ICONO */}
                            <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
                                <Icon
                                    source={opt.icon as any}
                                    size={22}
                                    color={isActive ? '#0A0A0A' : T.textMuted}
                                />
                            </View>

                            {/* TEXTO */}
                            <View style={styles.textBox}>
                                <Text style={[styles.label, isActive && styles.labelActive]}>
                                    {opt.label}
                                </Text>
                                <Text style={styles.description}>{opt.description}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
