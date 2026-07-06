import T from '@/constants/THEME';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

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


      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title}>Nueva venta</Text>
        <Text style={styles.subtitle}>
          {fechaFormateada} · {horaFormateada}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,

    paddingTop: 32,
    paddingBottom: 12,
    backgroundColor: T.bg,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',

  },

  content: {
    marginTop: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: T.textPrimary,
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 14,
    color: T.textSecondary,
    marginTop: 6,
  },
});