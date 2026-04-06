import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { IconButton, MD3Colors, Text } from 'react-native-paper';

interface VentaHeaderProps {
  numeroVenta?: string;
  fecha?: string;
}

export function VentaHeader({ numeroVenta = '#V-00421', fecha = '3 abr 2026' }: VentaHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.hTitle}>Nueva{' '}venta</Text>
          <Text style={styles.hSub}>{numeroVenta} · {fecha}</Text>
        </View>
      </View>
      <IconButton
        icon="close"
        size={30}
        style={styles.closeBtn}
        onPress={() => router.back()}
        iconColor={MD3Colors.neutral10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 22, paddingTop: 28, paddingBottom: 16, position: 'relative' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  hTitle: { fontSize: 34, fontWeight: '800', color: '#000', letterSpacing: -1, lineHeight: 36, paddingTop: 25 },
  hSub: { fontSize: 15, color: 'black', marginTop: 6 },
  closeBtn: { width: 60, height: 60, borderRadius: 50, position: 'absolute', right: 1, top: 30 },
});
