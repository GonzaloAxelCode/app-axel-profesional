import { useAppTheme } from '@/State/context/ThemeContext';
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

const getAvatarColor = (seed: string, AVATAR_COLORS: { bg: string; text: string }[]) =>
  AVATAR_COLORS[(seed?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

export function ClienteCard({ cliente, onBuscar }: ClienteCardProps) {
  const { T } = useAppTheme();
  const AVATAR_COLORS = [
    { bg: T.accent, text: T.bg },
    { bg: T.blue, text: T.bg },
    { bg: T.purple, text: T.bg },
    { bg: T.amber, text: T.bg },
    { bg: T.green, text: T.bg },
    { bg: T.accent6, text: T.bg },
  ];

  const makeStyles = (T: any) => StyleSheet.create({
    card: {
      backgroundColor: T.surface,
      borderRadius: T.radiusXl,
      borderWidth: 1,
      borderColor: T.border,
      overflow: 'hidden',
    },
    accentLine: {
      height: 1,
      opacity: 0.35,
    },
    head: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 12,
    },
    label: {
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 2,
      color: T.textMuted,
    },
    btnBuscar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: T.accent,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: T.radiusFull,
    },
    btnBuscarText: {
      color: T.bg,
      fontWeight: '800',
      fontSize: 12,
      letterSpacing: 0.3,
    },
    divider: {
      height: 1,
      backgroundColor: T.borderMedium,
      marginHorizontal: 16,
      opacity: 0.6,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 12,
    },
    avatar: {
      width: 46,
      height: 46,
      borderRadius: T.radiusFull,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    avatarText: {
      fontWeight: '900',
      fontSize: 14,
      letterSpacing: 0.5,
    },
    info: {
      flex: 1,
      minWidth: 0,
    },
    name: {
      fontSize: 15,
      fontWeight: '700',
      color: T.textPrimary,
    },
    docRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: 4,
    },
    docPill: {
      backgroundColor: T.surfaceElevated,
      borderRadius: 6,
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderWidth: 1,
      borderColor: '#252525',
    },
    docPillText: {
      fontSize: 11,
      color: T.textSecondary,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
    badgeOk: {
      width: 28,
      height: 28,
      borderRadius: T.radiusSm,
      backgroundColor: T.green + '1A',
      borderWidth: 1,
      borderColor: T.green + '38',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    footer: {
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: 16,
      paddingBottom: 14,
      paddingTop: 2,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: T.surfaceElevated,
      borderWidth: 1,
      borderColor: '#222',
      borderRadius: T.radiusFull,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    chipText: {
      fontSize: 11,
      color: T.textSecondary,
      fontWeight: '600',
    },
    avatarEmpty: {
      width: 46,
      height: 46,
      borderRadius: T.radiusFull,
      backgroundColor: T.surfaceAlt,
      borderWidth: 1,
      borderColor: '#282828',
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    emptyText: {
      flex: 1,
      color: T.textMuted,
      fontSize: 14,
    },
  });
  const styles = makeStyles(T);

  const hasCliente = cliente && (cliente.fullname !== '' || cliente.document !== '');
  const avatarScheme = hasCliente
    ? getAvatarColor(cliente?.fullname || '', AVATAR_COLORS)
    : null;

  return (
    <View style={styles.card}>
      {/* Accent top line */}
      <View style={styles.accentLine} />

      {/* ── Header ── */}
      <View style={styles.head}>
        <Text style={styles.label}>CLIENTE</Text>

        <TouchableOpacity style={styles.btnBuscar} onPress={onBuscar} activeOpacity={0.75}>
          <Icon name="magnify" size={13} color={T.bg} />
          <Text style={styles.btnBuscarText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Body ── */}
      {hasCliente ? (
        <>
          <View style={styles.row}>
            {/* Avatar */}
            <View
              style={[
                styles.avatar,
                { backgroundColor: avatarScheme!.bg + '20' },
              ]}
            >
              <Text style={[styles.avatarText, { color: avatarScheme!.bg }]}>
                {initials(cliente?.fullname || '')}
              </Text>
            </View>

            {/* Info */}
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>
                {cliente?.fullname}
              </Text>
              <View style={styles.docRow}>
                <Icon name="card-account-details-outline" size={11} color={T.textMuted} />
                <View style={styles.docPill}>
                  <Text style={styles.docPillText}>
                    DNI · {cliente?.document}
                  </Text>
                </View>
              </View>
            </View>

            {/* OK badge */}
            <View style={styles.badgeOk}>
              <Icon name="check" size={13} color={T.green} />
            </View>
          </View>

          {/* ── Footer chips ── */}
          {(cliente?.phone) && (
            <View style={styles.footer}>
              {cliente?.phone && (
                <View style={styles.chip}>
                  <Icon name="phone-outline" size={11} color={T.textMuted} />
                  <Text style={styles.chipText}>{cliente.phone}</Text>
                </View>
              )}

            </View>
          )}
        </>
      ) : (
        /* ── Empty state ── */
        <View style={styles.row}>
          <View style={styles.avatarEmpty}>
            <Icon name="account-outline" size={18} color={T.textMuted} />
          </View>
          <Text style={styles.emptyText}>Selecciona un cliente</Text>
          <Icon name="chevron-right" size={16} color={T.surfaceElevated} />
        </View>
      )}
    </View>
  );
}
