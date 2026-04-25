import T from '@/constants/THEME';
import { useProductos } from '@/State/hooks/useProductos';
import { Producto } from '@/State/models/producto.models';
import { URLS } from '@/State/utils/endpoints';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import { useMemo, useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,

    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import ImageViewing from 'react-native-image-viewing';
import { ActivityIndicator, Text } from 'react-native-paper';


// ─── Helpers ──────────────────────────────────────────────────────────────────
const getImagenProducto = (p: Producto) =>
    p?.imagen ? URLS.BASE + p.imagen : URLS.IMAGE_URL_PLACEHOLDER;

type StockStatus = 'in_stock' | 'low_stock' | 'no_stock';

function getStockStatus(cantidad?: number): StockStatus {
    if (!cantidad || cantidad === 0) return 'no_stock';
    if (cantidad <= 8) return 'low_stock';
    return 'in_stock';
}

const STOCK_FILTERS = [
    { key: 'todos_stock', label: 'Todo' },
    { key: 'in_stock', label: 'En stock' },
    { key: 'low_stock', label: 'Stock bajo' },
    { key: 'no_stock', label: 'Agotados' },
] as const;

type StockFilterKey = (typeof STOCK_FILTERS)[number]['key'];

const STOCK_CFG: Record<StockStatus, { label: string; color: string; bg: string }> = {
    in_stock: { label: 'En stock', color: T.green, bg: T.green + '18' },
    low_stock: { label: 'Stock bajo', color: T.amber, bg: T.amber + '18' },
    no_stock: { label: 'Agotado', color: T.red, bg: T.red + '18' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StockBadge({ status }: { status: StockStatus }) {
    const cfg = STOCK_CFG[status];
    return (
        <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.color + '30' }]}>
            <View style={[styles.badgeDot, { backgroundColor: cfg.color }]} />
            <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
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

// ─── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({ item }: { item: Producto }) {
    const [imageVisible, setImageVisible] = useState(false);
    const status = getStockStatus(item.inventario?.cantidad);
    const venta = Number(item.inventario?.costo_venta ?? 0);
    const compra = Number(item.inventario?.costo_compra ?? 0);
    const ganancia = (venta - compra).toFixed(2);
    const margen = venta > 0 ? Math.round(((venta - compra) / venta) * 100) : 0;
    const router = useRouter();

    return (
        <View style={styles.card}>
            {/* Imagen */}
            <TouchableOpacity activeOpacity={0.9} onPress={() => setImageVisible(true)} style={styles.cardImageWrap}>
                <Image
                    source={{ uri: getImagenProducto(item) }}
                    style={styles.cardImage}
                    contentFit="cover"
                />
                {/* Price pill overlay */}
                <View style={styles.pricePill}>
                    <Text style={styles.priceText}>S/ {venta.toFixed(2)}</Text>
                </View>
            </TouchableOpacity>

            {/* Body */}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push({ pathname: '/productodetail', params: { id: item.id } })}
                style={{ flex: 1 }}
            >
                <View style={styles.cardBody}>
                    {/* Top row */}
                    <View style={styles.cardTopRow}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            {item.categoria_nombre && (
                                <Text style={styles.categoryLabel}>{item.categoria_nombre.toUpperCase()}</Text>
                            )}
                            <Text style={styles.cardName} numberOfLines={2}>{item.nombre}</Text>
                            {item.sku && (
                                <Text style={styles.skuText}>SKU: {item.sku}</Text>
                            )}
                        </View>
                        <StockBadge status={status} />
                    </View>

                    <View style={styles.rule} />

                    {/* Stats grid */}
                    <View style={styles.statsRow}>
                        <StatCell label="Stock" value={String(item.inventario?.cantidad ?? 0)} />
                        <StatCell label="Compra" value={`S/ ${compra.toFixed(2)}`} />
                        <StatCell label="Ganancia" value={`S/ ${ganancia}`} />
                        <StatCell label="Margen" value={`${margen}%`} />
                    </View>

                    {/* Footer */}
                    <View style={styles.cardFooter}>
                        <Icon name="chevron-right" size={16} color={T.textMuted} />
                    </View>
                </View>
            </TouchableOpacity>

            <ImageViewing
                images={[{ uri: getImagenProducto(item) }]}
                imageIndex={0}
                visible={imageVisible}
                onRequestClose={() => setImageVisible(false)}
            />
        </View>
    );
}

export const ProductosScreen = () => {
    const {
        productos,
        fetchNextProductosPage,
        hasNextProductosPage,
        isFetchingNextProductosPage,
        refetchProductos,
        isLoading,
        error,
    } = useProductos();

    const [search, setSearch] = useState('');
    const [stockFilter, setStockFilter] = useState<StockFilterKey>('todos_stock');
    const [catActiva, setCatActiva] = useState('Todos');
    const [refreshing, setRefreshing] = useState(false);

    // 🔄 Refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await refetchProductos();
        } finally {
            setRefreshing(false);
        }
    };

    // 📂 Categorías
    const categorias = useMemo(() => {
        const names = (productos ?? [])
            .map((p) => p.categoria_nombre)
            .filter(Boolean) as string[];

        return ['Todos', ...Array.from(new Set(names))];
    }, [productos]);

    // 🔍 Filtro
    const filtered = useMemo(() => {
        const q = search.toLowerCase();

        return (productos ?? []).filter((p) => {
            const matchSearch =
                p.nombre.toLowerCase().includes(q) ||
                (p.sku ?? '').toLowerCase().includes(q);

            const status = getStockStatus(p.inventario?.cantidad);
            const matchStock =
                stockFilter === 'todos_stock' || status === stockFilter;

            const matchCat =
                catActiva === 'Todos' || p.categoria_nombre === catActiva;

            return matchSearch && matchStock && matchCat;
        });
    }, [productos, search, stockFilter, catActiva]);

    // ⏳ Loading
    if (isLoading) {
        return (
            <View style={styles.center}>
                <View style={styles.loadingIcon}>
                    <Icon name="cube-outline" size={28} color={T.accent} />
                </View>
                <Text style={styles.stateText}>Cargando productos...</Text>
            </View>
        );
    }

    // ❌ Error
    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.stateText}>Error al cargar</Text>
                <Text style={styles.stateSub}>{error.message}</Text>
            </View>
        );
    }

    const ListHeader = (
        <View>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Productos</Text>
                    <Text style={styles.headerSub}>
                        {filtered.length} registro{filtered.length !== 1 ? 's' : ''}
                    </Text>
                </View>
                <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
                    <Icon name="plus" size={16} color={T.bg} />
                    <Text style={styles.fabText}>Crear</Text>
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
                <Icon name="magnify" size={18} color={T.textMuted} />
                <TextInput
                    placeholder="Buscar por nombre o SKU..."
                    placeholderTextColor={T.textMuted}
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                    selectionColor={T.accent}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Icon name="close-circle" size={16} color={T.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Categoría */}
            <Text style={styles.filterLabel}>CATEGORÍA</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScroll}
                style={{ marginBottom: 16 }}
            >
                {categorias.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.chip, catActiva === cat && styles.chipActive]}
                        onPress={() => setCatActiva(cat)}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.chipText, catActiva === cat && styles.chipTextActive]}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Stock */}
            <Text style={styles.filterLabel}>STOCK</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScroll}
                style={{ marginBottom: 24 }}
            >
                {STOCK_FILTERS.map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        style={[styles.chip, stockFilter === f.key && styles.chipActive]}
                        onPress={() => setStockFilter(f.key)}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.chipText, stockFilter === f.key && styles.chipTextActive]}>
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: T.bg }}>


            <View style={styles.screen}>
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={ListHeader}

                    renderItem={({ item }) => <ProductCard item={item} />}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}

                    // 🔄 Pull to refresh
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={T.accent}
                            colors={[T.accent]}
                        />
                    }

                    // 🔥 Infinite scroll
                    onEndReached={() => {
                        if (hasNextProductosPage && !isFetchingNextProductosPage) {
                            fetchNextProductosPage();
                        }
                    }}
                    onEndReachedThreshold={0.3}

                    // ⏳ Loader final
                    ListFooterComponent={
                        isFetchingNextProductosPage ? (
                            <ActivityIndicator
                                size="small"
                                color={T.accent}
                                style={{ marginVertical: 16 }}
                            />
                        ) : null
                    }

                    ListEmptyComponent={
                        <View style={styles.emptyWrap}>
                            <View style={styles.emptyIcon}>
                                <Icon name="package-variant-closed" size={32} color={T.accent} />
                            </View>
                            <Text style={styles.emptyText}>Sin resultados</Text>
                            <Text style={styles.emptySub}>Prueba productos</Text>
                        </View>
                    }
                />
            </View>
        </GestureHandlerRootView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: T.bg },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: T.bg, gap: 12 },
    loadingIcon: {
        width: 60, height: 60, borderRadius: 18,
        backgroundColor: T.accentDim, borderWidth: 1, borderColor: T.accent + '30',
        alignItems: 'center', justifyContent: 'center',
    },
    stateText: { fontSize: 14, color: T.textSecondary },
    stateSub: { fontSize: 12, color: T.textMuted, marginTop: 4 },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 56, paddingBottom: 16,
        borderBottomWidth: 1, borderBottomColor: T.border,
    },
    headerTitle: { fontSize: 30, fontWeight: '900', color: T.textPrimary, letterSpacing: -1 },
    headerSub: { fontSize: 12, color: T.textSecondary, marginTop: 2 },

    fab: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: T.accent, borderRadius: T.radiusFull,
        paddingHorizontal: 16, paddingVertical: 10,
        ...T.shadowAccent,
    },
    fabText: { color: T.bg, fontWeight: '800', fontSize: 13 },

    listContent: { paddingHorizontal: 20, paddingBottom: 110 },

    searchWrap: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: T.surface, borderRadius: T.radiusMd,
        borderWidth: 1, borderColor: T.border,
        paddingHorizontal: 14, marginTop: 16, marginBottom: 20,
    },
    searchInput: { flex: 1, fontSize: 14, color: T.textPrimary, paddingVertical: 14 },

    filterLabel: { fontSize: 10, color: T.textMuted, letterSpacing: 1.5, fontWeight: '700', marginBottom: 10 },
    filterScroll: { gap: 8, paddingRight: 4 },

    chip: {
        borderRadius: T.radiusFull, paddingHorizontal: 14, paddingVertical: 8,
        borderWidth: 1, borderColor: T.border, backgroundColor: T.surface,
    },
    chipActive: { backgroundColor: T.accent, borderColor: T.accent },
    chipText: { fontSize: 13, color: T.textSecondary, fontWeight: '500' },
    chipTextActive: { color: T.bg, fontWeight: '700' },

    // Card
    card: {
        backgroundColor: T.surface, borderRadius: T.radiusLg,
        overflow: 'hidden', flexDirection: 'row',
        borderWidth: 1, borderColor: T.border,
    },
    cardImageWrap: { position: 'relative' },
    cardImage: { width: 110, height: 150 },
    pricePill: {
        position: 'absolute', bottom: 10, left: 8,
        backgroundColor: T.bg + 'dd', borderRadius: 20,
        paddingHorizontal: 8, paddingVertical: 4,
        borderWidth: 1, borderColor: T.border,
    },
    priceText: { fontSize: 12, fontWeight: '800', color: T.accent },
    cardBody: { flex: 1, padding: 12 },
    cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 },
    categoryLabel: { fontSize: 9, fontWeight: '700', color: T.accent, letterSpacing: 1.5, marginBottom: 3 },
    cardName: { fontSize: 14, fontWeight: '700', color: T.textPrimary, lineHeight: 19, flex: 1 },
    skuText: { fontSize: 10, color: T.textMuted, marginTop: 3 },
    rule: { height: 1, backgroundColor: T.border, marginVertical: 10 },
    statsRow: { flexDirection: 'row' },
    statCell: { flex: 1 },
    statLabel: { fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
    statValue: { fontSize: 11, fontWeight: '600', color: T.textSecondary },
    cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },

    badge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
    badgeDot: { width: 5, height: 5, borderRadius: 3 },
    badgeText: { fontSize: 10, fontWeight: '700' },

    emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyIcon: {
        width: 64, height: 64, borderRadius: 20,
        backgroundColor: T.accentDim, borderWidth: 1, borderColor: T.accent + '30',
        alignItems: 'center', justifyContent: 'center',
    },
    emptyText: { fontSize: 15, color: T.textSecondary, fontWeight: '600' },
    emptySub: { fontSize: 12, color: T.textMuted },
});