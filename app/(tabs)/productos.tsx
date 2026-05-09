import ProductCard from '@/components/ProductComponents/ProductCard';
import T from '@/constants/THEME';
import { useProductos } from '@/State/hooks/useProductos';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
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
import { ActivityIndicator, Text } from 'react-native-paper';

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Screen ───────────────────────────────────────────────────────────────────
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

    const handleRefresh = async () => {
        setRefreshing(true);
        try { await refetchProductos(); }
        finally { setRefreshing(false); }
    };

    const categorias = useMemo(() => {
        const names = (productos ?? [])
            .map((p) => p.categoria_nombre)
            .filter(Boolean) as string[];
        return ['Todos', ...Array.from(new Set(names))];
    }, [productos]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return (productos ?? []).filter((p) => {
            const matchSearch = p.nombre.toLowerCase().includes(q) || (p.sku ?? '').toLowerCase().includes(q);
            const matchStock = stockFilter === 'todos_stock' || getStockStatus(p.inventario?.cantidad) === stockFilter;
            const matchCat = catActiva === 'Todos' || p.categoria_nombre === catActiva;
            return matchSearch && matchStock && matchCat;
        });
    }, [productos, search, stockFilter, catActiva]);

    // ── Loading ──
    if (isLoading) return (
        <View style={s.center}>
            <View style={s.stateIcon}>
                <Icon name="cube-outline" size={28} color={T.accent} />
            </View>
            <Text style={s.stateText}>Cargando productos...</Text>
        </View>
    );

    // ── Error ──
    if (error) return (
        <View style={s.center}>
            <View style={[s.stateIcon, { backgroundColor: T.red + '18', borderColor: T.red + '30' }]}>
                <Icon name="alert-circle-outline" size={28} color={T.red} />
            </View>
            <Text style={s.stateText}>Error al cargar</Text>
            <Text style={s.stateSub}>{error.message}</Text>
            <TouchableOpacity style={s.retryBtn} onPress={handleRefresh} activeOpacity={0.8} disabled={refreshing}>
                {refreshing
                    ? <ActivityIndicator size="small" color={T.bg} />
                    : <><Icon name="refresh" size={15} color={T.bg} /><Text style={s.retryText}>Reintentar</Text></>
                }
            </TouchableOpacity>
        </View>
    );

    // ── List header ──
    const ListHeader = (
        <View>
            <View style={s.header}>
                <View>
                    <Text style={s.headerTitle}>Productos</Text>
                    <Text style={s.headerSub}>{filtered.length} registro{filtered.length !== 1 ? 's' : ''}</Text>
                </View>
                <TouchableOpacity style={s.fab} activeOpacity={0.85}>
                    <Icon name="plus" size={16} color={T.bg} />
                    <Text style={s.fabText}>Crear</Text>
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={s.searchWrap}>
                <Icon name="magnify" size={18} color={T.textMuted} />
                <TextInput
                    placeholder="Buscar por nombre o SKU..."
                    placeholderTextColor={T.textMuted}
                    value={search}
                    onChangeText={setSearch}
                    style={s.searchInput}
                    selectionColor={T.accent}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Icon name="close-circle" size={16} color={T.textMuted} />
                    </TouchableOpacity>
                )}
            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterScroll} style={{ marginBottom: 14 }}>
                {categorias.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[s.chip, catActiva === cat && s.chipActive]}
                        onPress={() => setCatActiva(cat)}
                        activeOpacity={0.8}
                    >
                        <Text style={[s.chipText, catActiva === cat && s.chipTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/*             <Text style={s.filterLabel}>STOCK</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterScroll} style={{ marginBottom: 20 }}>
                {STOCK_FILTERS.map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        style={[s.chip, stockFilter === f.key && s.chipActive]}
                        onPress={() => setStockFilter(f.key)}
                        activeOpacity={0.8}
                    >
                        <Text style={[s.chipText, stockFilter === f.key && s.chipTextActive]}>{f.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            Stock */}

        </View>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: T.bg }}>
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}                          // ← 2 columnas
                columnWrapperStyle={s.row}              // ← gap horizontal
                contentContainerStyle={s.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={ListHeader}
                renderItem={({ item }) => <ProductCard item={item} />}

                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={T.accent} colors={[T.accent]} />
                }

                onEndReached={() => {
                    if (hasNextProductosPage && !isFetchingNextProductosPage) fetchNextProductosPage();
                }}
                onEndReachedThreshold={0.3}

                ListFooterComponent={
                    isFetchingNextProductosPage
                        ? <ActivityIndicator size="small" color={T.accent} style={{ marginVertical: 16 }} />
                        : null
                }

                ListEmptyComponent={
                    <View style={s.emptyWrap}>
                        <View style={s.stateIcon}>
                            <Icon name="package-variant-closed" size={32} color={T.accent} />
                        </View>
                        <Text style={s.stateText}>Sin resultados</Text>
                        <Text style={s.stateSub}>Ajusta los filtros</Text>
                    </View>
                }
            />
        </GestureHandlerRootView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    // Layout
    listContent: { paddingHorizontal: 20, paddingBottom: 110 },
    row: { gap: 12, marginBottom: 12 },

    // States
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: T.bg, gap: 12 },
    stateIcon: {
        width: 60, height: 60, borderRadius: 18,
        backgroundColor: T.accentDim, borderWidth: 1, borderColor: T.accent + '30',
        alignItems: 'center', justifyContent: 'center',
    },
    stateText: { fontSize: 14, color: T.textSecondary, fontWeight: '600' },
    stateSub: { fontSize: 12, color: T.textMuted },

    retryBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: T.accent, borderRadius: T.radiusFull,
        paddingHorizontal: 20, paddingVertical: 11, marginTop: 4,
        justifyContent: 'center', ...T.shadowAccent,
    },
    retryText: { color: T.bg, fontWeight: '800', fontSize: 13 },

    // Header
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

    // Search
    searchWrap: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: T.surface, borderRadius: T.radiusMd,
        borderWidth: 1, borderColor: T.border,
        paddingHorizontal: 14, marginTop: 16, marginBottom: 20,
    },
    searchInput: { flex: 1, fontSize: 14, color: T.textPrimary, paddingVertical: 14 },

    // Filters
    filterLabel: { fontSize: 10, color: T.textMuted, letterSpacing: 1.5, fontWeight: '700', marginBottom: 10 },
    filterScroll: { gap: 8, paddingRight: 4 },

    chip: { borderRadius: T.radiusFull, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: T.border, backgroundColor: T.surface },
    chipActive: { backgroundColor: T.accent, borderColor: T.accent },
    chipText: { fontSize: 13, color: T.textSecondary, fontWeight: '500' },
    chipTextActive: { color: T.bg, fontWeight: '700' },

    // Empty
    emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 10 },
});