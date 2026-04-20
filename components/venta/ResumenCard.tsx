import { C } from '@/State/utils/c';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface ResumenCardProps {
  subtotal: number;
  descuento: number;
  total: number;
  igv: number;
}

export function ResumenCard({ subtotal, descuento, total, igv = 0 }: ResumenCardProps) {
  const descPct = subtotal > 0 ? ((descuento / subtotal) * 100).toFixed(0) : '0';

  return (
    <View style={rStyles.card}>
      <View style={rStyles.cardHead}>
        <Text style={rStyles.secLabel}>RESUMEN</Text>
      </View>
      <View style={rStyles.body}>
        <View style={rStyles.row}>
          <Text style={rStyles.label}>Subtotal</Text>
          <Text style={rStyles.value}>S/ {subtotal.toFixed(2)}</Text>
        </View>
        <View style={rStyles.divider} />

        <View style={rStyles.row}>
          <Text style={rStyles.label}>Descuento</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {descuento > 0 && (
              <View style={rStyles.discPill}>
                <Text style={rStyles.discPct}>{descPct}%</Text>
              </View>
            )}
            <Text style={[rStyles.value, descuento > 0 && { color: C.red }]}>
              -{' '}S/ {descuento ? descuento.toFixed(2) : '0.00'}
            </Text>
          </View>
        </View>
        <View style={rStyles.divider} />

        <View style={rStyles.row}>
          <Text style={rStyles.label}>IGV (18%)</Text>
          <Text style={rStyles.value}>S/ {igv.toFixed(2)}</Text>
        </View>

        <View style={rStyles.totalSep} />

        <View style={rStyles.totalRow}>
          <Text style={rStyles.totalLabel}>Total</Text>
          <Text style={rStyles.totalValue}>S/ {total.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

const rStyles = StyleSheet.create({
  card: {
    borderRadius: 16, backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border, overflow: 'hidden',
  },
  cardHead: {
    padding: 14, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  secLabel: { fontSize: 10, fontWeight: '800', color: C.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' },
  body: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  label: { fontSize: 14, color: C.textSecondary },
  value: { fontSize: 14, fontWeight: '600', color: C.textPrimary },
  divider: { height: 1, backgroundColor: C.border },
  discPill: {
    backgroundColor: C.red + '18', borderRadius: 8,
    paddingHorizontal: 7, paddingVertical: 2,
    borderWidth: 1, borderColor: C.red + '30',
  },
  discPct: { fontSize: 10, fontWeight: '700', color: C.red },
  totalSep: { height: 1, backgroundColor: C.border, marginVertical: 8 },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 4,
  },
  totalLabel: { fontSize: 15, fontWeight: '800', color: C.textPrimary },
  totalValue: { fontSize: 28, fontWeight: '900', color: C.accent, letterSpacing: -1 },
});