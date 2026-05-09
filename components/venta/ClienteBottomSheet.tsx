import { useClientes as useClientesHook } from '@/State/hooks/useClientes';
import { Cliente } from '@/State/models/cliente.models';
import T from '@/constants/THEME';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, Text } from 'react-native-paper';

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const AVATAR_COLORS = [
  T.accent,
  T.accent2,
  T.accent3,
  T.accent5,
];

type ClienteFilterKey = 'dni' | 'ruc';

interface ClienteBottomSheetProps {
  bottomSheetRef: RefObject<BottomSheet>;
  onClienteEncontrado: (cliente: Partial<Cliente>) => void;
  tipodoc: string;
}

export function ClienteBottomSheet({
  bottomSheetRef,
  onClienteEncontrado,
  tipodoc,
}: ClienteBottomSheetProps) {
  const snapPoints = useMemo(() => ['90%'], []);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<ClienteFilterKey>(
    tipodoc === 'ruc' ? 'ruc' : 'dni'
  );
  const [isSearchingApi, setIsSearchingApi] = useState(false);

  const { clientes, loading, getClienteByDocument } = useClientesHook();

  useEffect(() => {
    if (tipodoc === 'dni' || tipodoc === 'ruc') setActiveFilter(tipodoc);
  }, [tipodoc]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clientes.filter((c: Cliente) => {
      const nombre = c.fullname || c.firstname || '';
      const matchSearch =
        c.document?.includes(q) ||
        nombre.toLowerCase().includes(q);

      const matchFilter =
        (activeFilter === 'dni' && c.document?.length === 8) ||
        (activeFilter === 'ruc' && c.document?.length === 11);

      return matchSearch && matchFilter;
    });
  }, [clientes, search, activeFilter]);

  const handleBuscarAPI = useCallback(async () => {
    if (!search || search.length < 8) return;

    try {
      setIsSearchingApi(true);
      const data: any = await getClienteByDocument(search);

      if (data?.nombre_completo || data?.nombre_o_razon_social) {
        const clienteNormalizado: Partial<Cliente> = {
          fullname:
            data.nombre_o_razon_social ||
            data.nombre_completo ||
            '',
          document: data.numero || '',
        };

        onClienteEncontrado(clienteNormalizado);
        bottomSheetRef.current?.close();
        setSearch('');
      }
    } catch {

    } finally {
      setIsSearchingApi(false);
    }
  }, [search]);

  // ─────────────────────────────────────────────
  // ITEM
  // ─────────────────────────────────────────────
  const renderItem = useCallback(({ item }: { item: Cliente }) => {
    const nombre = item.fullname || item.firstname || '';
    const isRuc = item.document?.length === 11;

    const color =
      AVATAR_COLORS[
      (nombre?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length
      ];

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.card}
        onPress={() => {
          onClienteEncontrado({
            fullname:
              item.fullname ||
              `${item.lastname || ''} ${item.firstname || ''}`.trim(),
            document: item.document,
          });
          bottomSheetRef.current?.close();
        }}
      >
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: color + '20' }]}>
          <Text style={[styles.avatarText, { color }]}>
            {getInitials(nombre)}
          </Text>
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>
            {nombre || 'Sin nombre'}
          </Text>

          <Text style={styles.doc}>
            {isRuc ? 'RUC' : 'DNI'} • {item.document}
          </Text>
        </View>

        {/* Badge */}
        <View
          style={[
            styles.badge,
            { backgroundColor: isRuc ? T.purple + '20' : T.green + '20' },
          ]}
        >
          <Text
            style={{
              color: isRuc ? T.purple : T.green,
              fontWeight: '700',
              fontSize: 11,
            }}
          >
            {isRuc ? 'RUC' : 'DNI'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  // ─────────────────────────────────────────────
  // HEADER
  // ─────────────────────────────────────────────
  const ListHeader = useMemo(() => (
    <View style={{ paddingHorizontal: 14 }}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Clientes</Text>
        <Text style={styles.counter}>{filtered.length}</Text>
      </View>


      {/* Search */}
      <View style={styles.search}>
        <Icon source="magnify" size={18} color={T.textMuted} />
        <TextInput
          placeholder="Buscar cliente..."
          placeholderTextColor={T.textMuted}
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>

      {/* API Button */}
      {filtered.length === 0 && search.length >= 8 && (
        <TouchableOpacity
          style={styles.apiBtn}
          onPress={handleBuscarAPI}
          disabled={isSearchingApi}
        >
          {isSearchingApi ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.apiText}>
              Buscar en SUNAT
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  ), [filtered.length, search, activeFilter]);

  useEffect(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        opacity={1.5}          // 0.0 – 1.0  (default es ~0.5)

        disappearsOnIndex={-1}
      />
    ),
    []
  );
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: T.bg }}
      handleIndicatorStyle={{ backgroundColor: T.textMuted, width: 40 }}
    >
      {ListHeader}
      <BottomSheetFlatList
        data={filtered}
        keyExtractor={(item: any) => item.document}
        renderItem={renderItem}

        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {loading ? 'Cargando...' : 'Sin resultados'}
          </Text>
        }
      />
    </BottomSheet>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    color: T.textPrimary,
  },

  counter: {
    fontSize: 14,
    color: T.textSecondary,
  },

  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: T.radiusFull,
    backgroundColor: T.surfaceAlt,
  },

  tabActive: {
    backgroundColor: T.accent,
  },

  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textSecondary,
  },

  tabTextActive: {
    color: '#fff',
  },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: T.radiusMd,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: T.border,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    color: T.textPrimary,
  },

  apiBtn: {
    backgroundColor: T.accent,
    padding: 14,
    borderRadius: T.radiusMd,
    alignItems: 'center',
    marginBottom: 12,
  },

  apiText: {
    color: '#fff',
    fontWeight: '700',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: T.radiusLg,
    backgroundColor: T.surface,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: T.border,
    ...T.shadowCard,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: T.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontWeight: '800',
    fontSize: 16,
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
    color: T.textPrimary,
  },

  doc: {
    fontSize: 12,
    color: T.textSecondary,
    marginTop: 2,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: T.radiusSm,
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: T.textMuted,
  },
});

// ─────────────────────────────────────────────
const getInitials = (nombre: string) =>
  nombre
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');