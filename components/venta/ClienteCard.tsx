
import T from '@/constants/THEME';
import { Cliente } from '@/State/models/cliente.models';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

interface ClienteCardProps {
  cliente: Cliente | null;
  onBuscar: () => void;
}

const initials = (name: string) =>
  name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

const AVATAR_COLORS = [
  T.accent,
  T.blue,
  T.green,
  T.purple,
  T.amber,
  T.accent6,
];

const getAvatarColor = (seed: string) =>
  AVATAR_COLORS[(seed?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

export function ClienteCard({ cliente, onBuscar }: ClienteCardProps) {
  const hasCliente = cliente && (cliente.fullname !== '' || cliente.document !== '');
  const avatarColor = hasCliente
    ? getAvatarColor(cliente?.fullname || '')
    : T.textMuted;

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.label}>CLIENTE</Text>

        <TouchableOpacity style={styles.action} onPress={onBuscar}>
          <Icon name="magnify" size={14} color={T.bg} />
          <Text style={styles.actionText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {hasCliente ? (
        <View style={styles.row}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: avatarColor + '20',

              },
            ]}
          >
            <Text style={[styles.avatarText, { color: avatarColor }]}>
              {initials(cliente?.fullname || '')}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{cliente?.fullname}</Text>
            <Text style={styles.meta}>Documento · {cliente?.document}</Text>
          </View>

          <View style={styles.ok}>
            <Icon name="check" size={14} color={T.green} />
          </View>
        </View>
      ) : (
        <View style={styles.row}>
          <View style={styles.avatarEmpty}>
            <Icon name="account-outline" size={18} color={T.textMuted} />
          </View>
          <Text style={styles.empty}>Selecciona un cliente</Text>
          <Icon name="chevron-right" size={16} color={T.textMuted} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.surface,
    borderRadius: T.radiusLg,
    borderWidth: 0,
    borderColor: T.border,
    overflow: 'hidden',
    ...T.shadowCard,
  },

  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 0,
    borderBottomColor: T.border,

  },

  label: {
    fontSize: 11,
    fontWeight: '800',
    color: T.textMuted,
    letterSpacing: 1.2,
  },

  action: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: T.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: T.radiusFull,
    alignItems: 'center',
  },

  actionText: {
    color: T.bg,
    fontWeight: '700',
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: T.radiusFull,
    justifyContent: 'center',
    alignItems: 'center',

  },

  avatarText: {
    fontWeight: '800',
  },

  avatarEmpty: {
    width: 44,
    height: 44,
    borderRadius: T.radiusFull,
    backgroundColor: T.surfaceAlt,
    borderWidth: 0,
    borderColor: T.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
    color: T.textPrimary,
  },

  meta: {
    fontSize: 12,
    color: T.textSecondary,
    marginTop: 2,
  },

  empty: {
    flex: 1,
    color: T.textMuted,
    fontSize: 14,
  },

  ok: {
    width: 28,
    height: 28,
    borderRadius: T.radiusSm,
    backgroundColor: T.green + '18',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.green + '30',
  },
});