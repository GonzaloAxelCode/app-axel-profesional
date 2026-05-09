import T from '@/constants/THEME';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

export type PayMethod = 'Efectivo' | 'PLIN' | 'YAPE';

const PAY_OPTIONS: {
  key: PayMethod;
  label: string;
  icon: string;
  description: string;
}[] = [
    {
      key: 'Efectivo',
      label: 'Efectivo',
      icon: 'cash',
      description: 'Pago en físico al momento.',
    },
    {
      key: 'PLIN',
      label: 'PLIN',
      icon: 'cellphone',
      description: 'Transferencia vía PLIN.',
    },
    {
      key: 'YAPE',
      label: 'YAPE',
      icon: 'qrcode-scan',
      description: 'Escanea tu QR de Yape.',
    },
  ];

interface PagoCardProps {
  payMethod: PayMethod;
  onSelect: (method: PayMethod) => void;
}

export function PagoCard({ payMethod, onSelect }: PagoCardProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Método de pago</Text>

      <View style={styles.list}>
        {PAY_OPTIONS.map((opt) => {
          const isActive = payMethod === opt.key;

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

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
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
    borderRadius: T.radiusLg,
    borderWidth: 1.5,
    borderColor: T.border,
    padding: 14,
    ...T.shadowCard,
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