import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

export type PayMethod = 'efectivo' | 'tarjeta' | 'yape';

const PAY_OPTIONS: { key: PayMethod; label: string }[] = [
  { key: 'efectivo', label: 'Efectivo' },
  { key: 'tarjeta', label: 'Tarjeta' },
  { key: 'yape', label: 'Yape' },
];

interface PagoCardProps {
  payMethod: PayMethod;
  onSelect: (method: PayMethod) => void;
}

export function PagoCard({ payMethod, onSelect }: PagoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Text style={styles.secLabel}>PAGO</Text>
      </View>
      <View style={styles.payRow}>
        {PAY_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.payOpt, payMethod === opt.key && styles.payActive]}
            onPress={() => onSelect(opt.key)}
          >
            <Text style={[styles.payLabel, payMethod === opt.key && styles.payLabelActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, backgroundColor: '#f7f7f7', overflow: 'hidden' },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingHorizontal: 18 },
  secLabel: { fontSize: 14, fontWeight: '800', color: '#000', letterSpacing: 1 },
  payRow: { flexDirection: 'row', gap: 8, padding: 10, paddingHorizontal: 16, paddingBottom: 16 },
  payOpt: { flex: 1, paddingVertical: 12, borderRadius: 50, alignItems: 'center', backgroundColor: '#fff' },
  payActive: { backgroundColor: '#000' },
  payLabel: { fontSize: 15, fontWeight: '700', color: 'black' },
  payLabelActive: { color: '#fff' },
});
