import ProductCard from '@/components/ProductComponents/ProductCard';
import { useAppTheme } from '@/State/context/ThemeContext';
import { useProductos } from '@/State/hooks/useProductos';
import { Producto } from '@/State/models/producto.models';
import { URLS } from '@/State/utils/endpoints';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

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

// ─── Skeleton Component ──────────────────────────────────────────────────────
function Skeleton({ width, height, borderRadius = 8, T }: { width: number | string; height: number; borderRadius?: number; T: any }) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, []);

    return (
        <Animated.View style={{
            width,
            height,
            borderRadius,
            backgroundColor: T.surfaceAlt,
            opacity,
        }} />
    );
}

function SkeletonCard({ T }: { T: any }) {
    return (
        <View style={[stylesSkeleton.card, { backgroundColor: T.surface, borderColor: T.border }]}>
            <Skeleton width="100%" height={120} borderRadius={12} T={T} />
            <View style={stylesSkeleton.cardBody}>
                <Skeleton width="80%" height={14} T={T} />
                <Skeleton width="50%" height={10} T={T} />
                <Skeleton width="40%" height={12} T={T} />
            </View>
        </View>
    );
}

const stylesSkeleton = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    cardBody: {
        padding: 12,
        gap: 8,
    },
});

// ─── Screen ──────────────────────────────────────────────────────────────────
type ViewMode = 'grid' | 'list';

export const ProductosScreen = () => {
    const { T } = useAppTheme();
    const router = useRouter();
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
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

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

    const st = s(T);

    const ListHeader = (
        <View>
            <View style={st.header}>
                <View>
                    <Text style={st.headerTitle}>Productos</Text>
                    <Text style={st.headerSub}>{filtered.length} registro{filtered.length !== 1 ? 's' : ''}</Text>
                </View>
                <View style={st.viewToggle}>
                    <TouchableOpacity
                        style={[st.toggleBtn, viewMode === 'grid' && st.toggleBtnActive]}
                        onPress={() => setViewMode('grid')}
                        activeOpacity={0.7}
                    >
                        <Icon name="view-grid-outline" size={18} color={viewMode === 'grid' ? T.accent : T.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[st.toggleBtn, viewMode === 'list' && st.toggleBtnActive]}
                        onPress={() => setViewMode('list')}
                        activeOpacity={0.7}
                    >
                        <Icon name="view-list-outline" size={18} color={viewMode === 'list' ? T.accent : T.textMuted} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={st.searchWrap}>
                <Icon name="magnify" size={18} color={T.textMuted} />
                <TextInput
                    placeholder="Buscar por nombre o SKU..."
                    placeholderTextColor={T.textMuted}
                    value={search}
                    onChangeText={setSearch}
                    style={st.searchInput}
                    selectionColor={T.accent}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Icon name="close-circle" size={16} color={T.textMuted} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={() => router.push('/barcode-scanner')}
                    style={st.scanButton}
                    activeOpacity={0.7}
                >
                    <Icon name="barcode-scan" size={20} color={T.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.filterScroll} style={{ marginBottom: 14 }}>
                {categorias.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[st.chip, catActiva === cat && st.chipActive]}
                        onPress={() => setCatActiva(cat)}
                        activeOpacity={0.8}
                    >
                        <Text style={[st.chipText, catActiva === cat && st.chipTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    if (isLoading) return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: T.bg }}>
            <View style={st.header}>
                <View>
                    <Text style={st.headerTitle}>Productos</Text>
                    <Text style={st.headerSub}>Cargando...</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={st.listContent} showsVerticalScrollIndicator={false}>
                <View style={st.searchWrap}>
                    <Skeleton width={20} height={18} borderRadius={4} T={T} />
                    <Skeleton width="70%" height={14} T={T} />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.filterScroll} style={{ marginBottom: 14 }}>
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} width={70} height={34} borderRadius={20} T={T} />
                    ))}
                </ScrollView>
                <View style={st.row}>
                    <SkeletonCard T={T} />
                    <SkeletonCard T={T} />
                </View>
                <View style={st.row}>
                    <SkeletonCard T={T} />
                    <SkeletonCard T={T} />
                </View>
                <View style={st.row}>
                    <SkeletonCard T={T} />
                    <SkeletonCard T={T} />
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );

    if (error) return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: T.bg }}>
            <View style={st.header}>
                <View>
                    <Text style={st.headerTitle}>Productos</Text>
                    <Text style={st.headerSub}>Error</Text>
                </View>
            </View>
            <View style={st.center}>
                <View style={[st.stateIcon, { backgroundColor: T.red + '18', borderColor: T.red + '30' }]}>
                    <Icon name="alert-circle-outline" size={28} color={T.red} />
                </View>
                <Text style={st.stateText}>Error al cargar</Text>
                <Text style={st.stateSub}>{error.message}</Text>
                <TouchableOpacity style={st.retryBtn} onPress={handleRefresh} activeOpacity={0.8} disabled={refreshing}>
                    {refreshing
                        ? <View style={st.spinner}><SpinnerLoader size={16} color={T.bg} /></View>
                        : <><Icon name="refresh" size={15} color={T.bg} /><Text style={st.retryText}>Reintentar</Text></>
                    }
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: T.bg }}>
            <FlatList
                key={viewMode}
                data={filtered}
                keyExtractor={(item) => item.id.toString()}
                numColumns={viewMode === 'grid' ? 2 : 1}
                columnWrapperStyle={viewMode === 'grid' ? st.row : undefined}
                contentContainerStyle={st.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={ListHeader}
                renderItem={({ item }) =>
                    viewMode === 'grid' ? (
                        <ProductCard item={item} />
                    ) : (
                        <ProductListItem item={item} />
                    )
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={T.accent} colors={[T.accent]} />
                }
                onEndReached={() => {
                    if (hasNextProductosPage && !isFetchingNextProductosPage) fetchNextProductosPage();
                }}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                    isFetchingNextProductosPage
                        ? <View style={{ marginVertical: 16, flexDirection: 'row', gap: 12 }}>
                            {viewMode === 'grid' ? (
                                <>
                                    <SkeletonCard T={T} />
                                    <SkeletonCard T={T} />
                                </>
                            ) : (
                                <SkeletonListItem T={T} />
                            )}
                        </View>
                        : null
                }
                ListEmptyComponent={
                    <View style={st.emptyWrap}>
                        <View style={st.stateIcon}>
                            <Icon name="package-variant-closed" size={32} color={T.accent} />
                        </View>
                        <Text style={st.stateText}>Sin resultados</Text>
                        <Text style={st.stateSub}>Ajusta los filtros</Text>
                    </View>
                }
            />
        </GestureHandlerRootView>
    );
};

// ─── ProductListItem Component ────────────────────────────────────────────────
function ProductListItem({ item }: { item: Producto }) {
    const { T } = useAppTheme();
    const router = useRouter();

    const getImagenProducto = (p: Producto) =>
        p?.imagen ? URLS.BASE + p.imagen : URLS.IMAGE_URL_PLACEHOLDER;

    function getStockStatus(cantidad?: number): StockStatus {
        if (!cantidad || cantidad === 0) return 'no_stock';
        if (cantidad <= 8) return 'low_stock';
        return 'in_stock';
    }

    const STOCK_CFG: Record<StockStatus, { label: string; color: string }> = {
        in_stock: { label: 'En stock', color: T.green },
        low_stock: { label: 'Stock bajo', color: T.amber },
        no_stock: { label: 'Agotado', color: T.red },
    };

    const status = getStockStatus(item.inventario?.cantidad);
    const venta = Number(item.inventario?.costo_venta ?? 0);
    const compra = Number(item.inventario?.costo_compra ?? 0);
    const { label, color } = STOCK_CFG[status];

    const styles = StyleSheet.create({
        card: {
            flexDirection: 'row',
            backgroundColor: T.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: T.border,
            overflow: 'hidden',
            marginBottom: 10,
        },
        image: {
            width: 100,
            height: 100,
        },
        info: {
            flex: 1,
            padding: 12,
            justifyContent: 'center',
            gap: 4,
        },
        topRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        badge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            borderRadius: 99,
            borderWidth: 1,
            paddingHorizontal: 7,
            paddingVertical: 3,
        },
        badgeDot: {
            width: 5,
            height: 5,
            borderRadius: 99,
        },
        badgeLabel: {
            fontSize: 9,
            fontWeight: '700',
        },
        category: {
            fontSize: 9,
            fontWeight: '700',
            color: T.textMuted,
            letterSpacing: 1.4,
        },
        name: {
            fontSize: 14,
            fontWeight: '700',
            color: T.textPrimary,
            lineHeight: 18,
        },
        sku: {
            fontSize: 10,
            color: T.textMuted,
        },
        bottomRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 4,
        },
        price: {
            fontSize: 16,
            fontWeight: '900',
            color: T.textPrimary,
        },
        stockPill: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
            backgroundColor: T.accentDim,
            borderRadius: 99,
            paddingHorizontal: 8,
            paddingVertical: 4,
        },
        stockText: {
            fontSize: 11,
            fontWeight: '700',
            color: T.textMuted,
        },
    });

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/productodetail', params: { id: item.id } })}
        >
            <Image
                source={{ uri: getImagenProducto(item) }}
                style={styles.image}
                contentFit="cover"
            />
            <View style={styles.info}>
                <View style={styles.topRow}>
                    <View style={[styles.badge, { borderColor: color + '35', backgroundColor: color + '18' }]}>
                        <View style={[styles.badgeDot, { backgroundColor: color }]} />
                        <Text style={[styles.badgeLabel, { color }]}>{label}</Text>
                    </View>
                    {item.categoria_nombre && (
                        <Text style={styles.category}>{item.categoria_nombre.toUpperCase()}</Text>
                    )}
                </View>
                <Text style={styles.name} numberOfLines={2}>{item.nombre}</Text>
                {item.sku && <Text style={styles.sku}>SKU {item.sku}</Text>}
                <View style={styles.bottomRow}>
                    <Text style={styles.price}>S/ {venta.toFixed(2)}</Text>
                    <View style={styles.stockPill}>
                        <Icon name="package-variant" size={12} color={T.textMuted} />
                        <Text style={styles.stockText}>{item.inventario?.cantidad ?? 0}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

// ─── SkeletonListItem Component ───────────────────────────────────────────────
function SkeletonListItem({ T }: { T: any }) {
    return (
        <View style={[skeletonListItemStyles.card, { backgroundColor: T.surface, borderColor: T.border }]}>
            <Skeleton width={100} height={100} borderRadius={0} T={T} />
            <View style={skeletonListItemStyles.info}>
                <Skeleton width="40%" height={12} T={T} />
                <Skeleton width="80%" height={14} T={T} />
                <Skeleton width="30%" height={10} T={T} />
                <Skeleton width="50%" height={14} T={T} />
            </View>
        </View>
    );
}

const skeletonListItemStyles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        borderRadius: 14,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 10,
    },
    info: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
        gap: 8,
    },
});

// ─── Spinner for retry ───────────────────────────────────────────────────────
function SpinnerLoader({ size = 20, color }: { size?: number; color: string }) {
    const spinValue = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, { toValue: 1, duration: 900, useNativeDriver: true })
        ).start();
    }, []);
    const rotate = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    return (
        <Animated.View style={{ width: size, height: size, transform: [{ rotate }] }}>
            <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2.5, borderColor: color + '30', borderTopColor: color }} />
        </Animated.View>
    );
}

const s = (T: any) => StyleSheet.create({
    listContent: { paddingHorizontal: 20, paddingBottom: 110 },
    row: { gap: 12, marginBottom: 12 },
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
        justifyContent: 'center',
    },
    retryText: { color: T.bg, fontWeight: '800', fontSize: 13 },
    spinner: { width: 16, height: 16 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 56, paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1, borderBottomColor: T.border,
    },
    headerTitle: { fontSize: 30, fontWeight: '900', color: T.textPrimary, letterSpacing: -1 },
    headerSub: { fontSize: 12, color: T.textSecondary, marginTop: 2 },
    viewToggle: {
        flexDirection: 'row',
        backgroundColor: T.surface,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: T.border,
        padding: 3,
    },
    toggleBtn: {
        padding: 8,
        borderRadius: 8,
    },
    toggleBtnActive: {
        backgroundColor: T.accentDim,
    },
    searchWrap: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: T.surface, borderRadius: T.radiusMd,
        borderWidth: 1, borderColor: T.border,
        paddingHorizontal: 14, marginTop: 16, marginBottom: 20,
    },
    searchInput: { flex: 1, fontSize: 14, color: T.textPrimary, paddingVertical: 14 },
    scanButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: T.accentDim,
    },
    filterScroll: { gap: 8, paddingRight: 4 },
    chip: { borderRadius: T.radiusFull, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: T.border, backgroundColor: T.surface },
    chipActive: { backgroundColor: T.accent, borderColor: T.accent },
    chipText: { fontSize: 13, color: T.textSecondary, fontWeight: '500' },
    chipTextActive: { color: T.bg, fontWeight: '700' },
    emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 10 },
});
