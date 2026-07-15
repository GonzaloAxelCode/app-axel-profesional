/* ──────────────────────────────────────────────────────────────
   REDISEÑO MODERNO · SINGLE SCREEN
   - Todo en una sola pantalla fluida
   - Header glass / hero moderno
   - Cards compactas
   - Acciones rápidas arriba
   - Productos estilo app premium
────────────────────────────────────────────────────────────── */

import { useAppTheme } from "@/State/context/ThemeContext";
import { Venta } from "@/State/models/venta.models";
import { useVentaStore } from '@/State/store/useVentaStore';
import { URLS } from "@/State/utils/endpoints";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from "expo-image";
import { useState } from 'react';
import { useVentas } from '@/State/hooks/useVentas';

import {
    Linking,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import { ActivityIndicator, Text } from "react-native-paper";

const formatFecha = (fecha: string) => {
    if (!fecha) return '—';

    return new Date(fecha).toLocaleDateString('es-PE', {
        month: 'short',
        day: 'numeric',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function VentaDetalleModal({
    venta,
    visible,
    onClose,
}: {
    venta: Venta | null;
    visible: boolean;
    onClose: () => void;
}) {
    const { T } = useAppTheme();

    const estadoMap: any = {
        aceptado: {
            bg: T.green + '15',
            color: T.green,
            icon: 'check-decagram',
        },
        pendiente: {
            bg: T.amber + '15',
            color: T.amber,
            icon: 'clock-outline',
        },
        anulado: {
            bg: T.red + '15',
            color: T.red,
            icon: 'cancel',
        },
    };

    const makeStyles = (T: any) => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: T.bg,
        },
        scroll: {
            padding: 18,
            paddingBottom: 13,
            gap: 18,
        },
        hero: {
            backgroundColor: T.surface,
            borderRadius: 30,
            padding: 22,
            borderWidth: 1,
            borderColor: T.border,
            overflow: 'hidden',
        },
        heroTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        iconBtn: {
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor: T.surfaceAlt,
            justifyContent: 'center',
            alignItems: 'center',
        },
        estado: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 100,
        },
        estadoText: {
            fontSize: 12,
            fontWeight: '800',
            textTransform: 'capitalize',
        },
        serie: {
            fontSize: 19,
            fontWeight: '700',
            color: T.textSecondary,
            marginTop: 28,
        },
        total: {
            fontSize: 52,
            fontWeight: '900',
            color: T.accent,
            letterSpacing: -3,
            marginTop: 4,
        },
        metaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 18,
            backgroundColor: T.surfaceAlt,
            borderRadius: 18,
            padding: 14,
        },
        metaItem: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            justifyContent: 'center',
        },
        metaDivider: {
            width: 1,
            height: 20,
            backgroundColor: T.border,
        },
        metaText: {
            fontSize: 12,
            color: T.textSecondary,
            fontWeight: '600',
        },
        section: {
            gap: 12,
        },
        sectionTitle: {
            fontSize: 12,
            fontWeight: '800',
            color: T.textMuted,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
        },
        actionsRow: {
            flexDirection: 'row',
            gap: 10,
        },
        actionCard: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: T.surface,
            borderRadius: 22,
            paddingVertical: 16,
            borderWidth: 1,
            borderColor: T.border,
            gap: 8,
        },
        actionIcon: {
            width: 46,
            height: 46,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
        },
        actionLabel: {
            fontSize: 11,
            fontWeight: '700',
            color: T.textSecondary,
        },
        card: {
            backgroundColor: T.surface,
            borderRadius: 24,
            paddingTop: 13,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            borderWidth: 0,
            borderColor: T.border,
        },
        avatar: {
            width: 54,
            height: 54,
            borderRadius: 18,
            backgroundColor: T.accent + '15',
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatarText: {
            fontSize: 20,
            fontWeight: '900',
            color: T.accent,
        },
        clientName: {
            fontSize: 15,
            fontWeight: '800',
            color: T.textPrimary,
        },
        clientDoc: {
            marginTop: 3,
            fontSize: 12,
            color: T.textMuted,
        },
        whatsappRow: {
            flexDirection: 'row',
            gap: 10,
        },
        inputWrap: {
            flex: 1,
            backgroundColor: T.surface,
            borderRadius: 20,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            borderWidth: 1,
            borderColor: T.border,
        },
        input: {
            flex: 1,
            color: T.textPrimary,
            paddingVertical: 14,
            fontSize: 14,
        },
        sendBtn: {
            width: 56,
            borderRadius: 18,
            backgroundColor: T.accent,
            justifyContent: 'center',
            alignItems: 'center',
        },
        productsHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        productsCount: {
            fontSize: 13,
            color: T.textMuted,
            fontWeight: '700',
        },
        productCard: {
            backgroundColor: T.surface,
            borderRadius: 24,
            padding: 12,
            flexDirection: 'row',
            gap: 12,
            borderWidth: 1,
            borderColor: T.border,
        },
        productImage: {
            width: 68,
            height: 68,
            borderRadius: 18,
        },
        productImageEmpty: {
            backgroundColor: T.surfaceAlt,
            justifyContent: 'center',
            alignItems: 'center',
        },
        productName: {
            fontSize: 14,
            fontWeight: '700',
            color: T.textPrimary,
            marginBottom: 10,
        },
        productBottom: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        qty: {
            backgroundColor: T.accent + '15',
            borderRadius: 100,
            paddingHorizontal: 10,
            paddingVertical: 4,
        },
        qtyText: {
            fontSize: 11,
            fontWeight: '800',
            color: T.accent,
        },
        productPrice: {
            fontSize: 15,
            fontWeight: '900',
            color: T.textPrimary,
        },
        footer: {
            marginTop: 8,
            backgroundColor: T.surface,
            borderRadius: 28,
            padding: 20,
            borderWidth: 1,
            borderColor: T.border,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        footerLabel: {
            fontSize: 12,
            color: T.textMuted,
            fontWeight: '700',
        },
        footerTotal: {
            marginTop: 2,
            fontSize: 32,
            fontWeight: '900',
            color: T.accent,
            letterSpacing: -2,
        },
        cancelGlassBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: T.red + '08',
            borderWidth: 1,
            borderColor: T.red + '18',
            borderRadius: 28,
            paddingVertical: 16,
            paddingHorizontal: 18,
        },
        cancelGlassLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            flex: 1,
        },
        cancelGlassBadge: {
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: T.red,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: T.red,
            shadowOpacity: 0.25,
            shadowRadius: 14,
            shadowOffset: {
                width: 0,
                height: 6,
            },
            elevation: 8,
        },
        cancelGlassTitle: {
            fontSize: 15,
            fontWeight: '900',
            color: T.red,
        },
        cancelGlassSub: {
            marginTop: 3,
            fontSize: 12,
            color: T.textMuted,
        },
        cancelGlassArrow: {
            width: 38,
            height: 38,
            borderRadius: 14,
            backgroundColor: T.surface,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: T.red + '15',
        },
        productsGridHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
        },
        productsGridCount: {
            fontSize: 12,
            fontWeight: '800',
            color: T.textMuted,
        },
        productsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
        },
        productGridCard: {
            width: '48%',
            backgroundColor: T.surface,
            borderRadius: 28,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: T.surfaceAlt,
        },
        productGridFull: {
            width: '100%',
        },
        productGridImage: {
            width: '100%',
            height: 140,
        },
        productGridImageEmpty: {
            width: '100%',
            height: 140,
            backgroundColor: T.surfaceAlt,
            justifyContent: 'center',
            alignItems: 'center',
        },
        productGridContent: {
            padding: 14,
        },
        productGridTop: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
        },
        productGridName: {
            fontSize: 15,
            fontWeight: '900',
            color: T.textPrimary,
        },
        productGridQty: {
            marginTop: 4,
            fontSize: 12,
            color: T.textMuted,
        },
        productGridBadge: {
            backgroundColor: T.accent + '15',
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 5,
        },
        productGridBadgeText: {
            fontSize: 11,
            fontWeight: '800',
            color: T.accent,
        },
        productGridBottom: {
            marginTop: 18,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        productGridMini: {
            fontSize: 11,
            color: T.textMuted,
        },
        productGridPrice: {
            marginTop: 2,
            fontSize: 18,
            fontWeight: '900',
            color: T.textPrimary,
        },
    });
    const s = makeStyles(T);

    const { temporaryVenta } = useVentaStore();
    const { anularVenta: anularVentaQuery } = useVentas();
    const [loadingAnulacion, setLoadingAnulacion] = useState(false);

    const [whatsappNum, setWhatsappNum] = useState('');

    if (!venta || !venta.comprobante) return null;

    const cp = venta.comprobante;

    const estado =
        estadoMap[venta.estado?.toLowerCase()] ??
        estadoMap.pendiente;

    const total = Number(venta.total).toFixed(2);

    const sendWhatsApp = () => {

        const num = whatsappNum.replace(/\D/g, '');

        if (!num) return;

        const msg = encodeURIComponent(
            `🧾 ${cp.serie}-${cp.correlativo}\n💰 Total: S/ ${total}\n📄 ${cp.ticket_url}`
        );

        Linking.openURL(`https://wa.me/51${num}?text=${msg}`);
    };

    const handleAnular = () => {
        setLoadingAnulacion(true);
        anularVentaQuery(
            {
                ventaId: temporaryVenta.id,
                motivo: "Anulación de la operación",
                tipo_motivo: "01",
                anonima: false,
            },
            {
                onSuccess: (res) => {
                    useVentaStore.setState({
                        temporaryVenta: {
                            ...temporaryVenta,
                            estado: res?.venta_estado ?? 'Anulado',
                            comprobante_nota_credito: res?.comprobante_nota_credito,
                        },
                    });
                    setLoadingAnulacion(false);
                },
                onError: () => {
                    setLoadingAnulacion(false);
                },
            }
        );
    };

    const docs = [
        {
            icon: 'file-pdf-box',
            color: T.red,
            label: 'PDF',
            url: cp.pdf_url,
        },
        {
            icon: 'xml',
            color: T.blue,
            label: 'XML',
            url: cp.xml_url,
        },
        {
            icon: 'shield-check',
            color: T.green,
            label: 'CDR',
            url: cp.cdr_url,
        },
        {
            icon: 'receipt-text',
            color: T.purple,
            label: 'Ticket',
            url: cp.ticket_url,
        },
    ];
    const getImg = (url: any) =>
        url ? URLS.BASE + url : URLS.IMAGE_URL_PLACEHOLDER;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >

            <StatusBar
                barStyle="light-content"
                backgroundColor={T.bg}
            />

            <SafeAreaView style={s.container}>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={s.scroll}
                >

                    {/* ───────────────── HEADER ───────────────── */}

                    <View style={s.hero}>

                        <View style={s.heroTop}>

                            <TouchableOpacity
                                style={s.iconBtn}
                                onPress={onClose}
                            >
                                <Icon
                                    name="arrow-left"
                                    size={20}
                                    color={T.textPrimary}
                                />
                            </TouchableOpacity>

                            <View
                                style={[
                                    s.estado,
                                    { backgroundColor: estado.bg }
                                ]}
                            >
                                <Icon
                                    name={estado.icon}
                                    size={13}
                                    color={estado.color}
                                />

                                <Text
                                    style={[
                                        s.estadoText,
                                        { color: estado.color }
                                    ]}
                                >
                                    {venta.estado}
                                </Text>
                            </View>

                        </View>

                        <Text style={s.serie}>
                            {cp.serie}-{cp.correlativo}
                        </Text>

                        <Text style={s.total}>
                            S/ {total}
                        </Text>

                        <View style={s.metaRow}>

                            <View style={s.metaItem}>
                                <Icon
                                    name="calendar-outline"
                                    size={14}
                                    color={T.textMuted}
                                />
                                <Text style={s.metaText}>
                                    {formatFecha(venta.fecha_hora)}
                                </Text>
                            </View>

                            <View style={s.metaDivider} />

                            <View style={s.metaItem}>
                                <Icon
                                    name="credit-card-outline"
                                    size={14}
                                    color={T.textMuted}
                                />
                                <Text style={s.metaText}>
                                    {venta.metodo_pago}
                                </Text>
                            </View>

                        </View>

                        <View style={s.card}>

                            <View style={s.avatar}>
                                <Text style={s.avatarText}>
                                    {cp?.nombre_cliente?.charAt(0) || 'A'}
                                </Text>
                            </View>

                            <View style={{ flex: 1 }}>

                                <Text style={s.clientName}>
                                    {cp?.nombre_cliente || 'Cliente'}
                                </Text>

                                <Text style={s.clientDoc}>
                                    {cp?.numero_documento_cliente || 'Sin documento'}
                                </Text>

                            </View>

                        </View>
                        {/* ───────────────── PRODUCTOS GRID ───────────────── */}

                        <View style={s.section}>

                            <View style={s.productsGridHeader}>



                            </View>

                            <View style={s.productsGrid}>

                                {venta.productos?.map((p, i) => {

                                    const isOddLast =
                                        venta.productos.length > 1 &&
                                        venta.productos.length % 2 !== 0 &&
                                        i === venta.productos.length - 1;
                                    const total =
                                        (
                                            (p.precio_unitario ?? p.valor_unitario) *
                                            p.cantidad
                                        ).toFixed(2);

                                    return (

                                        <TouchableOpacity
                                            key={i}
                                            activeOpacity={0.9}
                                            style={[
                                                s.productGridCard,
                                                isOddLast && s.productGridFull
                                            ]}
                                        >

                                            {p.producto_imagen ? (

                                                <Image
                                                    source={{ uri: getImg(p.producto_imagen) }}
                                                    style={s.productGridImage}
                                                    contentFit="cover"
                                                />

                                            ) : (

                                                <View style={s.productGridImageEmpty}>
                                                    <Icon
                                                        name="package-variant-closed"
                                                        size={22}
                                                        color={T.textMuted}
                                                    />
                                                </View>

                                            )}

                                            <View style={s.productGridContent}>

                                                <View style={s.productGridTop}>

                                                    <View style={{ flex: 1 }}>

                                                        <Text
                                                            numberOfLines={1}
                                                            style={s.productGridName}
                                                        >
                                                            {p.producto_nombre}
                                                        </Text>

                                                        <Text style={s.productGridQty}>
                                                            {p.cantidad} unidades
                                                        </Text>

                                                    </View>

                                                    <View style={s.productGridBadge}>
                                                        <Text style={s.productGridBadgeText}>
                                                            x{p.cantidad}
                                                        </Text>
                                                    </View>

                                                </View>

                                                <View style={s.productGridBottom}>

                                                    <View>

                                                        <Text style={s.productGridMini}>
                                                            Total
                                                        </Text>

                                                        <Text style={s.productGridPrice}>
                                                            S/ {total}
                                                        </Text>

                                                    </View>

                                                    <Icon
                                                        name="chevron-right"
                                                        size={18}
                                                        color={T.textMuted}
                                                    />

                                                </View>

                                            </View>

                                        </TouchableOpacity>

                                    );

                                })}

                            </View>

                        </View>

                    </View>

                    {/* ───────────────── ACTIONS ───────────────── */}

                    <View style={{ ...s.section, }}>

                        <Text style={s.sectionTitle}>
                            Acciones rápidas
                        </Text>

                        <View style={s.actionsRow}>

                            {docs.map((d) => (

                                <TouchableOpacity
                                    key={d.label}
                                    style={[
                                        s.actionCard,
                                        !d.url && { opacity: 0.35 }
                                    ]}
                                    onPress={() =>
                                        d.url && Linking.openURL(d.url)
                                    }
                                >

                                    <View
                                        style={[
                                            s.actionIcon,
                                            { backgroundColor: d.color + '15' }
                                        ]}
                                    >
                                        <Icon
                                            name={d.icon as any}
                                            size={20}
                                            color={d.color}
                                        />
                                    </View>

                                    <Text style={s.actionLabel}>
                                        {d.label}
                                    </Text>

                                </TouchableOpacity>

                            ))}

                        </View>

                    </View>


                    {venta.estado?.toLowerCase() !== 'anulada' && (

                        <TouchableOpacity
                            style={s.cancelGlassBtn}
                            onPress={handleAnular}
                            activeOpacity={0.92}
                        >

                            <View style={s.cancelGlassLeft}>

                                <View style={s.cancelGlassBadge}>
                                    {loadingAnulacion ? (
                                        <ActivityIndicator
                                            size="small"
                                            color="#fff"
                                        />
                                    ) : (
                                        <Icon
                                            name="close-thick"
                                            size={15}
                                            color="#fff"
                                        />
                                    )}
                                </View>

                                <View>

                                    <Text style={s.cancelGlassTitle}>
                                        Cancelar comprobante
                                    </Text>

                                    <Text style={s.cancelGlassSub}>
                                        Acción irreversible ante SUNAT
                                    </Text>

                                </View>

                            </View>

                            <View style={s.cancelGlassArrow}>
                                <Icon
                                    name="arrow-top-right"
                                    size={16}
                                    color={T.red}
                                />
                            </View>

                        </TouchableOpacity>

                    )}
                </ScrollView>

            </SafeAreaView>

        </Modal>
    );
}
