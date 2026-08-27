import { useAppTheme } from '@/State/context/ThemeContext';
import { useInventario } from '@/State/hooks/useInventarios';
import { InventarioCart } from '@/State/models/inventario.models';
import { URLS } from '@/State/utils/endpoints';
import { Image } from 'expo-image';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';

// ─────────────────────────────────────────────
type StockStatus = 'in_stock' | 'low_stock' | 'no_stock';

function getStockStatus(cantidad: number): StockStatus {
  if (cantidad === 0) return 'no_stock';
  if (cantidad <= 8) return 'low_stock';
  return 'in_stock';
}

type FilterKey = 'todos' | 'disponible' | 'poco' | 'agotado';

interface Props {
  visible: boolean;
  onClose: () => void;
  hasNextPage?: boolean;
  onSelectProducto: (item: InventarioCart) => void;
  loadMore?: () => void;
}

export function ProductosModal({
  visible,
  onClose,
  hasNextPage = false,
  onSelectProducto,
  loadMore,
}: Props) {
  const { T } = useAppTheme();
  const STOCK_CONFIG: Record<StockStatus, { label: string; color: string }> = {
    in_stock: { label: 'En stock', color: T.green },
    low_stock: { label: 'Stock bajo', color: T.amber },
    no_stock: { label: 'Agotado', color: T.red },
  };

  const makeStyles = (T: any) => StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: T.bg,
    },
    navbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: T.bg,
    },
    navTitleBlock: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: T.textPrimary,
      letterSpacing: -0.5,
    },
    countBadge: {
      backgroundColor: T.accent + '20',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    countText: {
      fontSize: 13,
      fontWeight: '700',
      color: T.accent,
    },
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: T.surfaceAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      padding: 16,
      paddingBottom: 60,
    },
    search: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: T.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: T.border,
      paddingHorizontal: 14,
      marginBottom: 12,
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      color: T.textPrimary,
      fontSize: 15,
    },
    tabs: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    tab: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 10,
      backgroundColor: T.surfaceAlt,
    },
    tabText: {
      fontSize: 13,
      fontWeight: '600',
      color: T.textSecondary,
    },
    tabTextActive: {
      color: '#fff',
    },
    tabActiveCategoria: {
      backgroundColor: T.accent,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: T.textMuted,
      marginBottom: 8,
      marginTop: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    card: {
      flexDirection: 'row',
      gap: 12,
      padding: 12,
      borderRadius: 16,
      backgroundColor: T.surface,
      borderWidth: 1,
      borderColor: T.border,
      marginBottom: 10,
    },
    image: {
      width: 64,
      height: 64,
      borderRadius: 14,
      backgroundColor: T.surfaceAlt,
    },
    body: {
      flex: 1,
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 8,
    },
    name: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: T.textPrimary,
      lineHeight: 20,
    },
    sku: {
      fontSize: 12,
      color: T.textMuted,
      marginTop: 4,
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    price: {
      fontSize: 18,
      fontWeight: '700',
      color: T.textPrimary,
    },
    stock: {
      fontSize: 12,
      color: T.textMuted,
      fontWeight: '500',
      backgroundColor: T.surfaceAlt,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    empty: {
      textAlign: 'center',
      marginTop: 40,
      color: T.textMuted,
      fontSize: 15,
    },
  });
  const styles = makeStyles(T);

  let { productos, isLoading } = useInventario();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todos');
  const [activeCategoria, setActiveCategoria] = useState<string>('todas');
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // ── Categorías únicas ──
  const categorias = useMemo(() => {
    const unique = [
      ...new Set(productos.map((p) => p.categoria_nombre).filter(Boolean)),
    ] as string[];
    return [
      { key: 'todas', label: 'Todas' },
      ...unique.map((c) => ({ key: c, label: c })),
    ];
  }, [productos]);

  // ── Lista filtrada ──
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

      const matchCategoria =
        activeCategoria === 'todas' || p.categoria_nombre === activeCategoria;

      return matchSearch && matchFilter && matchCategoria;
    });
  }, [productos, search, activeFilter, activeCategoria]);

  // ── Paginación ──
  const handleEndReached = useCallback(async () => {
    if (isFetchingMore || isLoading || !hasNextPage || !loadMore) return;
    setIsFetchingMore(true);
    try {
      await loadMore();
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, isLoading, hasNextPage, loadMore]);

  // ── Item ──
  const renderItem = useCallback(
    ({ item }: { item: InventarioCart }) => {
      const status = getStockStatus(item.cantidad ?? 0);
      const cfg = STOCK_CONFIG[status];
      const venta = item.costo_venta ?? 0;

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.card}
          onPress={() => {
            onSelectProducto(item);
            onClose();
          }}
        >
          <Image
            source={{
              uri: item.imagen_producto
                ? URLS.BASE + item.imagen_producto
                : URLS.IMAGE_URL_PLACEHOLDER,
            }}
            style={styles.image}
            contentFit="cover"
          />

          <View style={styles.body}>
            <View style={styles.row}>
              <Text style={styles.name} numberOfLines={1}>
                {item.producto_nombre}
              </Text>
              <View style={[styles.badge, { backgroundColor: cfg.color + '15' }]}>
                <Text style={{ color: cfg.color, fontSize: 10, fontWeight: '700' }}>
                  {cfg.label}
                </Text>
              </View>
            </View>

            <Text style={styles.sku}>
              {item.producto_sku}
              {item.categoria_nombre ? ` · ${item.categoria_nombre}` : ''}
            </Text>

            <View style={styles.bottomRow}>
              <Text style={styles.price}>S/ {venta}</Text>
              <Text style={styles.stock}>Stock: {item.cantidad ?? 0}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [onSelectProducto, onClose],
  );

  // ── List Header ──
  const ListHeaderComponent = useCallback(
    () => (
      <View style={{ paddingHorizontal: 16 }}>
        {/* Buscador */}
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

        {/* Categorías */}
        <Text style={styles.sectionLabel}>Categoría</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.tabs}>
            {categorias.map((c) => {
              const active = activeCategoria === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  onPress={() => setActiveCategoria(c.key)}
                  style={[styles.tab, active && styles.tabActiveCategoria]}
                >
                  <Text style={[styles.tabText, active && styles.tabTextActive]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    ),
    [search, activeCategoria, categorias],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* ── Navbar ── */}
        <View style={styles.navbar}>
          <View style={styles.navTitleBlock}>
            <Text style={styles.title}>Hacer una venta</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{filtered.length}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <Icon source="close" size={22} color={T.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ── Lista ── */}
        <FlatList
          data={filtered}
          keyExtractor={(item: InventarioCart) => item.id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={ListHeaderComponent()}
          contentContainerStyle={styles.container}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          keyboardShouldPersistTaps="handled"
          ListFooterComponent={
            isFetchingMore ? <ActivityIndicator style={{ padding: 20 }} /> : null
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              {isLoading ? 'Cargando...' : 'Sin productos'}
            </Text>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}
