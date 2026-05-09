// ProductCard.tsx
import T from '@/constants/THEME';
import { Producto } from '@/State/models/producto.models';
import { URLS } from '@/State/utils/endpoints';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { Text } from 'react-native-paper';

// ─── Types & constants ────────────────────────────────────────────────────────
type StockStatus = 'in_stock' | 'low_stock' | 'no_stock';

const STOCK_CFG: Record<StockStatus, { label: string; color: string }> = {
    in_stock: { label: 'En stock', color: T.green },
    low_stock: { label: 'Stock bajo', color: T.amber },
    no_stock: { label: 'Agotado', color: T.red },
};

const CARD_WIDTH = (Dimensions.get('window').width - 20 * 2 - 12) / 2; // 2 cols, padding 20, gap 12

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getImagenProducto = (p: Producto) =>
    p?.imagen ? URLS.BASE + p.imagen : URLS.IMAGE_URL_PLACEHOLDER;

function getStockStatus(cantidad?: number): StockStatus {
    if (!cantidad || cantidad === 0) return 'no_stock';
    if (cantidad <= 8) return 'low_stock';
    return 'in_stock';
}

// ─── StockBadge ───────────────────────────────────────────────────────────────
function StockBadge({ status }: { status: StockStatus }) {
    const { label, color } = STOCK_CFG[status];
    return (
        <View style={[s.badge, { borderColor: color + '35', backgroundColor: color + '18' }]}>
            <View style={[s.badgeDot, { backgroundColor: color }]} />
            <Text style={[s.badgeLabel, { color }]}>{label}</Text>
        </View>
    );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
export default function ProductCard({ item }: { item: Producto }) {
    const [imageVisible, setImageVisible] = useState(false);
    const router = useRouter();

    const status = getStockStatus(item.inventario?.cantidad);
    const venta = Number(item.inventario?.costo_venta ?? 0);
    const compra = Number(item.inventario?.costo_compra ?? 0);
    const margen = venta > 0 ? Math.round(((venta - compra) / venta) * 100) : 0;

    return (
        <View style={s.card}>

            {/* ── Imagen ── */}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setImageVisible(true)}
                style={s.imageWrap}
            >
                <Image
                    source={{ uri: getImagenProducto(item) }}
                    style={s.image}
                    contentFit="cover"
                />
                {/* Margen badge top-right */}
                {margen > 0 && (
                    <View style={s.margenBadge}>
                        <Text style={s.margenText}>{margen}%</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* ── Info ── */}
            <TouchableOpacity
                activeOpacity={0.85}
                style={s.body}
                onPress={() => router.push({ pathname: '/productodetail', params: { id: item.id } })}
            >
                {/* Stock badge */}
                <StockBadge status={status} />

                {/* Categoría */}
                {item.categoria_nombre && (
                    <Text style={s.category} numberOfLines={1}>
                        {item.categoria_nombre.toUpperCase()}
                    </Text>
                )}

                {/* Nombre */}
                <Text style={s.name} numberOfLines={2}>{item.nombre}</Text>

                {/* SKU */}
                {item.sku && <Text style={s.sku}>SKU {item.sku}</Text>}

                <View style={s.divider} />

                {/* Precio + Stock */}
                <View style={s.priceRow}>
                    <Text style={s.price}>S/ {venta.toFixed(2)}</Text>
                    <View style={s.stockPill}>
                        <Icon name="package-variant" size={10} color={T.textMuted} />
                        <Text style={s.stockText}>{item.inventario?.cantidad ?? 0}</Text>
                    </View>
                </View>

                {/* Compra */}
                <Text style={s.compra}>Compra S/ {compra.toFixed(2)}</Text>
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: T.surface,
        borderRadius: T.radiusLg,
        borderWidth: 1,
        borderColor: T.border,
        overflow: 'hidden',
    },

    // Imagen
    imageWrap: { width: '100%', aspectRatio: 1 },
    image: { width: '100%', height: '100%' },

    margenBadge: {
        position: 'absolute', top: 8, right: 8,
        backgroundColor: T.accent,
        borderRadius: T.radiusFull,
        paddingHorizontal: 7, paddingVertical: 3,
    },
    margenText: { fontSize: 10, fontWeight: '800', color: T.bg },

    // Body
    body: { padding: 10, gap: 4 },

    category: {
        fontSize: 9, fontWeight: '700',
        color: T.accent, letterSpacing: 1.4,
        marginTop: 2,
    },
    name: {
        fontSize: 13, fontWeight: '700',
        color: T.textPrimary, lineHeight: 18,
    },
    sku: { fontSize: 9, color: T.textMuted },

    divider: { height: 1, backgroundColor: T.border, marginVertical: 6 },

    priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    price: { fontSize: 15, fontWeight: '900', color: T.textPrimary },

    stockPill: {
        flexDirection: 'row', alignItems: 'center', gap: 3,
        backgroundColor: T.accentDim,
        borderRadius: T.radiusFull,
        paddingHorizontal: 7, paddingVertical: 3,
    },
    stockText: { fontSize: 10, fontWeight: '700', color: T.textMuted },

    compra: { fontSize: 10, color: T.textMuted },

    // Badge
    badge: {
        alignSelf: 'flex-start',
        flexDirection: 'row', alignItems: 'center', gap: 4,
        borderRadius: T.radiusFull, borderWidth: 1,
        paddingHorizontal: 7, paddingVertical: 3,
    },
    badgeDot: { width: 5, height: 5, borderRadius: 99 },
    badgeLabel: { fontSize: 9, fontWeight: '700' },
});