import T from '@/constants/THEME';
import { InventarioCart } from '@/State/models/inventario.models';
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

// ─────────────────────────────────────────────
type StockStatus = 'in_stock' | 'low_stock' | 'no_stock';

function getStockStatus(cantidad: number): StockStatus {
  if (cantidad === 0) return 'no_stock';
  if (cantidad <= 8) return 'low_stock';
  return 'in_stock';
}

const STOCK_CONFIG = {
  in_stock: { label: 'En stock', color: T.green },
  low_stock: { label: 'Stock bajo', color: T.amber },
  no_stock: { label: 'Agotado', color: T.red },
};

type FilterKey = 'todos' | 'disponible' | 'poco' | 'agotado';

const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'disponible', label: 'En stock' },
  { key: 'poco', label: 'Stock bajo' },
  { key: 'agotado', label: 'Agotados' },
];

interface Props {
  bottomSheetRef: RefObject<BottomSheet>;
  productos: InventarioCart[];
  isLoading: boolean;
  hasNextPage?: boolean;
  onSelectProducto: (item: InventarioCart) => void;
  loadMore?: () => void;
}

export function ProductosBottomSheet({
  bottomSheetRef,
  productos,
  isLoading,
  hasNextPage = false,
  onSelectProducto,
  loadMore,
}: Props) {
  const snapPoints = useMemo(() => ['100%'], []);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todos');
  const [isFetchingMore, setIsFetchingMore] = useState(false);

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

  const handleEndReached = useCallback(async () => {
    if (isFetchingMore || isLoading || !hasNextPage || !loadMore) return;
    setIsFetchingMore(true);
    try {
      await loadMore();
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, isLoading, hasNextPage, loadMore]);

  // ─────────────────────────────────────────────
  // ITEM REDESIGN
  // ─────────────────────────────────────────────
  const renderItem = useCallback(({ item }: { item: InventarioCart }) => {
    const status = getStockStatus(item.cantidad ?? 0);
    const cfg = STOCK_CONFIG[status];

    const venta = item.costo_venta ?? 0;
    const compra = item.costo_compra ?? 0;
    const ganancia = venta - compra;
    const margen = venta > 0 ? Math.round(((venta - compra) / venta) * 100) : 0;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.card}
        onPress={() => {
          bottomSheetRef.current?.close();
          onSelectProducto(item);
        }}
      >
        {/* IMAGE */}
        <Image
          source={{
            uri: item.imagen_producto
              ? URLS.BASE + item.imagen_producto
              : URLS.IMAGE_URL_PLACEHOLDER,
          }}
          style={styles.image}
          contentFit="cover"
        />

        {/* BODY */}
        <View style={styles.body}>
          {/* TOP */}
          <View style={styles.row}>
            <Text style={styles.name} numberOfLines={2}>
              {item.producto_nombre}
            </Text>

            <View
              style={[
                styles.badge,
                { backgroundColor: cfg.color + '15' },
              ]}
            >
              <Text style={{ color: cfg.color, fontSize: 10, fontWeight: '700' }}>
                {cfg.label}
              </Text>
            </View>
          </View>

          <Text style={styles.sku}>
            {item.producto_sku}
            {item.categoria_nombre ? ` · ${item.categoria_nombre}` : ''}
          </Text>

          {/* PRICE */}
          <Text style={styles.price}>S/ {venta}</Text>

          {/* STATS */}
          <View style={styles.stats}>
            <Stat label="Stock" value={item.cantidad ?? 0} color={T.blue} />
            <Stat label="Compra" value={`S/ ${compra}`} color={T.purple} />
            <Stat label="Ganancia" value={`S/ ${ganancia}`} color={T.green} />
            <Stat label="Margen" value={`${margen}%`} color={T.accent} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const ListHeader = useMemo(() => (
    <>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Productos</Text>
        <Text style={styles.count}>{filtered.length}</Text>
      </View>

      {/* SEARCH */}
      <View style={styles.search}>
        <Icon source="magnify" size={18} color={T.textMuted} />
        <TextInput
          placeholder="Buscar producto o SKU..."
          placeholderTextColor={T.textMuted}
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>

      {/* FILTERS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tabs}>
          {FILTERS.map((f: any) => {
            const active = activeFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                style={[styles.tab, active && styles.tabActive]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </>
  ), [filtered.length, search, activeFilter]);

  useEffect(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: T.bg }}
    >
      <BottomSheetFlatList
        data={filtered}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.container}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? <ActivityIndicator style={{ padding: 20 }} /> : null
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            {isLoading ? 'Cargando...' : 'Sin productos'}
          </Text>
        }
      />
    </BottomSheet>
  );
}

// ─────────────────────────────────────────────
// MINI STAT COMPONENT
// ─────────────────────────────────────────────
const Stat = ({ label, value, color }: any) => (
  <View style={styles.stat}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

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

  count: {
    color: T.textSecondary,
  },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: T.radiusMd,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    color: T.textPrimary,
  },

  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
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

  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: T.radiusLg,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 10,
    ...T.shadowCard,
  },

  image: {
    width: 72,
    height: 72,
    borderRadius: T.radiusMd,
    backgroundColor: T.surfaceAlt,
  },

  body: {
    flex: 1,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: T.textPrimary,
  },

  sku: {
    fontSize: 11,
    color: T.textMuted,
    marginTop: 2,
  },

  price: {
    fontSize: 16,
    fontWeight: '800',
    color: T.accent,
    marginTop: 6,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: T.radiusSm,
  },

  stats: {
    flexDirection: 'row',
    marginTop: 10,
  },

  stat: {
    flex: 1,
  },

  statValue: {
    fontSize: 12,
    fontWeight: '800',
  },

  statLabel: {
    fontSize: 9,
    color: T.textMuted,
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: T.textMuted,
  },
});