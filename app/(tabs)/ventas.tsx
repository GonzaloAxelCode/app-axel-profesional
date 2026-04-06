import { useVentas } from "@/State/hooks/useVentas";
import { Venta } from "@/State/models/venta.models";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Text } from "react-native-paper";

// ─── helpers ─────────────────────────────────────────────────────────────────

const formatFecha = (fecha: string) => {
    if (!fecha) return '—';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-PE', {
        month: 'short', day: 'numeric', year: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });
};



const ESTADO_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
    aceptado: { bg: '#dcfce7', text: '#15803d', dot: '#22c55e' },
    pendiente: { bg: '#fef3c7', text: '#b45309', dot: '#f59e0b' },
    anulado: { bg: '#fee2e2', text: '#b91c1c', dot: '#ef4444' },
    cancelado: { bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af' },
};
const getEstadoStyle = (e: string) =>
    ESTADO_STYLES[e?.toLowerCase()] ?? ESTADO_STYLES.cancelado;

const COMPROBANTE_LABEL: Record<string, string> = {
    '01': 'FACTURA', '03': 'BOLETA', boleta: 'BOLETA', factura: 'FACTURA',
};
const getTipoLabel = (tipo: string) =>
    COMPROBANTE_LABEL[tipo?.toLowerCase()] ?? tipo?.toUpperCase() ?? '—';

const getInitial = (n: string) => n?.trim()?.charAt(0)?.toUpperCase() ?? '?';

const AVATAR_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
const getAvatarColor = (n: string) =>
    AVATAR_COLORS[(n?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

// ─── VentaCard ────────────────────────────────────────────────────────────────

function VentaCard({ venta, onPress }: { venta: Venta; onPress: () => void }) {
    const estadoStyle = getEstadoStyle(venta.estado);
    const tipoLabel = getTipoLabel(venta.comprobante?.tipo_comprobante ?? venta.tipo_comprobante);
    const serie = venta.comprobante?.serie ?? '—';
    const correlativo = venta.comprobante?.correlativo ?? '—';
    const avatarColor = getAvatarColor(venta.nombre_cliente ?? '');

    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.ventaCard} onPress={onPress}>
            <View style={styles.cardTop}>
                <View style={[styles.cardAvatar, { backgroundColor: avatarColor + '22' }]}>
                    <Text style={[styles.cardAvatarText, { color: avatarColor }]}>
                        {getInitial(venta.nombre_cliente)}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardCliente} numberOfLines={1}>
                        {venta.nombre_cliente || 'Anónimo'}
                    </Text>
                    <Text style={styles.cardSerie}>{serie} - {correlativo} · {tipoLabel}</Text>
                </View>
                <View style={[styles.estadoBadge, { backgroundColor: estadoStyle.bg }]}>
                    <View style={[styles.estadoDot, { backgroundColor: estadoStyle.dot }]} />
                    <Text style={[styles.estadoText, { color: estadoStyle.text }]}>
                        {venta.estado?.charAt(0).toUpperCase() + venta.estado?.slice(1)}
                    </Text>
                </View>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.cardBottom}>
                <View style={styles.cardStat}>
                    <Text style={styles.cardStatLabel}>MÉTODO</Text>
                    <Text style={styles.cardStatValue}>{venta.metodo_pago?.toUpperCase() ?? '—'}</Text>
                </View>
                <View style={styles.cardStat}>
                    <Text style={styles.cardStatLabel}>FECHA</Text>
                    <Text style={styles.cardStatValue}>{formatFecha(venta.fecha_hora)}</Text>
                </View>
                <View style={[styles.cardStat, { alignItems: 'flex-end' }]}>
                    <Text style={styles.cardStatLabel}>TOTAL</Text>
                    <Text style={styles.cardTotal}>S/ {venta.total}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function VentaDetalleModal({
    venta, visible, onClose,
}: { venta: Venta | null; visible: boolean; onClose: () => void }) {
    const [whatsappNum, setWhatsappNum] = useState('');
    if (!venta) return null;

    const cp = venta.comprobante;
    const estadoStyle = getEstadoStyle(venta.estado);
    const tipoLabel = getTipoLabel(cp?.tipo_comprobante ?? venta.tipo_comprobante);
    const serie = cp?.serie ?? '—';
    const correlativo = cp?.correlativo ?? '—';
    const avatarColor = getAvatarColor(venta.nombre_cliente ?? '');

    const handleWhatsApp = () => {
        const num = whatsappNum.replace(/\D/g, '');
        if (!num) return;
        Linking.openURL(`https://wa.me/51${num}`);
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={mStyles.overlay}>
                <View style={mStyles.sheet}>

                    {/* Handle */}
                    <View style={mStyles.handle} />

                    {/* Header strip */}
                    <View style={mStyles.headerStrip}>
                        <View style={{ flex: 1 }}>
                            <Text style={mStyles.comprobanteNum}>{serie} - {correlativo}</Text>
                            <Text style={mStyles.tipoChip}>{tipoLabel}</Text>
                        </View>
                        <TouchableOpacity style={mStyles.closeBtn} onPress={onClose}>
                            <Icon name="close" size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                        {/* ── Acciones ── */}
                        <View style={mStyles.section}>
                            <Text style={mStyles.sectionLabel}>Documentos</Text>
                            <View style={mStyles.docBtnsRow}>
                                {[
                                    { label: 'PDF', icon: 'file-pdf-box', color: '#ef4444', url: cp?.pdf_url },
                                    { label: 'XML', icon: 'code-tags', color: '#3b82f6', url: cp?.xml_url },
                                    { label: 'CDR', icon: 'file-check', color: '#10b981', url: cp?.cdr_url },
                                    { label: 'Ticket', icon: 'receipt', color: '#8b5cf6', url: cp?.ticket_url },
                                ].map(({ label, icon, color, url }) => (
                                    <TouchableOpacity
                                        key={label}
                                        style={[mStyles.docBtn, !url && mStyles.docBtnDisabled]}
                                        onPress={() => url && Linking.openURL(url)}
                                        activeOpacity={url ? 0.8 : 1}
                                    >
                                        <View style={[mStyles.docBtnIcon, { backgroundColor: color + '18' }]}>
                                            <Icon name={icon as any} size={22} color={url ? color : '#d1d5db'} />
                                        </View>
                                        <Text style={[mStyles.docBtnLabel, !url && { color: '#d1d5db' }]}>{label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={mStyles.divider} />

                        {/* ── Cliente ── */}
                        <View style={mStyles.section}>
                            <Text style={mStyles.sectionLabel}>Cliente</Text>
                            <View style={mStyles.clienteCard}>
                                <View style={[mStyles.avatar, { backgroundColor: avatarColor }]}>
                                    <Text style={mStyles.avatarText}>{getInitial(venta.nombre_cliente)}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={mStyles.clienteNombre}>{venta.nombre_cliente || 'Anónimo'}</Text>
                                    <Text style={mStyles.clienteDoc}>
                                        {venta.tipo_documento_cliente?.toUpperCase() || 'DOC'}: {venta.numero_documento_cliente || '—'}
                                    </Text>
                                </View>
                                <View style={[mStyles.estadoBadge, { backgroundColor: estadoStyle.bg }]}>
                                    <View style={[mStyles.estadoDot, { backgroundColor: estadoStyle.dot }]} />
                                    <Text style={[mStyles.estadoText, { color: estadoStyle.text }]}>
                                        {venta.estado?.charAt(0).toUpperCase() + venta.estado?.slice(1)}
                                    </Text>
                                </View>
                            </View>

                            <View style={mStyles.infoGrid}>
                                {[
                                    { label: 'Email', value: venta.email_cliente || venta.correo_cliente || 'Sin correo' },
                                    { label: 'Teléfono', value: venta.telefono_cliente || 'Sin teléfono' },
                                    { label: 'Dirección', value: venta.direccion_cliente || 'Sin dirección' },
                                ].map(({ label, value }) => (
                                    <View key={label} style={mStyles.infoRow}>
                                        <Text style={mStyles.infoLabel}>{label}</Text>
                                        <Text style={mStyles.infoValue} numberOfLines={1}>{value}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={mStyles.divider} />

                        {/* ── Enviar por WhatsApp ── */}
                        <View style={mStyles.section}>
                            <Text style={mStyles.sectionLabel}>Enviar comprobante</Text>
                            <View style={mStyles.whatsappRow}>
                                <View style={mStyles.whatsappInput}>
                                    <Icon name="phone-outline" size={18} color="#9ca3af" />
                                    <TextInput
                                        placeholder="Número WhatsApp"
                                        placeholderTextColor="#9ca3af"
                                        value={whatsappNum}
                                        onChangeText={setWhatsappNum}
                                        keyboardType="numeric"
                                        style={mStyles.whatsappTextInput}
                                    />
                                </View>
                                <TouchableOpacity style={mStyles.whatsappBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
                                    <Icon name="whatsapp" size={22} color="#fff" />

                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={mStyles.divider} />

                        {/* ── Resumen financiero ── */}
                        <View style={mStyles.section}>
                            <Text style={mStyles.sectionLabel}>Resumen</Text>
                            <View style={mStyles.statsCard}>
                                {[
                                    { label: 'Método de pago', value: venta.metodo_pago?.toUpperCase() ?? '—' },
                                    { label: 'Fecha', value: formatFecha(venta.fecha_hora) },
                                    { label: 'Serie', value: serie },
                                    { label: 'Correlativo', value: correlativo },
                                    { label: 'Moneda', value: cp?.moneda ?? 'PEN' },
                                    { label: 'Subtotal', value: `S/ ${venta.subtotal ?? cp?.sub_total ?? '—'}` },
                                    { label: 'IGV', value: `S/ ${venta.igv_total ?? cp?.igv ?? '—'}` },
                                ].map(({ label, value }, i, arr) => (
                                    <View key={label} style={[mStyles.statRow, i < arr.length - 1 && mStyles.statRowBorder]}>
                                        <Text style={mStyles.statLabel}>{label}</Text>
                                        <Text style={mStyles.statValue}>{value}</Text>
                                    </View>
                                ))}
                                <View style={mStyles.totalRow}>
                                    <Text style={mStyles.totalLabel}>TOTAL</Text>
                                    <Text style={mStyles.totalValue}>S/ {venta.total}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={mStyles.divider} />

                        {/* ── Productos ── */}
                        <View style={mStyles.section}>
                            <Text style={mStyles.sectionLabel}>
                                Productos · {venta.productos?.length ?? 0}
                            </Text>
                            {venta.productos?.map((p, i) => (
                                <View key={i} style={mStyles.productoCard}>
                                    {p.producto_imagen ? (
                                        <Image
                                            source={{ uri: p.producto_imagen }}
                                            style={mStyles.productoImg}
                                            contentFit="cover"
                                        />
                                    ) : (
                                        <View style={[mStyles.productoImg, mStyles.productoImgPlaceholder]}>
                                            <Icon name="package-variant-closed" size={24} color="#d1d5db" />
                                        </View>
                                    )}
                                    <View style={{ flex: 1, paddingLeft: 12 }}>
                                        <Text style={mStyles.productoNombre} numberOfLines={2}>{p.producto_nombre}</Text>
                                        <View style={mStyles.productoFooter}>
                                            <View style={mStyles.cantidadBadge}>
                                                <Text style={mStyles.cantidadText}>×{p.cantidad}</Text>
                                            </View>
                                            <Text style={mStyles.productoTotal}>
                                                S/ {((p.precio_unitario ?? p.valor_unitario) * p.cantidad).toFixed(2)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>


                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
// ─── modal styles ─────────────────────────────────────────────────────────────

const mStyles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end' },
    sheet: {
        backgroundColor: '#fff',

        maxHeight: '100%', paddingHorizontal: 20, paddingBottom: 8, paddingTop: 12,
    },
    handle: {
        width: 40, height: 4, borderRadius: 2,
        backgroundColor: 'transparent', alignSelf: 'center', marginBottom: 16,
    },
    headerStrip: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
    comprobanteNum: { fontSize: 26, fontWeight: '800', color: '#111', letterSpacing: -0.5 },
    tipoChip: {
        alignSelf: 'flex-start', marginTop: 4, fontSize: 12, fontWeight: '600',
        color: '#6b7280', backgroundColor: '#f3f4f6',
        borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, overflow: 'hidden',
    },
    closeBtn: { padding: 8, backgroundColor: '#f3f4f6', borderRadius: 20, marginLeft: 8 },

    section: { marginBottom: 4 },
    sectionLabel: {
        fontSize: 11, color: '#9ca3af', textTransform: 'uppercase',
        letterSpacing: 0.8, marginBottom: 12, fontWeight: '600',
    },
    divider: { height: 0.5, backgroundColor: '#f3f4f6', marginVertical: 18 },

    // doc buttons
    docBtnsRow: { flexDirection: 'row', gap: 10 },
    docBtn: {
        flex: 1, alignItems: 'center', gap: 6,
        backgroundColor: '#f9fafb', borderRadius: 14, paddingVertical: 14,
        borderWidth: 0.5, borderColor: '#e5e7eb',
    },
    docBtnDisabled: { opacity: 0.4 },
    docBtnIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    docBtnLabel: { fontSize: 12, fontWeight: '600', color: '#374151' },

    // cliente
    clienteCard: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: '#f9fafb', borderRadius: 14, padding: 14,
        marginBottom: 12, borderWidth: 0.5, borderColor: '#e5e7eb',
    },
    avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontWeight: '700', fontSize: 18 },
    clienteNombre: { fontSize: 15, fontWeight: '700', color: '#111' },
    clienteDoc: { fontSize: 12, color: '#9ca3af', marginTop: 2 },

    estadoBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start',
    },
    estadoDot: { width: 6, height: 6, borderRadius: 3 },
    estadoText: { fontSize: 12, fontWeight: '600' },

    infoGrid: { gap: 8 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    infoLabel: { fontSize: 13, color: '#9ca3af', fontWeight: '500' },
    infoValue: { fontSize: 13, color: '#374151', fontWeight: '500', flex: 1, textAlign: 'right' },

    // whatsapp
    whatsappRow: { flexDirection: 'row', gap: 10 },
    whatsappInput: {
        flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: '#f9fafb', borderRadius: 14,
        paddingHorizontal: 14, borderWidth: 0.5, borderColor: '#e5e7eb',
    },
    whatsappTextInput: { flex: 1, color: '#111', fontSize: 15, paddingVertical: 14 },
    whatsappBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#16a34a', borderRadius: 14,
        paddingHorizontal: 18, paddingVertical: 14,
    },
    whatsappBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

    // stats card
    statsCard: { backgroundColor: '#f9fafb', borderRadius: 14, borderWidth: 0.5, borderColor: '#e5e7eb', overflow: 'hidden' },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13 },
    statRowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb' },
    statLabel: { fontSize: 14, color: '#6b7280' },
    statValue: { fontSize: 14, fontWeight: '600', color: '#111' },
    totalRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#111',
    },
    totalLabel: { fontSize: 13, fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 },
    totalValue: { fontSize: 22, fontWeight: '800', color: '#fff' },

    // productos
    productoCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#f9fafb', borderRadius: 14,
        padding: 12, marginBottom: 10,
        borderWidth: 0.5, borderColor: '#e5e7eb',
    },
    productoImg: { width: 64, height: 64, borderRadius: 10 },
    productoImgPlaceholder: { backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
    productoNombre: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 8 },
    productoFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cantidadBadge: { backgroundColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    cantidadText: { fontSize: 13, fontWeight: '600', color: '#374151' },
    productoTotal: { fontSize: 16, fontWeight: '700', color: '#111' },

    cancelBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        borderWidth: 1, borderColor: '#fee2e2', borderRadius: 14,
        paddingVertical: 14, backgroundColor: '#fff9f9',
    },
    cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#ef4444' },
});







// Helpers fuera del componente
const getFechaKey = (fechaHora: string) => fechaHora.slice(0, 10); // "2026-03-15"

const formatDivider = (fechaHora: string) => {
    const date = new Date(fechaHora);
    return date.toLocaleDateString('es-PE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }); // "sábado, 15 de marzo de 2026"
};

// Transforma el array plano en array con dividers
type ListItem = { type: 'divider'; fecha: string; count: number } | { type: 'venta'; data: Venta };

const buildListWithDividers = (ventas: Venta[]): ListItem[] => {
    const result: ListItem[] = [];
    let lastKey = '';

    for (const venta of ventas) {
        const key = getFechaKey(venta.fecha_hora);
        if (key !== lastKey) {
            const count = ventas.filter(v => getFechaKey(v.fecha_hora) === key).length;
            result.push({ type: 'divider', fecha: venta.fecha_hora, count });
            lastKey = key;
        }
        result.push({ type: 'venta', data: venta });
    }

    return result;
};


// ─── VentasScreen ─────────────────────────────────────────────────────────────


export default function VentasScreen() {
    const {
        ventasPorTienda,
        loadingVentasHoy,
        fetchNextVentasPage,
        hasNextVentasPage,
        isFetchingNextVentasPage,
    } = useVentas();
    const router = useRouter();
    const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);

    const listData = useMemo(
        () => buildListWithDividers(ventasPorTienda ?? []),
        [ventasPorTienda]
    );

    if (loadingVentasHoy) {
        return (
            <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color="#111" />
                <Text style={styles.loadingText}>Cargando ventas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Ventas</Text>
                    <Text style={styles.headerSub}>
                        {ventasPorTienda?.length} registro{ventasPorTienda?.length !== 1 ? 's' : ''}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => router.push('/hacerventa')}
                    activeOpacity={0.85}
                >
                    <Icon name="plus" size={16} color="#fff" />
                    <Text style={styles.fabText}>Hacer Venta</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={listData}
                keyExtractor={(item, index) =>
                    item.type === 'divider' ? `divider-${item.fecha}` : `venta-${item.data.id}`
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                    if (hasNextVentasPage && !isFetchingNextVentasPage) {
                        fetchNextVentasPage();
                    }
                }}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                    isFetchingNextVentasPage ? (
                        <ActivityIndicator size="small" color="#111" style={{ marginVertical: 16 }} />
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <Icon name="receipt-text-outline" size={52} color="#e5e7eb" />
                        <Text style={styles.emptyTitle}>Sin ventas</Text>
                        <Text style={styles.emptySubtitle}>No hay registros para mostrar</Text>
                    </View>
                }
                renderItem={({ item }) => {
                    if (item.type === 'divider') {
                        return (
                            <View style={styles.dividerWrap}>
                                <View style={styles.dividerLine} />
                                <View style={styles.dividerBadge}>
                                    <Text style={styles.dividerText}>
                                        {formatDivider(item.fecha)}
                                    </Text>
                                    <View style={styles.dividerCount}>
                                        <Text style={styles.dividerCountText}>{item.count}</Text>
                                    </View>
                                </View>
                                <View style={styles.dividerLine} />
                            </View>
                        );
                    }
                    return (
                        <VentaCard venta={item.data} onPress={() => setSelectedVenta(item.data)} />
                    );
                }}
            />

            <VentaDetalleModal
                venta={selectedVenta}
                visible={!!selectedVenta}
                onClose={() => setSelectedVenta(null)}
            />
        </View>
    );
}
// ─── VentaDetalleModal ────────────────────────────────────────────────────────


// ─── styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#f9fafb' },
    loadingWrap: { flex: 1, backgroundColor: '#f9fafb', justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 15, color: '#9ca3af' },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
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

    listContent: { padding: 16, paddingBottom: 100 },

    ventaCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 16,
        borderWidth: 0.5, borderColor: '#e5e7eb',

    },
    cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    cardAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    cardAvatarText: { fontSize: 18, fontWeight: '700' },
    cardCliente: { fontSize: 16, fontWeight: '600', color: '#111' },
    cardSerie: { fontSize: 12, color: '#9ca3af', marginTop: 2 },

    estadoBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
    },
    estadoDot: { width: 6, height: 6, borderRadius: 3 },
    estadoText: { fontSize: 12, fontWeight: '600' },

    cardDivider: { height: 0.5, backgroundColor: '#f3f4f6', marginVertical: 12 },
    cardBottom: { flexDirection: 'row', alignItems: 'flex-end' },
    cardStat: { flex: 1 },
    cardStatLabel: { fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
    cardStatValue: { fontSize: 13, fontWeight: '500', color: '#374151' },
    cardTotal: { fontSize: 18, fontWeight: '700', color: '#111' },

    emptyWrap: { alignItems: 'center', paddingTop: 80, gap: 8 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: '#9ca3af' },
    emptySubtitle: { fontSize: 14, color: '#d1d5db' },

    // Agrega estos estilos a tu StyleSheet
dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 4,
},
dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
},
dividerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 10,
},
dividerText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    textTransform: 'capitalize',
},
dividerCount: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
},
dividerCountText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
},
});

