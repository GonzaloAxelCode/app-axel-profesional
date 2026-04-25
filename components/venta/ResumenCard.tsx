
import T from '@/constants/THEME';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export function ResumenCard({ subtotal, descuento, total, igv = 0 }: any) {
  const descPct = subtotal > 0 ? ((descuento / subtotal) * 100).toFixed(0) : '0';

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.label}>RESUMEN</Text>
      </View>

      <View style={styles.body}>
        <Row label="Subtotal" value={`S/ ${subtotal.toFixed(2)}`} />

        <Row
          label="Descuento"
          value={
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              {descuento > 0 && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{descPct}%</Text>
                </View>
              )}
              <Text style={[styles.value, descuento > 0 && { color: T.red }]}>
                - S/ {descuento.toFixed(2)}
              </Text>
            </View>
          }
        />

        <Row label="IGV" value={`S/ ${igv.toFixed(2)}`} />

        <View style={styles.sep} />

        <View style={styles.total}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>S/ {total.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

const Row = ({ label, value }: any) => (
  <View style={styles.row}>
    <Text style={styles.text}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.surface,
    borderRadius: T.radiusLg,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
    ...T.shadowCard,
  },

  head: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    backgroundColor: T.surfaceAlt,
  },

  label: {
    fontSize: 11,
    fontWeight: '800',
    color: T.textMuted,
  },

  body: {
    padding: 16,
    gap: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  text: {
    color: T.textSecondary,
    fontSize: 13,
  },

  value: {
    color: T.textPrimary,
    fontWeight: '600',
  },

  pill: {
    backgroundColor: T.red + '15',
    borderRadius: T.radiusSm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  pillText: {
    color: T.red,
    fontSize: 10,
    fontWeight: '700',
  },

  sep: {
    height: 1,
    backgroundColor: T.border,
    marginVertical: 6,
  },

  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontWeight: '800',
    color: T.textPrimary,
  },

  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: T.accent,
  },
});