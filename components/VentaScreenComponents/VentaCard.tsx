
import { useAppTheme } from "@/State/context/ThemeContext";
import { Venta } from "@/State/models/venta.models";
import { URLS } from "@/State/utils/endpoints";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import { Text } from "react-native-paper";
import { formatFecha, getAvatarColor, getEstado, getInitial, getTipoLabel } from "./utils";


function VentaCard({ venta, onPress }: { venta: Venta; onPress: () => void }) {
    const { T } = useAppTheme();

    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState<{ uri: string }[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const makeStyles = (T: any) => StyleSheet.create({
        list: { paddingBottom: 120 },
        card: {
            marginHorizontal: 20,
            marginBottom: 14,
            padding: 16,
            borderRadius: T.radiusLg,
            backgroundColor: T.surface,
            borderWidth: 1,
            borderColor: T.border,
            ...T.shadowCard,
        },
        topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
        avatar: {
            width: 52,
            height: 52,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        avatarText: { fontSize: 20, fontWeight: '900' },
        cliente: { fontSize: 18, fontWeight: '800', color: T.textPrimary },
        serie: { fontSize: 12, color: T.textSecondary, marginTop: 2 },
        badge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
        },
        dot: { width: 6, height: 6, borderRadius: 3 },
        badgeText: { fontSize: 11, fontWeight: '700' },
        divider: {
            height: 1,
            backgroundColor: T.border,
            marginVertical: 12,
        },
        bottomRow: { flexDirection: 'row' },
        meta: { flex: 1 },
        metaLabel: {
            fontSize: 10,
            color: T.textMuted,
            textTransform: 'uppercase',
        },
        metaValue: {
            fontSize: 13,
            color: T.textSecondary,
            marginTop: 3,
        },
        total: {
            fontSize: 20,
            fontWeight: '900',
            color: T.accent,
        },
        productsSection: {
            marginTop: 12,
        },
        productsLabel: {
            fontSize: 10,
            color: T.textMuted,
            textTransform: 'uppercase',
            marginBottom: 8,
            fontWeight: '700',
        },
        productsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        productCard: {
            backgroundColor: T.surfaceAlt,
            borderRadius: 14,
            overflow: 'hidden',
            width: '48%',
        },
        productImg: {
            width: '100%',
            height: 80,
        },
        productImgPlaceholder: {
            width: '100%',
            height: 80,
            backgroundColor: T.surface,
            alignItems: 'center',
            justifyContent: 'center',
        },
        productInfo: {
            padding: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        productName: {
            fontSize: 11,
            fontWeight: '600',
            color: T.textSecondary,
            flex: 1,
        },
        productQty: {
            fontSize: 10,
            fontWeight: '800',
            color: T.accent,
            marginLeft: 4,
        },
    });
    const styles = makeStyles(T);

    const estado = getEstado(venta.estado);
    const tipoLabel = getTipoLabel(venta.comprobante?.tipo_comprobante ?? venta.tipo_comprobante);
    const serie = venta.comprobante?.serie ?? '—';
    const correlativo = venta.comprobante?.correlativo ?? '—';
    const isAnonima = !venta.nombre_cliente || venta.nombre_cliente.toLowerCase() === 'anonimo' || venta.nombre_cliente.trim() === '';
    const avatarColor = isAnonima ? T.textMuted : getAvatarColor(venta.nombre_cliente ?? '');

    const productos = venta.productos ?? [];
    const count = productos.length;

    const hasImage = (img?: string) => img && img.trim() !== '';

    const openImageViewer = (index: number) => {
        const imagesWithUri = productos
            .filter(p => hasImage(p.producto_imagen))
            .map(p => ({ uri: URLS.BASE + p.producto_imagen }));
        setSelectedImages(imagesWithUri);
        setSelectedIndex(index);
        setImageViewerVisible(true);
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>

            {/* TOP */}
            <View style={styles.topRow}>
                <View style={[styles.avatar, { backgroundColor: isAnonima ? T.surfaceAlt : avatarColor + '25' }]}>
                    {isAnonima ? (
                        <Icon name="account-question" size={24} color={T.textMuted} />
                    ) : (
                        <Text style={[styles.avatarText, { color: avatarColor }]}>
                            {getInitial(venta.nombre_cliente)}
                        </Text>
                    )}
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.cliente} numberOfLines={1}>

                        {serie}-{correlativo || "-"}
                    </Text>

                    <Text style={[styles.serie, isAnonima && { fontStyle: 'italic' }]}>
                        {isAnonima ? 'Cliente anónimo' : venta.nombre_cliente}
                    </Text>
                </View>

                <View style={[styles.badge, { backgroundColor: estado.bg }]}>
                    <View style={[styles.dot, { backgroundColor: estado.color }]} />
                    <Text style={[styles.badgeText, { color: estado.color }]}>
                        {venta.estado}
                    </Text>
                </View>
            </View>

            {/* DIVIDER */}
            <View style={styles.divider} />

            {/* BOTTOM */}
            <View style={styles.bottomRow}>
                <View style={styles.meta}>
                    <Text style={styles.metaLabel}>MÉTODO</Text>
                    <Text style={styles.metaValue}>{venta.metodo_pago?.toUpperCase()}</Text>
                </View>

                <View style={styles.meta}>
                    <Text style={styles.metaLabel}>FECHA</Text>
                    <Text style={styles.metaValue}>{formatFecha(venta.fecha_hora)}</Text>
                </View>

                <View style={[styles.meta, { alignItems: 'flex-end' }]}>
                    <Text style={styles.metaLabel}>TOTAL</Text>
                    <Text style={styles.total}>S/ {venta.total}</Text>
                </View>
            </View>

            {/* PRODUCTS GRID */}
            {count > 0 && (
                <View style={styles.productsSection}>
                    <Text style={styles.productsLabel}>PRODUCTOS ({count})</Text>
                    <View style={styles.productsGrid}>
                        {productos.map((p, i) => {
                            const imgIndex = productos.slice(0, i + 1).filter(pp => hasImage(pp.producto_imagen)).length - 1;
                            return (
                                <View key={i} style={styles.productCard}>
                                    {hasImage(p.producto_imagen) ? (
                                        <TouchableOpacity
                                            activeOpacity={0.85}
                                            onPress={() => openImageViewer(imgIndex)}
                                        >
                                            <Image
                                                source={{ uri: URLS.BASE + p.producto_imagen }}
                                                style={styles.productImg}
                                                contentFit="cover"
                                            />
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={styles.productImgPlaceholder}>
                                            <Icon name="package-variant-closed" size={22} color={T.textMuted} />
                                        </View>
                                    )}
                                    <View style={styles.productInfo}>
                                        <Text numberOfLines={1} style={styles.productName}>
                                            {p.producto_nombre}
                                        </Text>
                                        <Text style={styles.productQty}>x{p.cantidad}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            )}

            <ImageViewing
                images={selectedImages}
                imageIndex={selectedIndex}
                visible={imageViewerVisible}
                onRequestClose={() => setImageViewerVisible(false)}
            />
        </TouchableOpacity>
    );
}

export default VentaCard;
