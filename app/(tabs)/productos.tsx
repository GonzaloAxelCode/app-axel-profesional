import { useProductos } from '@/State/hooks/useProductos';
import { Producto } from '@/State/models/producto.models';
import { C } from '@/State/utils/c';
import { URLS } from '@/State/utils/endpoints';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import { useMemo, useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';



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
    in_stock: { label: 'En stock', color: '#4ade80', bg: '#4ade8014' },
    low_stock: { label: 'Stock bajo', color: '#f59e0b', bg: '#f59e0b14' },
    no_stock: { label: 'Agotado', color: '#ef4444', bg: '#ef444414' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StockBadge({ status }: { status: StockStatus }) {
    const cfg = STOCK_CFG[status];
    return (
        <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
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

// ─── FeaturedCard ─────────────────────────────────────────────────────────────
function FeaturedCard({ item }: { item: Producto }) {
    const [imageVisible, setImageVisible] = useState(false);
    const status = getStockStatus(item.inventario?.cantidad);
    const venta = Number(item.inventario?.costo_venta ?? 0);
    const compra = Number(item.inventario?.costo_compra ?? 0);
    const ganancia = (venta - compra).toFixed(2);
    const margen = venta > 0 ? Math.round(((venta - compra) / venta) * 100) : 0;

    return (
        <View style={styles.featuredCard}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => setImageVisible(true)}>
                <Image
                    source={{ uri: getImagenProducto(item) }}
                    style={styles.featuredImage}
                    contentFit="cover"
                />
                {/* Overlay badge */}
                <View style={styles.featuredPricePill}>
                    <Text style={styles.featuredPriceText}>S/ {venta.toFixed(2)}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.featuredBody}>
                <View style={styles.rowBetween}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        {item.categoria_nombre && (
                            <Text style={styles.categoryLabel}>{item.categoria_nombre.toUpperCase()}</Text>
                        )}
                        <Text style={styles.featuredName} numberOfLines={2}>{item.nombre}</Text>
                        {item.sku && <Text style={styles.skuText}>SKU: {item.sku}</Text>}
                    </View>
                    <StockBadge status={status} />
                </View>

                <View style={styles.rule} />

                <View style={styles.statsRow}>
                    <StatCell label="Stock" value={String(item.inventario?.cantidad ?? 0)} />
                    <StatCell label="Compra" value={`S/ ${compra.toFixed(2)}`} />
                    <StatCell label="Ganancia" value={`S/ ${ganancia}`} />
                    <StatCell label="Margen" value={`${margen}%`} />
                </View>
            </View>

            <ImageViewing
                images={[{ uri: getImagenProducto(item) }]}
                imageIndex={0}
                visible={imageVisible}
                onRequestClose={() => setImageVisible(false)}
            />
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
            <TouchableOpacity activeOpacity={0.9} onPress={() => setImageVisible(true)}>
                <Image
                    source={{ uri: getImagenProducto(item) }}
                    style={styles.cardImage}
                    contentFit="cover"
                />
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push({ pathname: '/productodetail', params: { id: item.id } })}
                style={{ flex: 1 }}
            >
                <View style={styles.cardBody}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardName} numberOfLines={2}>{item.nombre}</Text>
                        <StockBadge status={status} />
                    </View>
                    <Text style={styles.cardSku}>
                        {[item.sku && `SKU: ${item.sku}`, item.categoria_nombre]
                            .filter(Boolean).join('  ·  ')}
                    </Text>
                    <View style={styles.rule} />
                    <View style={styles.statsRow}>
                        <StatCell label="Stock" value={String(item.inventario?.cantidad ?? 0)} />
                        <StatCell label="Compra" value={`S/ ${compra.toFixed(2)}`} />
                        <StatCell label="Ganancia" value={`S/ ${ganancia}`} />
                        <StatCell label="Margen" value={`${margen}%`} />
                    </View>
                    <View style={styles.cardPriceRow}>
                        <Text style={styles.cardPrice}>S/ {venta.toFixed(2)}</Text>
                        <Icon name="chevron-right" size={16} color={C.textMuted} />
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

// ─── ProductosScreen ──────────────────────────────────────────────────────────
export const ProductosScreen = () => {
    const { data, isLoading, error } = useProductos();
    const [search, setSearch] = useState('');
    const [stockFilter, setStockFilter] = useState<StockFilterKey>('todos_stock');
    const [catActiva, setCatActiva] = useState('Todos');

    const categorias = useMemo(() => {
        const names = (data?.results ?? [])
            .map((p) => p.categoria_nombre).filter(Boolean) as string[];
        return ['Todos', ...Array.from(new Set(names))];
    }, [data]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return (data?.results ?? []).filter((p) => {
            const matchSearch = p.nombre.toLowerCase().includes(q) || (p.sku ?? '').toLowerCase().includes(q);
            const status = getStockStatus(p.inventario?.cantidad);
            const matchStock = stockFilter === 'todos_stock' || status === stockFilter;
            const matchCat = catActiva === 'Todos' || p.categoria_nombre === catActiva;
            return matchSearch && matchStock && matchCat;
        });
    }, [data, search, stockFilter, catActiva]);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <Text style={styles.stateText}>Cargando productos...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.stateText}>Error al cargar</Text>
                <Text style={styles.stateSub}>{error.message}</Text>
            </View>
        );
    }

    const featured = filtered[0];
    const rest = filtered.slice(1);

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
                    <Icon name="plus" size={15} color={C.bg} />
                    <Text style={styles.fabText}>Crear</Text>
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
                <Icon name="magnify" size={16} color={C.textMuted} />
                <TextInput
                    placeholder="Buscar por nombre o SKU..."
                    placeholderTextColor={C.textMuted}
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                    selectionColor={C.accent}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Icon name="close-circle" size={15} color={C.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Categoría */}
            <Text style={styles.filterLabel}>CATEGORÍA</Text>
            <ScrollView
                horizontal showsHorizontalScrollIndicator={false}
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
                horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScroll}
                style={{ marginBottom: 20 }}
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

            {/* Featured */}
            {featured && <FeaturedCard item={featured} />}
        </View>
    );

    return (
        <View style={styles.screen}>
            <FlatList
                data={rest}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={ListHeader}
                renderItem={({ item }) => <ProductCard item={item} />}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListEmptyComponent={
                    !featured ? (
                        <View style={styles.emptyWrap}>
                            <Icon name="package-variant-closed" size={40} color={C.textMuted} />
                            <Text style={styles.emptyText}>Sin resultados</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.bg },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg },
    stateText: { fontSize: 15, color: C.textSecondary },
    stateSub: { fontSize: 12, color: C.textMuted, marginTop: 4 },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 56, paddingBottom: 16,
        borderBottomWidth: 1, borderBottomColor: C.border,
    },
    headerTitle: { fontSize: 28, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.5 },
    headerSub: { fontSize: 12, color: C.textSecondary, marginTop: 2 },

    fab: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: C.accent, borderRadius: 20,
        paddingHorizontal: 14, paddingVertical: 10,
    },
    fabText: { color: C.bg, fontWeight: '700', fontSize: 13 },

    listContent: { paddingHorizontal: 20, paddingBottom: 110 },

    searchWrap: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border,
        paddingHorizontal: 14, marginTop: 16, marginBottom: 20,
    },
    searchInput: { flex: 1, fontSize: 14, color: C.textPrimary, paddingVertical: 13 },

    filterLabel: { fontSize: 10, color: C.textMuted, letterSpacing: 1.2, fontWeight: '600', marginBottom: 8 },
    filterScroll: { gap: 8, paddingRight: 4 },

    chip: {
        borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
        borderWidth: 1, borderColor: C.border, backgroundColor: C.surface,
    },
    chipActive: { backgroundColor: C.accent, borderColor: C.accent },
    chipText: { fontSize: 13, color: C.textSecondary, fontWeight: '500' },
    chipTextActive: { color: C.bg, fontWeight: '700' },

    rowBetween: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
    rule: { height: 1, backgroundColor: C.border, marginVertical: 10 },
    statsRow: { flexDirection: 'row' },
    statCell: { flex: 1 },
    statLabel: { fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
    statValue: { fontSize: 12, fontWeight: '600', color: C.textSecondary },

    badge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
    badgeDot: { width: 5, height: 5, borderRadius: 3 },
    badgeText: { fontSize: 11, fontWeight: '600' },

    categoryLabel: { fontSize: 9, fontWeight: '700', color: C.accent, letterSpacing: 1.2, marginBottom: 4 },
    skuText: { fontSize: 11, color: C.textMuted, marginTop: 3 },

    // Featured
    featuredCard: {
        backgroundColor: C.surface, borderRadius: 16,
        overflow: 'hidden', borderWidth: 1, borderColor: C.border, marginBottom: 12,
    },
    featuredImage: { width: '100%', height: 200 },
    featuredPricePill: {
        position: 'absolute', bottom: 12, right: 12,
        backgroundColor: C.bg + 'cc', borderRadius: 20,
        paddingHorizontal: 12, paddingVertical: 6,
        borderWidth: 1, borderColor: C.border,
    },
    featuredPriceText: { fontSize: 15, fontWeight: '800', color: C.accent },
    featuredBody: { padding: 14 },
    featuredName: { fontSize: 17, fontWeight: '700', color: C.textPrimary, lineHeight: 22, marginBottom: 4 },

    // Card
    card: {
        backgroundColor: C.surface, borderRadius: 14,
        overflow: 'hidden', flexDirection: 'row',
        borderWidth: 1, borderColor: C.border,
    },
    cardImage: { width: 100, height: 140 },
    cardBody: { flex: 1, padding: 12 },
    cardName: { flex: 1, fontSize: 13, fontWeight: '600', color: C.textPrimary, lineHeight: 18 },
    cardSku: { fontSize: 10, color: C.textMuted, marginTop: 3, marginBottom: 4 },
    cardPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    cardPrice: { fontSize: 15, fontWeight: '800', color: C.textPrimary },

    emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyText: { fontSize: 14, color: C.textMuted },
});