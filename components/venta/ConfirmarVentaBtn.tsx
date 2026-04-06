import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

interface ConfirmarVentaBtnProps {
  total: number;
  onConfirmar: () => void;
}

export function ConfirmarVentaBtn({ total, onConfirmar }: ConfirmarVentaBtnProps) {
  return (
    <View style={styles.ctaWrap}>
      <View style={styles.ctaBorder}>
        <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85} onPress={onConfirmar}>
          <View style={styles.ctaLeft}>
            <View style={styles.ctaIcon}>
              <Icon name="check" size={14} color="#000" />
            </View>
            <Text style={styles.ctaText}>Confirmar venta</Text>
          </View>
          <Text style={styles.ctaPrice}>S/.{total}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ctaWrap: { padding: 15, paddingBottom: 36 },
  ctaBorder: { borderWidth: 2.5, borderColor: '#000', borderRadius: 50, padding: 2 },
  ctaBtn: { backgroundColor: '#000', borderRadius: 50, paddingVertical: 18, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctaLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ctaIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: 21, fontWeight: '800', color: '#fff' },
  ctaPrice: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
});
