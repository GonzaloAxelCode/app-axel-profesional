// ═══════════════════════════════════════════════════════════════════════════════
// ClienteCard.tsx
// ═══════════════════════════════════════════════════════════════════════════════
import { Cliente } from '@/State/models/cliente.models';
import { C } from '@/State/utils/c';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

interface ClienteCardProps {
  cliente: Cliente | null;
  onBuscar: () => void;
}

const initials = (name: string) =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const AVATAR_COLORS = [C.accent, '#6ee7b7', '#93c5fd', '#f9a8d4', C.yellow, C.purple];
const getAvatarColor = (seed: string) =>
  AVATAR_COLORS[(seed?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

export function ClienteCard({ cliente, onBuscar }: ClienteCardProps) {
  const hasCliente = cliente && (cliente.fullname !== '' || cliente.document !== '');
  const avatarColor = hasCliente ? getAvatarColor(cliente?.fullname || '') : C.textMuted;

  return (
    <View style={cStyles.card}>
      <View style={cStyles.cardHead}>
        <Text style={cStyles.secLabel}>CLIENTE</Text>
        <TouchableOpacity style={cStyles.secAction} onPress={onBuscar}>
          <Icon name="magnify" size={12} color={C.bg} />
          <Text style={cStyles.secActionText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {hasCliente ? (
        <View style={cStyles.clientRow}>
          <View style={[cStyles.avatar, { backgroundColor: avatarColor + '20', borderColor: avatarColor + '40', borderWidth: 1.5 }]}>
            <Text style={[cStyles.avatarText, { color: avatarColor }]}>{initials(cliente?.fullname || '')}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={cStyles.clientName}>{cliente?.fullname}</Text>
            <Text style={cStyles.prodMeta}>Documento · {cliente?.document}</Text>
          </View>
          <View style={cStyles.checkBadge}>
            <Icon name="check" size={14} color={C.green} />
          </View>
        </View>
      ) : (
        <View style={cStyles.clientRow}>
          <View style={[cStyles.avatar, { backgroundColor: C.surfaceAlt, borderColor: C.border, borderWidth: 1 }]}>
            <Icon name="account-outline" size={18} color={C.textMuted} />
          </View>
          <Text style={cStyles.ghostText}>Selecciona un cliente</Text>
          <Icon name="chevron-right" size={16} color={C.textMuted} />
        </View>
      )}
    </View>
  );
}

const cStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  secLabel: { fontSize: 10, fontWeight: '800', color: C.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' },
  secAction: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.accent, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  secActionText: { fontSize: 13, fontWeight: '700', color: C.bg },
  clientRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, paddingHorizontal: 16, gap: 12,
  },
  avatar: {
    width: 42, height: 42, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  avatarText: { fontSize: 15, fontWeight: '800' },
  clientName: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
  prodMeta: { fontSize: 12, color: C.textSecondary, marginTop: 2 },
  ghostText: { fontSize: 14, color: C.textMuted, flex: 1 },
  checkBadge: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: C.green + '15',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.green + '30',
  },
});
