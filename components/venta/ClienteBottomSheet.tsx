import { Cliente } from '@/State/models/cliente.models';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, Text } from 'react-native-paper';







// ═══════════════════════════════════════════════════════════════════════════════
// ClienteBottomSheet.tsx
// ═══════════════════════════════════════════════════════════════════════════════
import { useClientes as useClientesHook } from '@/State/hooks/useClientes';
import { C } from '@/State/utils/c';

// ─── helpers ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#111', '#1e88e5', '#43a047', '#e53935', '#8e24aa'];

type ClienteFilterKey = 'dni' | 'ruc';

interface ClienteBottomSheetProps {
  bottomSheetRef: RefObject<BottomSheet>;
  onClienteEncontrado: (cliente: Partial<Cliente>) => void;
  tipodoc: string;
}

export function ClienteBottomSheet({ bottomSheetRef, onClienteEncontrado, tipodoc }: ClienteBottomSheetProps) {
  const snapPoints = useMemo(() => ['100%'], []);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<ClienteFilterKey>(tipodoc === 'ruc' ? 'ruc' : 'dni');
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isSearchingApi, setIsSearchingApi] = useState(false);

  const { clientes, loading, getClienteByDocument } = useClientesHook();

  useEffect(() => {
    if (tipodoc === 'dni' || tipodoc === 'ruc') setActiveFilter(tipodoc);
  }, [tipodoc]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clientes.filter((c: Cliente) => {
      const nombre = c.fullname || c.firstname || '';
      const matchSearch = c.document?.includes(q) || nombre.toLowerCase().includes(q);
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
          fullname: data.nombre_o_razon_social || data.nombre_completo || '',
          document: data.numero || '',
        };
        onClienteEncontrado(clienteNormalizado);
        bottomSheetRef.current?.close();
        setSearch('');
      }
    } catch { console.log('No encontrado en API'); }
    finally { setIsSearchingApi(false); }
  }, [search, getClienteByDocument, onClienteEncontrado, bottomSheetRef]);

  const renderItem = useCallback(({ item }: { item: Cliente }) => {
    const nombre = item.fullname || item.firstname || '';
    const isRuc = item.document?.length === 11;
    const color = AVATAR_COLORS[(nombre?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={cbStyles.card}
        onPress={() => {
          onClienteEncontrado({
            fullname: item.fullname || `${item.lastname || ''} ${item.firstname || ''}`.trim(),
            document: item.document,
          });
          bottomSheetRef.current?.close();
        }}
      >
        <View style={[cbStyles.avatar, { backgroundColor: color + '18', borderColor: color + '35', borderWidth: 1.5 }]}>
          <Text style={[cbStyles.avatarText, { color }]}>{getInitials(nombre) || '?'}</Text>
        </View>
        <View style={cbStyles.cardBody}>
          <View style={cbStyles.row}>
            <Text style={cbStyles.cardName} numberOfLines={1}>{nombre || 'Sin nombre'}</Text>
            <View style={[cbStyles.badge, { backgroundColor: isRuc ? C.purple + '15' : C.green + '15', borderColor: isRuc ? C.purple + '30' : C.green + '30' }]}>
              <Text style={[cbStyles.badgeText, { color: isRuc ? C.purple : C.green }]}>{isRuc ? 'RUC' : 'DNI'}</Text>
            </View>
          </View>
          <Text style={cbStyles.cardDoc}>{isRuc ? 'RUC' : 'DNI'}: {item.document}</Text>
        </View>
        <Icon source="chevron-right" size={16} color={C.textMuted} />
      </TouchableOpacity>
    );
  }, [bottomSheetRef, onClienteEncontrado]);

  const ListHeader = useMemo(() => (
    <>
      <View style={cbStyles.headerRow}>
        <Text style={cbStyles.title}>Buscar cliente</Text>
        <View style={cbStyles.countBadge}>
          <Text style={cbStyles.countText}>{filtered.length} cliente{filtered.length !== 1 ? 's' : ''}</Text>
        </View>
      </View>
      <View style={cbStyles.filterRow}>
        {[{ key: 'dni' as ClienteFilterKey, label: 'DNI' }, { key: 'ruc' as ClienteFilterKey, label: 'RUC' }].map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setActiveFilter(f.key)}
            style={[cbStyles.filterTab, activeFilter === f.key && cbStyles.filterTabActive]}
          >
            <Text style={[cbStyles.filterTabText, activeFilter === f.key && cbStyles.filterTabTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={cbStyles.searchWrap}>
        <Icon source="magnify" size={16} color={C.textMuted} />
        <TextInput
          placeholder={`Buscar por nombre o ${activeFilter.toUpperCase()}...`}
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
          style={cbStyles.searchInput}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon source="close-circle" size={16} color={C.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {filtered.length === 0 && search.length >= 8 && (
        <TouchableOpacity
          style={[cbStyles.apiButton, isSearchingApi && { opacity: 0.6 }]}
          onPress={handleBuscarAPI}
          disabled={isSearchingApi}
        >
          {isSearchingApi ? <ActivityIndicator size="small" color={C.bg} /> : <Icon source="magnify" size={16} color={C.bg} />}
          <Text style={cbStyles.apiButtonText}>{isSearchingApi ? 'Buscando...' : 'Buscar en SUNAT / API'}</Text>
        </TouchableOpacity>
      )}
      <Text style={cbStyles.sectionLabel}>Resultados</Text>
    </>
  ), [filtered.length, search, activeFilter, isSearchingApi]);

  useEffect(() => { bottomSheetRef.current?.snapToIndex(0); }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: C.bg }}
      handleIndicatorStyle={{ backgroundColor: C.border }}
    >
      <BottomSheetFlatList
        data={filtered}
        keyExtractor={(item: any) => item.document}
        renderItem={renderItem}
        contentContainerStyle={[cbStyles.sheetContent, { minHeight: '100%' }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: C.textMuted, fontSize: 14 }}>
              {loading ? 'Cargando clientes...' : 'No se encontraron clientes'}
            </Text>
          </View>
        }
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={10}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      />
    </BottomSheet>
  );
}

const getInitials = (nombre: string) =>
  nombre.trim().split(' ').slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('');

const cbStyles = StyleSheet.create({
  sheetContent: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, marginTop: 8 },
  title: { fontSize: 18, fontWeight: '700', color: C.textPrimary },
  countBadge: {
    backgroundColor: C.surfaceAlt, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: C.border,
  },
  countText: { fontSize: 12, color: C.textSecondary },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filterTab: {
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: C.border, backgroundColor: C.surface,
  },
  filterTabActive: { backgroundColor: C.accent, borderColor: C.accent },
  filterTabText: { fontSize: 13, fontWeight: '600', color: C.textSecondary },
  filterTabTextActive: { color: C.bg },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.surface, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 2,
    marginBottom: 12, borderWidth: 1, borderColor: C.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: C.textPrimary, paddingVertical: 10 },
  apiButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: C.accent, borderRadius: 12,
    paddingVertical: 13, marginBottom: 12,
  },
  apiButtonText: { color: C.bg, fontSize: 14, fontWeight: '700' },
  sectionLabel: { fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700', marginBottom: 8 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.surface, borderRadius: 14,
    padding: 12, borderWidth: 1, borderColor: C.border,
  },
  avatar: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontSize: 16, fontWeight: '800' },
  cardBody: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardName: { flex: 1, fontSize: 14, fontWeight: '700', color: C.textPrimary },
  cardDoc: { fontSize: 11, color: C.textSecondary, marginTop: 3 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: '700' },
});
