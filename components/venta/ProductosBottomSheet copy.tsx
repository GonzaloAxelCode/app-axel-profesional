import T from '@/constants/THEME';
import { useInventario } from '@/State/hooks/useInventarios';
import { InventarioCart } from '@/State/models/inventario.models';
import { URLS } from '@/State/utils/endpoints';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, Text } from 'react-native-paper';

// ─────────────────────────────────────────────
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.9;

type StockStatus = 'in_stock' | 'low_stock' | 'no_stock';

function getStockStatus(cantidad: number): StockStatus {
  if (cantidad === 0) return 'no_stock';
  if (cantidad <= 8) return 'low_stock';
  return 'in_stock';
}

const STOCK_CONFIG: Record<StockStatus, { label: string; color: string }> = {
  in_stock: { label: 'En stock', color: T.green },
  low_stock: { label: 'Stock bajo', color: T.amber },
  no_stock: { label: 'Agotado', color: T.red },
};

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
  const { productos, isLoading } = useInventario();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todos');
  const [activeCategoria, setActiveCategoria] = useState<string>('todas');
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  // modalVisible controla si el Modal de RN está montado;
  // se activa ANTES de animar y se desactiva DESPUÉS del cierre
  const [modalVisible, setModalVisible] = useState(false);

  // ── Animaciones ──
  const translateY = useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // 1. Montar el Modal primero
      setModalVisible(true);
      // 2. Resetear posición y animar apertura en el siguiente frame
      translateY.setValue(MODAL_HEIGHT);
      backdropOpacity.setValue(0);
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            damping: 22,
            stiffness: 180,
            mass: 0.9,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    // Animar cierre y desmontar al terminar
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: MODAL_HEIGHT,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      onClose();
    });
  }, [onClose]);

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
      const compra = item.costo_compra ?? 0;
      const ganancia = venta - compra;
      const margen = venta > 0 ? Math.round(((venta - compra) / venta) * 100) : 0;

      return (
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.card}
          onPress={() => {
            handleClose();
            onSelectProducto(item);
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
              <Text style={styles.name} numberOfLines={2}>
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

            <Text style={styles.price}>S/ {venta}</Text>

            <View style={styles.stats}>
              <Stat label="Stock" value={item.cantidad ?? 0} color={T.blue} />
              <Stat label="Compra" value={`S/ ${compra}`} color={T.purple} />
              <Stat label="Ganancia" value={`S/ ${ganancia}`} color={T.green} />
              <Stat label="Margen" value={`${margen}%`} color={T.accent} />
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [onSelectProducto, handleClose],
  );

  const ListHeaderComponent = useCallback(
    () => (
      <View style={{ paddingHorizontal: 4 }}>
        {/* Handle visual */}
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>Productos</Text>
          <View style={styles.headerRight}>
            <Text style={styles.count}>{filtered.length}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Icon source="close" size={20} color={T.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.search}>
          <Icon source="magnify" size={18} color={T.textMuted} />
          <TextInput
            placeholder="Buscar producto o SKU..."
            placeholderTextColor={T.textMuted}
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon source="close-circle" size={16} color={T.textMuted} />
            </TouchableOpacity>
          )}
        </View>

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
    [filtered.length, search, categorias, activeCategoria, handleClose],
  );

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        <FlatList
          data={filtered}
          keyExtractor={(item: InventarioCart) => item.id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={styles.container}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isFetchingMore ? <ActivityIndicator style={{ padding: 20 }} /> : null
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              {isLoading ? 'Cargando...' : 'Sin productos'}
            </Text>
          }
        />
      </Animated.View>
    </Modal>
  );
}

// ─────────────────────────────────────────────
const Stat = ({ label, value, color }: { label: string; value: any; color: string }) => (
  <View style={styles.stat}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: MODAL_HEIGHT,
    backgroundColor: T.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  handle: {

  },
  container: {
    padding: 16,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: T.textPrimary,
  },
  count: {
    color: T.textSecondary,
  },
  closeBtn: {
    padding: 4,
    borderRadius: T.radiusFull,
    backgroundColor: T.surfaceAlt,
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
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  tabActiveCategoria: {
    backgroundColor: T.purple,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: T.textMuted,
    marginBottom: 6,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: T.radiusLg,
    backgroundColor: T.surface,
    borderWidth: 0,
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