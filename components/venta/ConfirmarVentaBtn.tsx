import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

interface ConfirmarVentaBtnProps {
  total: number;
  onConfirmar: () => void;
  loading: boolean;
  disabled: boolean;
}

export function ConfirmarVentaBtn({
  total,
  onConfirmar,
  loading,
  disabled,
}: ConfirmarVentaBtnProps) {
  const { T } = useAppTheme();

  const isOff = loading || disabled;

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onConfirmar}
        disabled={isOff}
        style={[
          styles.btn,
          {
            backgroundColor: loading ? T.accent : disabled ? T.surface : T.accent,
          },
        ]}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={T.bg} />
            <Text style={[styles.loadingText, { color: T.bg }]}>Procesando venta...</Text>
          </View>
        ) : disabled ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={T.textMuted} />
            <Text style={[styles.loadingText, { color: T.textMuted }]}>Selecciona productos</Text>
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.left}>
              <Text style={[styles.label, { color: T.bg }]}>
                Confirmar venta
              </Text>
              <Text style={[styles.total, { color: T.bg }]}>
                S/ {total.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Icon name="arrow-right" size={20} color={T.bg} />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  btn: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  left: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  total: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
