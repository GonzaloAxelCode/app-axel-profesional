import { useClientes } from '@/State/hooks/useClientes';
import { Cliente } from '@/State/models/cliente.models';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { RefObject, useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';

// ─── helpers ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#111', '#1e88e5', '#43a047', '#e53935', '#8e24aa'];

const getAvatarColor = (nombre: string) => {
  if (!nombre || nombre.length === 0) return '#111';
  return AVATAR_COLORS[nombre.charCodeAt(0) % AVATAR_COLORS.length];
};

const getInitials = (nombre: string) =>
  nombre
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');

// ─── types ───────────────────────────────────────────────────────────────────

type FilterKey = 'todos' | 'dni' | 'ruc';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'dni', label: 'DNI' },
  { key: 'ruc', label: 'RUC' },
];

interface ClienteBottomSheetProps {
  bottomSheetRef: RefObject<BottomSheet>;
  onClienteEncontrado: (cliente: Partial<Cliente>) => void;
}

// ─── sub-components ──────────────────────────────────────────────────────────

function AvatarCircle({ nombre }: { nombre: string }) {
  const color = getAvatarColor(nombre);
  return (
    <View style={[styles.avatar, { backgroundColor: color }]}>
      <Text style={styles.avatarText}>{getInitials(nombre) || '?'}</Text>
    </View>
  );
}

function FooterLoader({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;
  return (
    <View style={styles.footerLoader}>
      <ActivityIndicator size="small" color="#6b7280" />
      <Text style={styles.footerLoaderText}>Cargando más...</Text>
    </View>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function ClienteBottomSheet({
  bottomSheetRef,
  onClienteEncontrado,
}: ClienteBottomSheetProps) {
  const snapPoints = useMemo(() => ['100%'], []);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todos');
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isSearchingApi, setIsSearchingApi] = useState(false);

  const { clientes, loading, getClienteByDocument } = useClientes();

  // ─── Filtrado ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clientes.filter((c: Cliente) => {
      const nombre = c.fullname || c.firstname || '';
      const matchSearch =
        c.document?.includes(q) ||
        nombre.toLowerCase().includes(q);

      const matchFilter =
        activeFilter === 'todos' ||
        (activeFilter === 'dni' && c.document?.length === 8) ||
        (activeFilter === 'ruc' && c.document?.length === 11);

      return matchSearch && matchFilter;
    });
  }, [clientes, search, activeFilter]);

  // ─── Buscar en SUNAT/API ──────────────────────────────────────────────────
  const handleBuscarAPI = useCallback(async () => {
    if (!search || search.length < 8) return;
    try {
      setIsSearchingApi(true);
      const data: any = await getClienteByDocument(search);
      if (data?.nombre_completo || data?.nombre_o_razon_social) {
        const clienteNormalizado: Partial<Cliente> = {
          fullname: data.nombre_o_razon_social || data.nombre_completo || '',
          document: data.numero || '',
        };
        onClienteEncontrado(clienteNormalizado);
        bottomSheetRef.current?.close();
        setSearch('');
      }
    } catch {
      console.log('No encontrado en API');
    } finally {
      setIsSearchingApi(false);
    }
  }, [search, getClienteByDocument, onClienteEncontrado, bottomSheetRef]);

  // ─── Infinity scroll ──────────────────────────────────────────────────────
  const handleEndReached = useCallback(async () => {
    if (isFetchingMore || loading) return;
    // Aquí conectas tu loadMore si el hook lo soporta
    // setIsFetchingMore(true);
    // await loadMore?.();
    // setIsFetchingMore(false);
  }, [isFetchingMore, loading]);

  // ─── Render item ──────────────────────────────────────────────────────────
  const renderItem = useCallback(
    ({ item }: { item: Cliente }) => {
      const nombre = item.fullname || item.firstname || '';
      const isRuc = item.document?.length === 11;

      return (
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.card}
          onPress={() => {
            const clienteNormalizado: any = {
              fullname:
                item.fullname ||
                `${item.lastname || ''} ${item.firstname || ''}`.trim(),
              document: item.document,
            };
            onClienteEncontrado(clienteNormalizado);
            bottomSheetRef.current?.close();
          }}
        >
          {/* Avatar */}
          <AvatarCircle nombre={nombre} />

          {/* Info */}
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.cardName} numberOfLines={1}>
                {nombre || 'Sin nombre'}
              </Text>
              <View style={[styles.badge, isRuc ? styles.badge_ruc : styles.badge_dni]}>
                <Text style={[styles.badgeText, isRuc ? styles.badgeText_ruc : styles.badgeText_dni]}>
                  {isRuc ? 'RUC' : 'DNI'}
                </Text>
              </View>
            </View>

            <Text style={styles.cardDoc}>
              {isRuc ? 'RUC' : 'DNI'}: {item.document}
            </Text>

            {/* Stats row */}
            <View style={styles.divider} />
            <View style={styles.statsRow}>
              <View style={styles.statCell}>
                <Text style={styles.statLabel}>Documento</Text>
                <Text style={styles.statValue}>{item.document}</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statLabel}>Tipo</Text>
                <Text style={styles.statValue}>{isRuc ? 'Empresa' : 'Persona'}</Text>
              </View>
              {item.email ? (
                <View style={styles.statCell}>
                  <Text style={styles.statLabel}>Email</Text>
                  <Text style={styles.statValue} numberOfLines={1}>
                    {item.email}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [bottomSheetRef, onClienteEncontrado]
  );

  // ─── Header ───────────────────────────────────────────────────────────────
  const ListHeader = useMemo(
    () => (
      <>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Buscar cliente</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {filtered.length} cliente{filtered.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Búsqueda */}
        <View style={styles.searchWrap}>
          <TextInput
            placeholder="Buscar por nombre, DNI o RUC..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            keyboardType="default"
            style={styles.searchInput}
          />
        </View>

        {/* Botón buscar en SUNAT — solo si no hay resultados locales y hay 8+ dígitos */}
        {filtered.length === 0 && search.length >= 8 && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.apiButton, isSearchingApi && styles.apiButtonDisabled]}
            onPress={handleBuscarAPI}
            disabled={isSearchingApi}
          >
            {isSearchingApi ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : null}
            <Text style={styles.apiButtonText}>
              {isSearchingApi ? 'Buscando...' : 'Buscar en SUNAT / API'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Filtros */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setActiveFilter(f.key)}
              style={[
                styles.filterTab,
                activeFilter === f.key && styles.filterTabActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === f.key && styles.filterTabTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Etiqueta sección */}
        <Text style={styles.sectionLabel}>
          {search || activeFilter !== 'todos' ? 'Resultados' : 'Clientes'}
        </Text>
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtered.length, search, activeFilter, isSearchingApi]
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      handleIndicatorStyle={styles.dragHandle}
    >
      <BottomSheetFlatList
        data={filtered}
        keyExtractor={(item: any) => item.document}
        renderItem={renderItem}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={<FooterLoader isLoading={isFetchingMore} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Cargando clientes...' : 'No se encontraron clientes'}
          </Text>
        }
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={10}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </BottomSheet>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // sheet
  sheetContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 4 },
  dragHandle: { backgroundColor: '#d1d5db', width: 36, height: 4 },

  // header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 8,
  },
  title: { fontSize: 20, fontWeight: '500', color: '#111' },
  countBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  countText: { fontSize: 12, color: '#6b7280' },

  // search
  searchWrap: { marginBottom: 14 },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111',
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },

  // api button
  apiButton: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  apiButtonDisabled: { opacity: 0.6 },
  apiButtonText: { color: '#fff', fontSize: 14, fontWeight: '500' },

  // filter tabs
  filterRow: { flexDirection: 'row', gap: 8, paddingBottom: 14 },
  filterTab: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  filterTabActive: { backgroundColor: '#111', borderColor: '#111' },
  filterTabText: { fontSize: 13, fontWeight: '500', color: '#6b7280' },
  filterTabTextActive: { color: '#fff' },

  // section label
  sectionLabel: {
    fontSize: 11,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 4,
  },

  // card
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },

  // avatar
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // card body
  cardBody: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
    lineHeight: 18,
  },
  cardDoc: { fontSize: 11, color: '#9ca3af', marginTop: 3, letterSpacing: 0.3 },

  // badges
  badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '500' },
  badge_dni: { backgroundColor: '#EAF3DE' },
  badgeText_dni: { color: '#3B6D11' },
  badge_ruc: { backgroundColor: '#EEF2FF' },
  badgeText_ruc: { color: '#3730A3' },

  // divider
  divider: { height: 0.5, backgroundColor: '#e5e7eb', marginVertical: 7 },

  // stats
  statsRow: { flexDirection: 'row', gap: 0 },
  statCell: { flex: 1 },
  statLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: { fontSize: 12, fontWeight: '500', color: '#111', marginTop: 1 },

  // empty
  emptyText: {
    textAlign: 'center',
    paddingVertical: 32,
    color: '#9ca3af',
    fontSize: 14,
  },

  // footer loader
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  footerLoaderText: { fontSize: 13, color: '#9ca3af' },
});