import { InventarioCart } from '@/State/models/inventario.models';
import { C } from '@/State/utils/c';
import { URLS } from '@/State/utils/endpoints';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, Text } from 'react-native-paper';


// ═══════════════════════════════════════════════════════════════════════════════
// ProductosBottomSheet.tsx
// ═══════════════════════════════════════════════════════════════════════════════



type StockStatus = 'in_stock' | 'low_stock' | 'no_stock';

function getStockStatus(cantidad: number): StockStatus {
  if (cantidad === 0) return 'no_stock';
  if (cantidad <= 8) return 'low_stock';
  return 'in_stock';
}

const STOCK_CONFIG: Record<StockStatus, { label: string; color: string }> = {
  in_stock: { label: 'En stock', color: C.green },
  low_stock: { label: 'Stock bajo', color: C.yellow },
  no_stock: { label: 'Agotado', color: C.red },
};

type FilterKey = 'todos' | 'disponible' | 'poco' | 'agotado';
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'disponible', label: 'En stock' },
  { key: 'poco', label: 'Stock bajo' },
  { key: 'agotado', label: 'Agotados' },
];

interface ProductosBottomSheetProps {
  bottomSheetRef: RefObject<BottomSheet>;
  productos: InventarioCart[];
  isLoading: boolean;
  hasNextPage?: boolean;
  onSelectProducto: (item: InventarioCart) => void;
  loadMore?: () => void;
}

export function ProductosBottomSheet({
  bottomSheetRef, productos, isLoading, hasNextPage = false, onSelectProducto, loadMore,
}: ProductosBottomSheetProps) {
  const snapPoints = useMemo(() => ['100%'], []);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todos');
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return productos.filter((p) => {
      const matchSearch = p.producto_nombre.toLowerCase().includes(q) || p.producto_sku.toLowerCase().includes(q);
      const status = getStockStatus(p.cantidad ?? 0);
      const matchFilter =
        activeFilter === 'todos' ||
        (activeFilter === 'disponible' && status === 'in_stock') ||
        (activeFilter === 'poco' && status === 'low_stock') ||
        (activeFilter === 'agotado' && status === 'no_stock');
      return matchSearch && matchFilter;
    });
  }, [productos, search, activeFilter]);

  const handleEndReached = useCallback(async () => {
    if (isFetchingMore || isLoading || !hasNextPage || !loadMore) return;
    setIsFetchingMore(true);
    try { await loadMore(); } finally { setIsFetchingMore(false); }
  }, [isFetchingMore, isLoading, hasNextPage, loadMore]);

  const renderItem = useCallback(({ item }: { item: InventarioCart }) => {
    const status = getStockStatus(item.cantidad ?? 0);
    const cfg = STOCK_CONFIG[status];
    const venta = item.costo_venta ?? 0;
    const compra = item.costo_compra ?? 0;
    const ganancia = venta - compra;
    const margen = venta > 0 ? Math.round(((venta - compra) / venta) * 100) : 0;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={bsStyles.card}
        onPress={() => { bottomSheetRef.current?.close(); onSelectProducto(item); }}
      >
        <Image source={{ uri: item.imagen_producto ? URLS.BASE + item.imagen_producto : URLS.IMAGE_URL_PLACEHOLDER }}
          style={bsStyles.cardImage} contentFit="cover" />
        <View style={bsStyles.cardBody}>
          <View style={bsStyles.row}>
            <Text style={bsStyles.cardName} numberOfLines={2}>{item.producto_nombre}</Text>
            <View style={[bsStyles.stockBadge, { backgroundColor: cfg.color + '15', borderColor: cfg.color + '30' }]}>
              <Text style={[bsStyles.stockText, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
          </View>
          <Text style={bsStyles.cardSku}>SKU: {item.producto_sku}{item.categoria_nombre ? ` · ${item.categoria_nombre}` : ''}</Text>
          <View style={[bsStyles.row, { marginTop: 6 }]}>
            <Text style={bsStyles.cardPrice}>S/ {venta}</Text>
          </View>
          <View style={bsStyles.divider} />
          <View style={bsStyles.statsRow}>
            {[
              { label: 'Stock', value: String(item.cantidad ?? 0) },
              { label: 'Compra', value: `S/ ${compra}` },
              { label: 'Ganancia', value: `S/ ${ganancia}` },
              { label: 'Margen', value: `${margen}%` },
            ].map(({ label, value }) => (
              <View key={label} style={bsStyles.statCell}>
                <Text style={bsStyles.statLabel}>{label}</Text>
                <Text style={bsStyles.statValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [bottomSheetRef, onSelectProducto]);

  const ListHeader = useMemo(() => (
    <>
      <View style={bsStyles.headerRow}>
        <Text style={bsStyles.title}>Seleccionar producto</Text>
        <View style={bsStyles.countBadge}>
          <Text style={bsStyles.countText}>{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</Text>
        </View>
      </View>
      <View style={bsStyles.searchWrap}>
        <Icon source="magnify" size={16} color={C.textMuted} />
        <TextInput
          placeholder="Buscar por nombre o SKU..."
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
          style={bsStyles.searchInput}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={bsStyles.filterScroll}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setActiveFilter(f.key)}
            style={[bsStyles.filterTab, activeFilter === f.key && bsStyles.filterTabActive]}
          >
            <Text style={[bsStyles.filterTabText, activeFilter === f.key && bsStyles.filterTabTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={bsStyles.sectionLabel}>{search || activeFilter !== 'todos' ? 'Resultados' : 'Catálogo'}</Text>
    </>
  ), [filtered.length, search, activeFilter]);

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
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[bsStyles.sheetContent, { minHeight: '100%' }]}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={isFetchingMore ? <ActivityIndicator color={C.accent} style={{ padding: 16 }} /> : null}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: C.textMuted, fontSize: 14 }}>
              {isLoading ? 'Cargando...' : 'No se encontraron productos'}
            </Text>
          </View>
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

const bsStyles = StyleSheet.create({
  sheetContent: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, marginTop: 8 },
  title: { fontSize: 18, fontWeight: '700', color: C.textPrimary },
  countBadge: {
    backgroundColor: C.surfaceAlt, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: C.border,
  },
  countText: { fontSize: 12, color: C.textSecondary },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surface, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 2,
    marginBottom: 12, borderWidth: 1, borderColor: C.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: C.textPrimary, paddingVertical: 10 },
  filterScroll: { gap: 8, paddingBottom: 12 },
  filterTab: {
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: C.border, backgroundColor: C.surface,
  },
  filterTabActive: { backgroundColor: C.accent, borderColor: C.accent },
  filterTabText: { fontSize: 13, fontWeight: '600', color: C.textSecondary },
  filterTabTextActive: { color: C.bg },
  sectionLabel: {
    fontSize: 10, color: C.textMuted, textTransform: 'uppercase',
    letterSpacing: 1, marginBottom: 8, fontWeight: '700',
  },
  card: {
    flexDirection: 'row', backgroundColor: C.surface,
    borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: C.border,
  },
  cardImage: { width: 88, height: '100%' as any, minHeight: 90 },
  cardBody: { flex: 1, padding: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  cardName: { flex: 1, fontSize: 13, fontWeight: '700', color: C.textPrimary, lineHeight: 18 },
  cardSku: { fontSize: 11, color: C.textMuted, marginTop: 3, letterSpacing: 0.3 },
  cardPrice: { fontSize: 15, fontWeight: '800', color: C.accent },
  stockBadge: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 1 },
  stockText: { fontSize: 10, fontWeight: '700' },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 7 },
  statsRow: { flexDirection: 'row' },
  statCell: { flex: 1 },
  statLabel: { fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 11, fontWeight: '700', color: C.textSecondary, marginTop: 1 },
});
