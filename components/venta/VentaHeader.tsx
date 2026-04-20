import { C } from '@/State/utils/c';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { IconButton, MD3Colors, Text } from 'react-native-paper';

interface VentaHeaderProps {
  fecha?: Date;
}

export function VentaHeader({ fecha = new Date() }: VentaHeaderProps) {

  const fechaFormateada = fecha.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const horaFormateada = fecha.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.hTitle}>Nueva venta</Text>
          <Text style={styles.hSub}>
            {fechaFormateada} · {horaFormateada}
          </Text>
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
  header: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 16,
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  hTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -1,
    lineHeight: 36,
    paddingTop: 25,
  },
  hSub: {
    fontSize: 15,
    color: C.textSecondary,
    marginTop: 6,
  },
  closeBtn: {
    width: 60,
    height: 60,
    borderRadius: 50,
    position: 'absolute',
    right: 1,
    top: 30,
  },
});