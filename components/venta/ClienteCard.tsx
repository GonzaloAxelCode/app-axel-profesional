import { Cliente } from '@/State/models/cliente.models';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

interface ClienteCardProps {
  cliente: Cliente | null;
  onBuscar: () => void;
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

// 🔥 Genera un color random basado en el nombre
const getRandomColor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

export function ClienteCard({ cliente, onBuscar }: ClienteCardProps) {
  const avatarColor = cliente ? getRandomColor(cliente.fullname) : '#f0f0f0';

  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Text style={styles.secLabel}>CLIENTE</Text>
        <TouchableOpacity style={styles.secAction} onPress={onBuscar}>
          <Icon name="magnify" size={11} color="#fff" />
          <Text style={styles.secActionText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {cliente ? (
        <View style={styles.clientRow}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{initials(cliente.fullname)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.clientName}>{cliente.fullname}</Text>
            <Text style={styles.prodMeta}>Documento · {cliente.document}</Text>
          </View>
          <Icon name="chevron-right" size={18} color="#ccc" />
        </View>
      ) : (
        <View style={styles.clientRow}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Icon name="account-outline" size={16} color="#ccc" />
          </View>
          <Text style={styles.ghostText}>Ningún cliente seleccionado</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, backgroundColor: '#f7f7f7', overflow: 'hidden' },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 18,
  },
  secLabel: { fontSize: 14, fontWeight: '800', color: '#000', letterSpacing: 1 },
  secAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#000',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  secActionText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 18,
    paddingBottom: 16,
    gap: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  clientName: { fontSize: 16, fontWeight: '700', color: '#000' },
  prodMeta: { fontSize: 14, color: 'black', marginTop: 2 },
  ghostText: { fontSize: 15, color: 'gray' },
});