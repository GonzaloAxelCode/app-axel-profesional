
import T from '@/constants/THEME';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

export type PayMethod = 'Efectivo' | 'PLIN' | 'YAPE';

const PAY_OPTIONS: { key: PayMethod; label: string; icon: string; color: string }[] =
  [
    { key: 'Efectivo', label: 'Efectivo', icon: 'cash', color: T.green },
    { key: 'PLIN', label: 'PLIN', icon: 'cellphone', color: T.blue },
    { key: 'YAPE', label: 'YAPE', icon: 'qrcode-scan', color: T.purple },
  ];

interface PagoCardProps {
  payMethod: PayMethod;
  onSelect: (method: PayMethod) => void;
}

export function PagoCard({ payMethod, onSelect }: PagoCardProps) {
  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>MÉTODO DE PAGO</Text>
      </View>

      {/* OPTIONS */}
      <View style={styles.row}>
        {PAY_OPTIONS.map(opt => {
          const isActive = payMethod === opt.key;

          return (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.option,
                isActive && [
                  styles.optionActive,
                  { borderColor: opt.color, backgroundColor: opt.color },
                ],
              ]}
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
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    backgroundColor: T.surfaceAlt,
  },

  title: {
    fontSize: 11,
    fontWeight: '800',
    color: T.textMuted,
    letterSpacing: 1.2,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
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
    transform: [{ scale: 1.02 }],
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