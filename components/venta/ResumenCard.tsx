import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface ResumenCardProps {
  subtotal: number;
  descuento: number;
  total: number;
}

export function ResumenCard({ subtotal, descuento, total }: ResumenCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.summaryBlk}>
        <View style={styles.sRow}>
          <Text style={styles.sLbl}>Subtotal</Text>
          <Text style={styles.sVal}>S/.{subtotal}</Text>
        </View>

        <View style={styles.sRow}>
          <Text style={styles.sLbl}>Descuento</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={styles.discPill}>
              <Text style={styles.discText}>−10%</Text>
            </View>
            <Text style={styles.discVal}>−S/.{descuento ? descuento.toFixed(2) : descuento}</Text>
          </View>
        </View>

        <View style={styles.sDivider} />

        <View style={styles.sRow}>
          <Text style={styles.tLbl}>Total</Text>
          <Text style={styles.tVal}>S/.{total}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, backgroundColor: '#f7f7f7', overflow: 'hidden' },
  summaryBlk: { padding: 18 },
  sRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  sLbl: { fontSize: 15, color: 'gray' },
  sVal: { fontSize: 15, fontWeight: '600', color: '#000' },
  sDivider: { height: 1, backgroundColor: '#ebebeb', marginVertical: 10 },
  tLbl: { fontSize: 17, fontWeight: '800', color: '#000' },
  tVal: { fontSize: 26, fontWeight: '800', color: '#000', letterSpacing: -0.8 },
  discPill: { backgroundColor: '#000', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3 },
  discText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  discVal: { fontSize: 15, fontWeight: '700', color: '#000' },
});
