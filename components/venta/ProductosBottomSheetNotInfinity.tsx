import { Inventario } from '@/State/models/inventario.models';
import { URLS } from '@/State/utils/endpoints';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { RefObject, useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';

// ─── helpers ────────────────────────────────────────────────────────────────

const getImagenProducto = (producto: Inventario) =>
  producto.imagen_producto
    ? URLS.BASE + producto.imagen_producto
    : URLS.IMAGE_URL_PLACEHOLDER;

type StockStatus = 'in_stock' | 'low_stock' | 'no_stock';

function getStockStatus(cantidad: number): StockStatus {
  if (cantidad === 0) return 'no_stock';
  if (cantidad <= 8) return 'low_stock';
  return 'in_stock';
}

const STOCK_LABEL: Record<StockStatus, string> = {
  in_stock: 'En stock',
  low_stock: 'Stock bajo',
  no_stock: 'Agotado',
};

// ─── types ───────────────────────────────────────────────────────────────────

type FilterKey = 'todos' | 'disponible' | 'poco' | 'agotado';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'disponible', label: 'En stock' },
  { key: 'poco', label: 'Stock bajo' },
  { key: 'agotado', label: 'Agotados' },
];

interface ProductosBottomSheetProps {
  bottomSheetRef: RefObject<BottomSheet>;
  productos: Inventario[];
  isLoading: boolean;
  onSelectProducto: (item: Inventario) => void;
  loadMore?: () => void;
}

// ─── sub-components ──────────────────────────────────────────────────────────

function StockBadge({ status }: { status: StockStatus }) {
  const s = styles[`badge_${status}` as keyof typeof styles] as object;
  const t = styles[`badgeText_${status}` as keyof typeof styles] as object;
  return (
    <View style={[styles.badge, s]}>
      <Text style={[styles.badgeText, t]}>{STOCK_LABEL[status]}</Text>
    </View>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function ProductosBottomSheetNotInfinity({
  bottomSheetRef,
  productos,
  isLoading,
  onSelectProducto,
  loadMore,
}: ProductosBottomSheetProps) {
  const snapPoints = useMemo(() => ['100%', '100%', '100%'], []);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todos');

  // Filtrar por búsqueda + tab activo
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return productos.filter((p) => {
      const matchSearch =
        p.producto_nombre.toLowerCase().includes(q) ||
        p.producto_sku.toLowerCase().includes(q);

      const status = getStockStatus(p.cantidad ?? 0);
      const matchFilter =
        activeFilter === 'todos' ||
        (activeFilter === 'disponible' && status === 'in_stock') ||
        (activeFilter === 'poco' && status === 'low_stock') ||
        (activeFilter === 'agotado' && status === 'no_stock');

      return matchSearch && matchFilter;
    });
  }, [productos, search, activeFilter]);

  const renderItem = useCallback(
    ({ item }: { item: Inventario }) => {
      const status = getStockStatus(item.cantidad ?? 0);
      const venta = item.costo_venta ?? 0;
      const compra = item.costo_compra ?? 0;
      const ganancia = (venta - compra);
      const margen =
        venta > 0 ? Math.round(((venta - compra) / venta) * 100) : 0;

      return (
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.card}
          onPress={() => {
            bottomSheetRef.current?.close();
            onSelectProducto(item);
          }}
        >
          {/* Imagen */}
          <Image
            source={{ uri: getImagenProducto(item) }}
            style={styles.cardImage}
            contentFit="cover"
          />

          {/* Cuerpo */}
          <View style={styles.cardBody}>
            {/* Fila 1: nombre + badge */}
            <View style={styles.row}>
              <Text style={styles.cardName} numberOfLines={2}>
                {item.producto_nombre}
              </Text>
              <StockBadge status={status} />
            </View>

            {/* SKU + categoría */}
            <Text style={styles.cardSku}>
              SKU: {item.producto_sku}
              {item.categoria_nombre}
            </Text>

            {/* Fila 2: chips + precio */}
            <View style={[styles.row, { marginTop: 6 }]}>
              <View style={styles.chips}>
                {item.cantidad ? (
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>{item.cantidad}</Text>
                  </View>
                ) : null}

                {item.categoria_nombre ? (
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>{item.categoria_nombre}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.cardPrice}>S/ {venta}</Text>
            </View>

            {/* Separador */}
            <View style={styles.divider} />

            {/* Fila 3: stats */}
            <View style={styles.statsRow}>
              <StatCell label="Stock" value={String(item.cantidad ?? 0)} />
              <StatCell label="Compra" value={`S/ ${compra}`} />
              <StatCell label="Ganancia" value={`S/ ${ganancia}`} />
              <StatCell label="Margen" value={`${margen}%`} />
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [bottomSheetRef, onSelectProducto]
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      handleIndicatorStyle={styles.dragHandle}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Seleccionar producto</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Búsqueda */}
        <View style={styles.searchWrap}>
          {/* icono lupa — SVG inline no disponible en RN; usamos texto o librería */}
          <TextInput
            placeholder="Buscar por nombre o SKU..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
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
        </ScrollView>

        {/* Etiqueta sección */}
        <Text style={styles.sectionLabel}>
          {search || activeFilter !== 'todos' ? 'Resultados' : 'Catálogo'}
        </Text>

        {/* Lista */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 10 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {isLoading
                ? 'Cargando...'
                : 'No se encontraron productos'}
            </Text>
          }
        />
      </BottomSheetScrollView>
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

  // filter tabs
  filterScroll: { gap: 8, paddingBottom: 14 },
  filterTab: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  filterTabActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
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
  },
  cardImage: { width: 88, height: '100%' as any, minHeight: 88 },
  cardBody: { flex: 1, padding: 10 },

  // card rows
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
  cardSku: { fontSize: 11, color: '#9ca3af', marginTop: 3, letterSpacing: 0.3 },
  cardPrice: { fontSize: 15, fontWeight: '500', color: '#111' },

  // chips
  chips: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', flex: 1 },
  chip: {
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  chipText: { fontSize: 11, color: '#6b7280' },

  // stock badges
  badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '500' },
  badge_in_stock: { backgroundColor: '#EAF3DE' },
  badgeText_in_stock: { color: '#3B6D11' },
  badge_low_stock: { backgroundColor: '#FAEEDA' },
  badgeText_low_stock: { color: '#854F0B' },
  badge_no_stock: { backgroundColor: '#FCEBEB' },
  badgeText_no_stock: { color: '#A32D2D' },

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
});