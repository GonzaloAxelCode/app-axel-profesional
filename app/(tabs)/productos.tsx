import { useProductos } from '@/State/hooks/useProductos';
import { Producto } from '@/State/models/producto.models';
import { URLS } from '@/State/utils/endpoints';
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
// ─── helpers ──────────────────────────────────────────────────────────────────

const getImagenProducto = (producto: Producto) =>
    producto?.imagen ? URLS.BASE + producto.imagen : URLS.IMAGE_URL_PLACEHOLDER;

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

const STOCK_BADGE: Record<StockStatus, { label: string; bg: string; color: string }> = {
    in_stock: { label: 'En stock', bg: '#EAF3DE', color: '#3B6D11' },
    low_stock: { label: 'Stock bajo', bg: '#FAEEDA', color: '#854F0B' },
    no_stock: { label: 'Agotado', bg: '#FCEBEB', color: '#A32D2D' },
};

// ─── sub-components ───────────────────────────────────────────────────────────

function StockBadge({ status }: { status: StockStatus }) {
    const cfg = STOCK_BADGE[status];
    return (
        <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
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

function MetaChip({ value }: { value: string }) {
    return (
        <View style={styles.chip}>
            <Text style={styles.chipText}>{value}</Text>
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
                    placeholder={URLS.IMAGE_URL_PLACEHOLDER}
                />
            </TouchableOpacity>
            <View style={styles.featuredBody}>
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        {item.categoria_nombre ? (
                            <View style={styles.catPill}>
                                <Text style={styles.catPillText}>
                                    {item.categoria_nombre.toUpperCase()}
                                </Text>
                            </View>
                        ) : null}
                        <Text style={styles.featuredName} numberOfLines={2}>
                            {item.nombre}
                        </Text>
                    </View>
                    <StockBadge status={status} />
                </View>

                {item.sku ? <Text style={styles.skuText}>SKU: {item.sku}</Text> : null}

                <View style={styles.chips}>
                    {item.marca ? <MetaChip value={item.marca} /> : null}
                    {item.modelo ? <MetaChip value={item.modelo} /> : null}

                </View>

                <View style={styles.divider} />

                <View style={styles.statsRow}>
                    <StatCell label="Stock" value={String(item.inventario?.cantidad ?? 0)} />
                    <StatCell label="Compra" value={`S/ ${compra.toFixed(2)}`} />
                    <StatCell label="Ganancia" value={`S/ ${ganancia}`} />
                    <StatCell label="Margen" value={`${margen}%`} />
                </View>

                <View style={styles.divider} />

                <View style={styles.featuredFooter}>
                    <Text style={styles.featuredPrice}>S/ {venta.toFixed(2)}</Text>

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

    function handleSelectProducto(id: any) {
        router.push({
            pathname: '/productodetail',
            params: { id }
        });
    }

    return (
        <View style={styles.card} >
            <TouchableOpacity activeOpacity={0.9} onPress={() => setImageVisible(true)}>
                <Image
                    source={{ uri: getImagenProducto(item) }}
                    style={styles.cardImage}
                    contentFit="cover"
                    placeholder={URLS.IMAGE_URL_PLACEHOLDER}
                />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} onPress={() => handleSelectProducto(item.id)} style={{ flex: 1 }}>


                <View style={styles.cardBody}>
                    <View style={styles.row}>
                        <Text style={styles.cardName} numberOfLines={2}>{item.nombre}</Text>
                        <StockBadge status={status} />
                    </View>

                    <Text style={styles.cardSku}>
                        {[item.sku && `SKU: ${item.sku}`, item.categoria_nombre]
                            .filter(Boolean)
                            .join('  ·  ')}
                    </Text>

                    <View style={[styles.row, { marginTop: 6 }]}>
                        <View style={styles.chips}>
                            {item.marca ? <MetaChip value={item.marca} /> : null}

                        </View>
                        <Text style={styles.cardPrice}>S/ {venta.toFixed(2)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statsRow}>
                        <StatCell label="Stock" value={String(item.inventario?.cantidad ?? 0)} />
                        <StatCell label="Compra" value={`S/ ${compra.toFixed(2)}`} />
                        <StatCell label="Ganancia" value={`S/ ${ganancia}`} />
                        <StatCell label="Margen" value={`${margen}%`} />
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

// ─── main screen ──────────────────────────────────────────────────────────────



export const ProductosScreen = () => {
    // Trae todos los productos sin paginación
    const { data, isLoading, error } = useProductos(); // ⚠️ aquí quita parámetros de page/limit
    const [search, setSearch] = useState('');
    const [stockFilter, setStockFilter] = useState<StockFilterKey>('todos_stock');
    const [catActiva, setCatActiva] = useState('Todos');

    const categorias = useMemo(() => {
        const names = (data?.results ?? []).map((p) => p.categoria_nombre).filter(Boolean) as string[];
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
                <TouchableOpacity
                    style={styles.fab}

                    activeOpacity={0.85}
                >

                    <Text style={styles.fabText}>Crear Producto</Text>
                </TouchableOpacity>
            </View>


            {/* Search */}
            <View style={styles.searchWrap}>
                <TextInput
                    placeholder="Buscar por nombre o SKU..."
                    placeholderTextColor="#9ca3af"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />
            </View>

            {/* Filtros */}
            <Text style={styles.filterSectionLabel}>CATEGORÍA</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll} style={styles.filterScrollWrapper}>
                {categorias.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.filterTab, catActiva === cat && styles.filterTabActive]}
                        onPress={() => setCatActiva(cat)}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.filterTabText, catActiva === cat && styles.filterTabTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.filterSectionLabel}>STOCK</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll} style={[styles.filterScrollWrapper, { marginBottom: 14 }]}>
                {STOCK_FILTERS.map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        style={[styles.filterTab, stockFilter === f.key && styles.filterTabActive]}
                        onPress={() => setStockFilter(f.key)}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.filterTabText, stockFilter === f.key && styles.filterTabTextActive]}>{f.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Featured */}
            {featured ? <FeaturedCard item={featured} /> : null}
        </View>
    );

    return (
        <View style={styles.screen}>
            <FlatList
                data={rest}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={ListHeader}
                renderItem={({ item }) => <ProductCard item={item} />}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListEmptyComponent={!featured ? <Text style={styles.emptyText}>Sin resultados</Text> : null}
            />
        </View>
    );
};
// ─── styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    stateText: { fontSize: 16, fontWeight: '500', color: '#111' },
    stateSub: { fontSize: 13, color: '#9ca3af', marginTop: 4 },
    emptyText: { fontSize: 14, color: '#9ca3af', paddingVertical: 32, textAlign: 'center' },


    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    title: { fontSize: 34, fontWeight: '500', color: '#111', letterSpacing: -0.5 },
    countBadge: {
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 0.5,
        borderColor: '#e5e7eb',
        marginBottom: 4,
    },
    countText: { fontSize: 12, color: '#6b7280' },

    searchWrap: { marginHorizontal: 0, marginBottom: 14, paddingTop: 20 },
    searchInput: {
        backgroundColor: '#f3f4f6',
        borderRadius: 35,
        paddingHorizontal: 16,
        paddingVertical: 13,
        fontSize: 16,
        color: '#111',
        borderWidth: 0.5,
        borderColor: '#e5e7eb',
    },

    filterSectionLabel: {
        fontSize: 12,
        color: 'black',
        letterSpacing: 0.6,
        marginLeft: 10,
        marginBottom: 6,
    },
    filterScrollWrapper: { flexGrow: 0 },
    filterScroll: { paddingHorizontal: 20, gap: 8, paddingBottom: 10 },
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

    list: { paddingHorizontal: 20, paddingBottom: 40 },

    row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
    chips: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', flex: 1 },
    chip: { backgroundColor: '#f3f4f6', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
    chipText: { fontSize: 11, color: '#6b7280' },
    divider: { height: 0.5, backgroundColor: '#e5e7eb', marginVertical: 8 },
    statsRow: { flexDirection: 'row' },
    statCell: { flex: 1 },
    statLabel: { fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 },
    statValue: { fontSize: 12, fontWeight: '500', color: '#111', marginTop: 1 },
    skuText: { fontSize: 11, color: '#9ca3af', marginTop: 3, letterSpacing: 0.3 },
    catPill: {
        alignSelf: 'flex-start',
        backgroundColor: '#111',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginBottom: 5,
    },
    catPillText: { fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 0.4 },
    badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
    badgeText: { fontSize: 11, fontWeight: '500' },

    featuredCard: {
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: '#e5e7eb',
        marginBottom: 10,
    },
    featuredImage: { width: '100%', height: 180 },
    featuredPill: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#111',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    featuredPillText: { fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
    featuredBody: { padding: 14 },
    featuredName: { fontSize: 17, fontWeight: '500', color: '#111', lineHeight: 22, marginTop: 4 },
    featuredFooter: { flexDirection: 'row', justifyContent: "flex-start" },
    featuredPrice: { fontSize: 22, fontWeight: '500', color: '#111', letterSpacing: -0.5 },
    addBtn: { backgroundColor: '#111', borderRadius: 22, paddingHorizontal: 18, paddingVertical: 9 },
    addBtnText: { fontSize: 13, fontWeight: '500', color: '#fff' },

    card: {


        borderRadius: 12,
        overflow: 'hidden',
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#e5e7eb',
    },
    cardImage: { width: 100, height: 150, maxHeight: 150 },
    cardBody: { flex: 1, padding: 10 },
    cardName: { flex: 1, fontSize: 14, fontWeight: '500', color: '#111', lineHeight: 18 },
    cardSku: { fontSize: 11, color: '#9ca3af', marginTop: 3, letterSpacing: 0.3 },
    cardPrice: { fontSize: 15, fontWeight: '500', color: '#111' },








    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 0, paddingTop: 56, paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb',
    },
    headerTitle: { fontSize: 28, fontWeight: '700', color: '#111' },
    headerSub: { fontSize: 13, color: '#9ca3af', marginTop: 2 },

    fab: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#111', borderRadius: 20,
        paddingHorizontal: 16, paddingVertical: 10,
    },
    fabText: { color: '#fff', fontWeight: '600', fontSize: 14 },

});