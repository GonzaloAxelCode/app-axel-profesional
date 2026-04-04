import { useProductos } from '@/State/hooks/useProductos';
import { Producto } from '@/State/models/producto.models';
import { URLS } from '@/State/utils/endpoints';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
    FlatList,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const CATEGORIAS = ['Todos', 'Ropa', 'Calzado', 'Accesorios', 'Otros'];

const getImagenProducto = (producto: Producto) =>
    producto?.imagen ? URLS.BASE + producto.imagen : URLS.IMAGE_URL_PLACEHOLDER;

const getStockColor = (cantidad?: number) => {
    if (!cantidad) return '#ccc';
    if (cantidad <= 5) return '#ccc';
    return '#000';
};

const getStockLabel = (cantidad?: number) => {
    if (!cantidad) return 'Sin stock';
    if (cantidad <= 5) return `Bajo · ${cantidad}`;
    return `Stock ${cantidad}`;
};

export const ProductosScreen = () => {
    const { data, isLoading, error } = useProductos(1, 20);
    const [categoriaActiva, setCategoriaActiva] = useState('Todos');

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

    const productos = data?.results ?? [];
    const featured = productos[0];
    const rest = productos.slice(1);

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Productos</Text>
                    <Text style={styles.count}>{data?.count ?? 0} artículos</Text>
                </View>
            </View>

            <View style={styles.searchBar}>
                <Text style={styles.searchPlaceholder}>🔍  Buscar por nombre, SKU...</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsContainer}
                style={styles.tabsScroll}
            >
                {CATEGORIAS.map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.tab, categoriaActiva === cat && styles.tabActive]}
                        onPress={() => setCategoriaActiva(cat)}
                    >
                        <Text style={[styles.tabText, categoriaActiva === cat && styles.tabTextActive]}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <FlatList
                data={rest}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={featured ? <FeaturedCard item={featured} /> : null}
                renderItem={({ item }) => <ProductCard item={item} />}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
        </View>
    );
};

function FeaturedCard({ item }: { item: Producto }) {
    return (
        <View style={[styles.cardWide, { marginBottom: 10 }]}>
            <Image
                source={{ uri: getImagenProducto(item) }}
                style={styles.wideImage}
                contentFit="cover"
                placeholder={URLS.IMAGE_URL_PLACEHOLDER}
            />
            <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>DESTACADO</Text>
            </View>

            <View style={styles.wideBody}>
                <View style={styles.wideTopRow}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        {item.categoria_nombre && (
                            <View style={styles.catPill}>
                                <Text style={styles.catPillText}>{item.categoria_nombre.toUpperCase()}</Text>
                            </View>
                        )}
                        <Text style={styles.wideName} numberOfLines={2}>{item.nombre}</Text>
                    </View>
                    {item.inventario?.cantidad !== undefined && (
                        <View style={styles.stockBadge}>
                            <Text style={styles.stockBadgeText}>{item.inventario.cantidad} uds</Text>
                        </View>
                    )}
                </View>

                <View style={styles.metaRow}>
                    {item.sku ? <MetaItem label="SKU" value={item.sku} /> : null}
                    {item.marca ? <MetaItem label="MARCA" value={item.marca} /> : null}
                    {item.modelo ? <MetaItem label="MODELO" value={item.modelo} /> : null}
                </View>

                <View style={styles.wideDivider} />

                <View style={styles.wideFooter}>
                    <Text style={styles.widePrice}>
                        S/.{item.inventario?.costo_venta ?? '—'}
                    </Text>
                    <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
                        <Text style={styles.addBtnText}>+ Agregar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

function ProductCard({ item }: { item: Producto }) {
    const cantidad = item.inventario?.cantidad;
    return (
        <View style={styles.card}>
            <Image
                source={{ uri: getImagenProducto(item) }}
                style={styles.cardImage}
                contentFit="cover"
                placeholder={URLS.IMAGE_URL_PLACEHOLDER}
            />
            <View style={styles.cardBody}>
                <View>
                    {item.categoria_nombre && (
                        <View style={styles.catPill}>
                            <Text style={styles.catPillText}>{item.categoria_nombre.toUpperCase()}</Text>
                        </View>
                    )}
                    <Text style={styles.cardName} numberOfLines={2}>{item.nombre}</Text>
                    <Text style={styles.cardSku}>
                        {[item.sku && `SKU: ${item.sku}`, item.marca].filter(Boolean).join(' · ')}
                    </Text>
                </View>
                <View style={styles.cardBottom}>
                    <Text style={styles.cardPrice}>
                        S/.{item.inventario?.costo_venta ?? '—'}
                    </Text>
                    <View style={styles.stockRow}>
                        <View style={[styles.stockDot, { backgroundColor: getStockColor(cantidad) }]} />
                        <Text style={styles.stockText}>{getStockLabel(cantidad)}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

function MetaItem({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>{label}</Text>
            <Text style={styles.metaValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    stateText: { fontSize: 16, fontWeight: '700', color: '#000' },
    stateSub: { fontSize: 13, color: '#bbb', marginTop: 4 },

    header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 16 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    title: { fontSize: 34, fontWeight: '800', color: '#000', letterSpacing: -1, lineHeight: 36 },
    count: { fontSize: 13, color: '#bbb', marginBottom: 4 },

    searchBar: {
        marginHorizontal: 20,
        marginBottom: 14,
        backgroundColor: '#f7f7f7',
        borderRadius: 14,
        padding: 13,
        paddingHorizontal: 16,
    },
    searchPlaceholder: { fontSize: 14, color: '#bbb' },

    tabsScroll: { height: 50 },
    tabsContainer: { paddingHorizontal: 20, paddingBottom: 12, height: 50, gap: 8, alignItems: 'center' },
    tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f7f7f7' },
    tabActive: { backgroundColor: '#000' },
    tabText: { fontSize: 12, fontWeight: '700', color: '#999' },
    tabTextActive: { color: '#fff' },

    list: { paddingHorizontal: 20, paddingBottom: 32 },

    cardWide: { backgroundColor: '#f7f7f7', borderRadius: 20, overflow: 'hidden' },
    wideImage: { width: '100%', height: 170 },
    featuredBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#000',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    featuredBadgeText: { fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
    wideBody: { padding: 16 },
    wideTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    wideName: { fontSize: 17, fontWeight: '800', color: '#000', letterSpacing: -0.3, marginTop: 4 },
    stockBadge: {
        backgroundColor: '#000',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
    },
    stockBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
    metaRow: { flexDirection: 'row', gap: 18, marginTop: 10 },
    metaItem: {},
    metaLabel: { fontSize: 10, fontWeight: '700', color: '#bbb', letterSpacing: 0.06 },
    metaValue: { fontSize: 13, fontWeight: '700', color: '#000', marginTop: 1 },
    wideDivider: { height: 1, backgroundColor: '#ebebeb', marginVertical: 12 },
    wideFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    widePrice: { fontSize: 22, fontWeight: '800', color: '#000', letterSpacing: -0.5 },
    addBtn: { backgroundColor: '#000', borderRadius: 22, paddingHorizontal: 18, paddingVertical: 9 },
    addBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

    card: {
        backgroundColor: '#f7f7f7',
        borderRadius: 20,
        overflow: 'hidden',
        flexDirection: 'row',
        height: 110,
    },
    cardImage: { width: 110, height: 110 },
    cardBody: { flex: 1, padding: 14, paddingVertical: 12, justifyContent: 'space-between' },
    catPill: {
        alignSelf: 'flex-start',
        backgroundColor: '#000',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginBottom: 5,
    },
    catPillText: { fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 0.05 },
    cardName: { fontSize: 14, fontWeight: '800', color: '#000', lineHeight: 18 },
    cardSku: { fontSize: 11, color: '#ccc', marginTop: 2 },
    cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardPrice: { fontSize: 17, fontWeight: '800', color: '#000', letterSpacing: -0.4 },
    stockRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    stockDot: { width: 6, height: 6, borderRadius: 3 },
    stockText: { fontSize: 11, color: '#999', fontWeight: '600' },
});