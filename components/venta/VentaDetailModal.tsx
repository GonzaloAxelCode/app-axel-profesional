import T from "@/constants/THEME";
import { Venta } from "@/State/models/venta.models";
import { useVentaStore } from '@/State/store/useVentaStore';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from "expo-image";
import { useEffect, useState } from 'react';
import {
    Linking,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ActivityIndicator, Text } from "react-native-paper";


// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatFecha = (fecha: string) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-PE', {
        month: 'short', day: 'numeric', year: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });
};

const ESTADO_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
    aceptado: { bg: T.green + '18', text: T.green, dot: T.green },
    pendiente: { bg: T.amber + '18', text: T.amber, dot: T.amber },
    anulado: { bg: T.red + '18', text: T.red, dot: T.red },
    cancelado: { bg: T.surfaceAlt, text: T.textSecondary, dot: T.textMuted },
};
const getEstadoStyle = (e: string) =>
    ESTADO_STYLES[e?.toLowerCase()] ?? ESTADO_STYLES.cancelado;

const COMPROBANTE_LABEL: Record<string, string> = {
    '01': 'FACTURA', '03': 'BOLETA', boleta: 'BOLETA', factura: 'FACTURA',
};
const getTipoLabel = (tipo: string) =>
    COMPROBANTE_LABEL[tipo?.toLowerCase()] ?? tipo?.toUpperCase() ?? '—';

const getInitial = (n: string) => n?.trim()?.charAt(0)?.toUpperCase() ?? '?';

const AVATAR_COLORS = [T.accent, T.green, T.blue, '#f9a8d4', T.amber, T.purple];
const getAvatarColor = (n: string) =>
    AVATAR_COLORS[(n?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

// ─── Cancel Confirm Modal ─────────────────────────────────────────────────────
function CancelConfirmModal({ visible, loading, onConfirm, onClose }: {
    visible: boolean;
    loading: boolean;
    onConfirm: () => void;
    onClose: () => void;
}) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={mStyles.cancelOverlay}>
                <View style={mStyles.cancelSheet}>
                    <View style={mStyles.cancelIconWrap}>
                        <Icon name="alert-circle-outline" size={38} color={T.red} />
                    </View>
                    <Text style={mStyles.cancelTitle}>¿Anular comprobante?</Text>
                    <Text style={mStyles.cancelSubtitle}>
                        Esta acción es irreversible. El comprobante quedará anulado ante SUNAT.
                    </Text>
                    <TouchableOpacity
                        style={mStyles.cancelConfirmBtn}
                        onPress={onConfirm}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator size="small" color="#fff" />
                            : <>
                                <Icon name="cancel" size={18} color="#fff" />
                                <Text style={mStyles.cancelConfirmText}>Sí, anular venta</Text>
                            </>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={mStyles.cancelDismissBtn} onPress={onClose} activeOpacity={0.7}>
                        <Text style={mStyles.cancelDismissText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
    return (
        <View style={mStyles.sectionHeader}>
            <Text style={mStyles.sectionLabel}>{label}</Text>
            <View style={mStyles.sectionLine} />
        </View>
    );
}

// ─── VentaDetalleModal ────────────────────────────────────────────────────────
function VentaDetalleModal({
    venta, visible, onClose,
}: { venta: Venta | null; visible: boolean; onClose: () => void }) {
    const { anularVenta, temporaryVenta, loadingNotaCredito } = useVentaStore();
    const [whatsappNum, setWhatsappNum] = useState('');
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    useEffect(() => {

    }, [venta]);

    if (!venta) return null;

    const cp = venta.comprobante;
    const estadoStyle = getEstadoStyle(venta.estado);
    const tipoLabel = getTipoLabel(cp?.tipo_comprobante ?? venta.tipo_comprobante);
    const serie = cp?.serie ?? '—';
    const correlativo = cp?.correlativo ?? '—';
    const avatarColor = getAvatarColor(venta?.comprobante?.nombre_cliente || "Anonima");
    const isAnulado = venta.estado?.toLowerCase() === 'anulado';

    const handleWhatsApp = () => {
        const num = whatsappNum.replace(/\D/g, '');
        if (!num) return;
        const mensaje = encodeURIComponent(
            `👋 Hola, somos *Axel Accesories*\n\n` +
            `🧾 *Comprobante de pago*\n` +
            `Tipo: ${venta.tipo_comprobante}\n` +
            `Serie: ${venta.comprobante.serie}-${venta.comprobante.correlativo}\n\n` +
            `Total: *S/ ${venta.total}*\n\n` +
            `📄 Descargar: ${venta.comprobante.ticket_url}\n\nGracias por tu compra 🙌`
        );
        Linking.openURL(`https://wa.me/51${num}?text=${mensaje}`);
    };

    const handleAnularConfirm = () => {
        setShowCancelConfirm(false);
        anularVenta(temporaryVenta.id, {
            venta_id: temporaryVenta.id,
            tipo_motivo: "01",
            motivo: "Anulación de la operación",
        });
    };

    const docButtons = [
        { label: 'PDF', icon: 'file-pdf-box', color: T.red, url: cp?.pdf_url },
        { label: 'XML', icon: 'code-tags', color: T.blue, url: cp?.xml_url },
        { label: 'CDR', icon: 'file-check', color: T.green, url: cp?.cdr_url },
        { label: 'Ticket', icon: 'receipt', color: T.purple, url: cp?.ticket_url },
    ];

    return (
        <>
            <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
                <StatusBar barStyle="light-content" backgroundColor={T.bg} />
                <SafeAreaView style={mStyles.screen}>

                    {/* ── TOP BAR ── */}
                    <View style={mStyles.topBar}>
                        <TouchableOpacity style={mStyles.backBtn} onPress={onClose} activeOpacity={0.8}>
                            <Icon name="arrow-left" size={20} color={T.textPrimary} />
                        </TouchableOpacity>
                        <Text style={mStyles.topBarTitle}>Detalle de venta</Text>
                        {!isAnulado ? (
                            <TouchableOpacity
                                style={mStyles.anularTopBtn}
                                onPress={() => setShowCancelConfirm(true)}
                                activeOpacity={0.8}
                            >
                                {loadingNotaCredito
                                    ? <ActivityIndicator size="small" color={T.red} />
                                    : <>
                                        <Icon name="cancel" size={14} color={T.red} />
                                        <Text style={mStyles.anularTopBtnText}>Anular</Text>
                                    </>
                                }
                            </TouchableOpacity>
                        ) : (
                            <View style={mStyles.anularTopBtnGhost} />
                        )}
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={mStyles.scrollContent}>

                        {/* ── HERO ── */}
                        <View style={mStyles.heroArea}>
                            {isAnulado && (
                                <View style={mStyles.anuladaBanner}>
                                    <Icon name="cancel" size={14} color={T.red} />
                                    <Text style={mStyles.anuladaText}>Comprobante anulado · {formatFecha(venta.fecha_hora)}</Text>
                                </View>
                            )}

                            <Text style={mStyles.comprobanteNum}>{serie} - {correlativo}</Text>

                            <View style={mStyles.heroChips}>
                                <View style={mStyles.tipoChip}>
                                    <Text style={mStyles.tipoChipText}>{tipoLabel}</Text>
                                </View>
                                <View style={[mStyles.estadoBadge, { backgroundColor: estadoStyle.bg, borderColor: estadoStyle.dot + '30' }]}>
                                    <View style={[mStyles.estadoDot, { backgroundColor: estadoStyle.dot }]} />
                                    <Text style={[mStyles.estadoText, { color: estadoStyle.text }]}>
                                        {venta.estado?.charAt(0).toUpperCase() + venta.estado?.slice(1)}
                                    </Text>
                                </View>
                            </View>

                            <Text style={[mStyles.totalHero, isAnulado && { color: T.red }]}>
                                S/ {venta.total}
                            </Text>
                        </View>

                        {/* ── DOCUMENTOS ── */}
                        <SectionHeader label="Documentos" />
                        <View style={mStyles.docBtnsRow}>
                            {docButtons.map(({ label, icon, color, url }) => (
                                <TouchableOpacity
                                    key={label}
                                    style={[mStyles.docBtn, !url && { opacity: 0.3 }]}
                                    onPress={() => url && Linking.openURL(url)}
                                    activeOpacity={url ? 0.75 : 1}
                                >
                                    <View style={[mStyles.docBtnIcon, { backgroundColor: color + '18' }]}>
                                        <Icon name={icon as any} size={22} color={url ? color : T.textMuted} />
                                    </View>
                                    <Text style={[mStyles.docBtnLabel, url && { color: T.textSecondary }]}>{label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* ── CLIENTE ── */}
                        <SectionHeader label="Cliente" />
                        <View style={mStyles.clienteCard}>
                            <View style={[mStyles.avatar, { backgroundColor: avatarColor + '18', borderColor: avatarColor + '30', borderWidth: 1.5 }]}>
                                <Text style={[mStyles.avatarText, { color: avatarColor }]}>
                                    {getInitial(venta?.comprobante?.nombre_cliente || "Anonima")}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={mStyles.clienteNombre}>{venta?.comprobante?.nombre_cliente || 'Anónimo'}</Text>
                                <Text style={mStyles.clienteDoc}>
                                    {venta?.comprobante?.tipo_documento_cliente?.toUpperCase() === "1" ? 'DNI' : 'RUC'}: {venta?.comprobante?.numero_documento_cliente || '—'}
                                </Text>
                            </View>
                            <View style={mStyles.clienteArrow}>
                                <Icon name="chevron-right" size={18} color={T.textMuted} />
                            </View>
                        </View>

                        {/* ── WHATSAPP ── */}
                        <SectionHeader label="Enviar comprobante" />
                        <View style={mStyles.whatsappRow}>
                            <View style={mStyles.whatsappInput}>
                                <Icon name="whatsapp" size={18} color={T.green} />
                                <TextInput
                                    placeholder="+51 Número WhatsApp"
                                    placeholderTextColor={T.textMuted}
                                    value={whatsappNum}
                                    onChangeText={setWhatsappNum}
                                    keyboardType="numeric"
                                    style={mStyles.whatsappTextInput}
                                />
                            </View>
                            <TouchableOpacity style={mStyles.whatsappBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
                                <Icon name="send" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* ── ORDER TRACKING STYLE — Status ── */}
                        <SectionHeader label="Estado del comprobante" />
                        <View style={mStyles.trackingCard}>
                            {[
                                { label: 'Venta registrada', sub: formatFecha(venta.fecha_hora), done: true, icon: 'check-circle' },
                                { label: 'Enviado a SUNAT', sub: 'Procesando...', done: venta.estado === 'aceptado' || venta.estado === 'anulado', icon: 'cloud-upload' },
                                { label: 'Aceptado', sub: venta.estado === 'aceptado' ? 'Comprobante válido' : 'Pendiente', done: venta.estado === 'aceptado', icon: 'check-decagram' },
                            ].map((step, i) => (
                                <View key={i} style={mStyles.trackStep}>
                                    <View style={[mStyles.trackDot, step.done && mStyles.trackDotDone]}>
                                        <Icon
                                            name={step.done ? step.icon as any : 'circle-outline'}
                                            size={16}
                                            color={step.done ? T.bg : T.textMuted}
                                        />
                                    </View>
                                    {i < 2 && (
                                        <View style={[mStyles.trackLine, step.done && mStyles.trackLineDone]} />
                                    )}
                                    <View style={mStyles.trackInfo}>
                                        <Text style={[mStyles.trackLabel, step.done && { color: T.textPrimary }]}>{step.label}</Text>
                                        <Text style={mStyles.trackSub}>{step.sub}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* ── RESUMEN ── */}
                        <SectionHeader label="Resumen financiero" />
                        <View style={mStyles.statsCard}>
                            {[
                                { label: 'Método de pago', value: venta.metodo_pago?.toUpperCase() ?? '—' },
                                { label: 'Fecha', value: formatFecha(venta.fecha_hora) },
                                { label: 'Serie', value: serie },
                                { label: 'Correlativo', value: correlativo },
                                { label: 'Estado', value: venta.estado?.charAt(0).toUpperCase() + venta.estado?.slice(1) },
                                { label: 'Moneda', value: cp?.moneda ?? 'PEN' },
                                { label: 'Subtotal', value: `S/ ${venta.subtotal ?? cp?.sub_total ?? '—'}` },
                                { label: 'IGV (18%)', value: `S/ ${venta.igv_total ?? cp?.igv ?? '—'}` },
                            ].map(({ label, value }, i, arr) => (
                                <View key={label}>
                                    <View style={mStyles.statRow}>
                                        <Text style={mStyles.statLabel}>{label}</Text>
                                        <Text style={mStyles.statValue}>{value}</Text>
                                    </View>
                                    {i < arr.length - 1 && <View style={mStyles.statDivider} />}
                                </View>
                            ))}
                        </View>
                        <View style={[mStyles.totalRow, isAnulado && { borderColor: T.red + '30', backgroundColor: T.red + '08' }]}>
                            <Text style={[mStyles.totalLabel, isAnulado && { color: T.red }]}>Total</Text>
                            <Text style={[mStyles.totalValue, isAnulado && { color: T.red }]}>S/ {venta.total}</Text>
                        </View>

                        {/* ── PRODUCTOS ── */}
                        <SectionHeader label={`Productos · ${venta.productos?.length ?? 0}`} />
                        <View style={{ gap: 8, marginBottom: 16 }}>
                            {venta.productos?.map((p, i) => (
                                <View key={i} style={mStyles.productoCard}>
                                    {p.producto_imagen ? (
                                        <Image source={{ uri: p.producto_imagen }} style={mStyles.productoImg} contentFit="cover" />
                                    ) : (
                                        <View style={[mStyles.productoImg, mStyles.productoImgPlaceholder]}>
                                            <Icon name="package-variant-closed" size={20} color={T.textMuted} />
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

                        {/* ── FOOTER ACTIONS ── */}
                        <View style={mStyles.footerActions}>
                            <TouchableOpacity
                                style={[mStyles.ticketBtn, !cp?.ticket_url && { opacity: 0.4 }]}
                                onPress={() => cp?.ticket_url && Linking.openURL(cp.ticket_url)}
                                activeOpacity={cp?.ticket_url ? 0.8 : 1}
                            >
                                <View style={mStyles.ticketIconWrap}>
                                    <Icon name="printer-outline" size={20} color={cp?.ticket_url ? T.accent : T.textMuted} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[mStyles.ticketBtnText, !cp?.ticket_url && { color: T.textMuted }]}>Imprimir ticket</Text>
                                    <Text style={mStyles.ticketBtnSub}>{cp?.ticket_url ? 'Abre en el navegador' : 'No disponible'}</Text>
                                </View>
                                <Icon name="open-in-new" size={15} color={T.textMuted} />
                            </TouchableOpacity>

                            {!isAnulado && (
                                <TouchableOpacity
                                    style={mStyles.anularFooterBtn}
                                    onPress={() => setShowCancelConfirm(true)}
                                    activeOpacity={0.8}
                                >
                                    {loadingNotaCredito
                                        ? <ActivityIndicator size="small" color={T.red} />
                                        : <>
                                            <Icon name="cancel" size={18} color={T.red} />
                                            <Text style={mStyles.anularFooterText}>Anular venta</Text>
                                        </>
                                    }
                                </TouchableOpacity>
                            )}
                        </View>

                    </ScrollView>
                </SafeAreaView>
            </Modal>

            <CancelConfirmModal
                visible={showCancelConfirm}
                loading={loadingNotaCredito}
                onConfirm={handleAnularConfirm}
                onClose={() => setShowCancelConfirm(false)}
            />
        </>
    );
}
export default VentaDetalleModal;

// ─── Modal Styles ─────────────────────────────────────────────────────────────
const mStyles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: T.bg },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

    topBar: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: T.border,
        backgroundColor: T.bg, gap: 12,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 13,
        backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: T.border,
    },
    topBarTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: T.textPrimary, letterSpacing: -0.3 },
    anularTopBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: T.red + '15', borderRadius: 12,
        paddingHorizontal: 12, paddingVertical: 8,
        borderWidth: 1, borderColor: T.red + '30',
        minWidth: 72, justifyContent: 'center',
    },
    anularTopBtnText: { fontSize: 13, fontWeight: '700', color: T.red },
    anularTopBtnGhost: { minWidth: 72 },

    heroArea: { paddingTop: 24, paddingBottom: 4 },
    anuladaBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: T.red + '15', borderWidth: 1, borderColor: T.red + '30',
        borderRadius: 12, padding: 12, marginBottom: 16,
    },
    anuladaText: { fontSize: 12, color: T.red, fontWeight: '600', flex: 1 },
    comprobanteNum: { fontSize: 36, fontWeight: '900', color: T.textPrimary, letterSpacing: -1.5, marginBottom: 10 },
    heroChips: { flexDirection: 'row', gap: 8, marginBottom: 14 },
    tipoChip: {
        backgroundColor: T.surface, borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 6,
        borderWidth: 1, borderColor: T.border,
    },
    tipoChipText: { fontSize: 11, fontWeight: '700', color: T.textSecondary },
    estadoBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
    estadoDot: { width: 6, height: 6, borderRadius: 3 },
    estadoText: { fontSize: 11, fontWeight: '700' },
    totalHero: { fontSize: 48, fontWeight: '900', color: T.accent, letterSpacing: -2, marginBottom: 8 },

    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24, marginBottom: 14 },
    sectionLabel: { fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: '700' },
    sectionLine: { flex: 1, height: 1, backgroundColor: T.border },

    docBtnsRow: { flexDirection: 'row', gap: 8 },
    docBtn: {
        flex: 1, alignItems: 'center', gap: 8, paddingVertical: 14,
        backgroundColor: T.surface, borderRadius: T.radiusMd,
        borderWidth: 1, borderColor: T.border,
    },
    docBtnIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    docBtnLabel: { fontSize: 11, fontWeight: '700', color: T.textMuted },

    clienteCard: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: T.surface, borderRadius: T.radiusMd,
        padding: 14, borderWidth: 1, borderColor: T.border,
    },
    avatar: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontWeight: '900', fontSize: 20 },
    clienteNombre: { fontSize: 15, fontWeight: '700', color: T.textPrimary },
    clienteDoc: { fontSize: 12, color: T.textSecondary, marginTop: 2 },
    clienteArrow: {
        width: 30, height: 30, borderRadius: 9,
        backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: T.border,
    },

    whatsappRow: { flexDirection: 'row', gap: 10 },
    whatsappInput: {
        flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: T.surface, borderRadius: T.radiusMd,
        paddingHorizontal: 14, borderWidth: 1, borderColor: T.border,
    },
    whatsappTextInput: { flex: 1, color: T.textPrimary, fontSize: 14, paddingVertical: 14 },
    whatsappBtn: {
        backgroundColor: '#15803d', borderRadius: T.radiusMd,
        paddingHorizontal: 18, paddingVertical: 14,
        alignItems: 'center', justifyContent: 'center',
    },

    // Tracking style
    trackingCard: {
        backgroundColor: T.surface, borderRadius: T.radiusMd,
        padding: 16, borderWidth: 1, borderColor: T.border,
    },
    trackStep: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
    trackDot: {
        width: 32, height: 32, borderRadius: 10,
        backgroundColor: T.surfaceAlt, borderWidth: 1, borderColor: T.border,
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    trackDotDone: { backgroundColor: T.accent, borderColor: T.accent },
    trackLine: {
        position: 'absolute', left: 15, top: 32,
        width: 2, height: 20, backgroundColor: T.border, zIndex: 0,
    },
    trackLineDone: { backgroundColor: T.accent },
    trackInfo: { flex: 1, paddingTop: 4 },
    trackLabel: { fontSize: 13, fontWeight: '600', color: T.textSecondary },
    trackSub: { fontSize: 11, color: T.textMuted, marginTop: 2 },

    statsCard: {
        backgroundColor: T.surface, borderRadius: T.radiusMd,
        paddingHorizontal: 16, paddingVertical: 4,
        borderWidth: 1, borderColor: T.border, marginBottom: 8,
    },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
    statDivider: { height: 1, backgroundColor: T.border },
    statLabel: { fontSize: 13, color: T.textMuted },
    statValue: { fontSize: 13, fontWeight: '600', color: T.textSecondary },
    totalRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 16, backgroundColor: T.accentDim,
        borderRadius: T.radiusMd, paddingHorizontal: 16,
        borderWidth: 1, borderColor: T.accent + '25',
    },
    totalLabel: { fontSize: 11, fontWeight: '700', color: T.accent, textTransform: 'uppercase', letterSpacing: 1 },
    totalValue: { fontSize: 30, fontWeight: '900', color: T.accent, letterSpacing: -1 },

    productoCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: T.surface, borderRadius: T.radiusMd,
        padding: 12, borderWidth: 1, borderColor: T.border,
    },
    productoImg: { width: 56, height: 56, borderRadius: 12 },
    productoImgPlaceholder: {
        backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: T.border,
    },
    productoNombre: { fontSize: 14, fontWeight: '600', color: T.textPrimary, marginBottom: 8 },
    productoFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cantidadBadge: {
        backgroundColor: T.accentDim, borderRadius: 8,
        paddingHorizontal: 8, paddingVertical: 3,
        borderWidth: 1, borderColor: T.accent + '30',
    },
    cantidadText: { fontSize: 11, fontWeight: '700', color: T.accent },
    productoTotal: { fontSize: 15, fontWeight: '800', color: T.textPrimary },

    footerActions: { gap: 10, marginTop: 8 },
    ticketBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        backgroundColor: T.surface, borderRadius: T.radiusLg,
        paddingVertical: 14, paddingHorizontal: 16,
        borderWidth: 1, borderColor: T.border,
    },
    ticketIconWrap: {
        width: 42, height: 42, borderRadius: 13,
        backgroundColor: T.accentDim, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: T.accent + '30',
    },
    ticketBtnText: { fontSize: 14, fontWeight: '700', color: T.textPrimary },
    ticketBtnSub: { fontSize: 11, color: T.textMuted, marginTop: 2 },
    anularFooterBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        borderRadius: T.radiusLg, paddingVertical: 15,
        backgroundColor: T.red + '12', borderWidth: 1, borderColor: T.red + '30',
    },
    anularFooterText: { fontSize: 15, fontWeight: '700', color: T.red },

    cancelOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center', alignItems: 'center', padding: 24,
    },
    cancelSheet: {
        backgroundColor: T.surface, borderRadius: T.radiusXl,
        padding: 28, alignItems: 'center', width: '100%',
        borderWidth: 1, borderColor: T.border,
    },
    cancelIconWrap: {
        width: 72, height: 72, borderRadius: 20,
        backgroundColor: T.red + '15', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: T.red + '30', marginBottom: 20,
    },
    cancelTitle: { fontSize: 20, fontWeight: '900', color: T.textPrimary, letterSpacing: -0.5, marginBottom: 10 },
    cancelSubtitle: { fontSize: 14, color: T.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
    cancelConfirmBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: T.red, borderRadius: T.radiusMd,
        paddingVertical: 15, paddingHorizontal: 24,
        width: '100%', justifyContent: 'center', marginBottom: 10, minHeight: 52,
    },
    cancelConfirmText: { fontSize: 15, fontWeight: '800', color: '#fff' },
    cancelDismissBtn: {
        paddingVertical: 14, paddingHorizontal: 24, borderRadius: T.radiusMd,
        width: '100%', alignItems: 'center',
        backgroundColor: T.surfaceAlt, borderWidth: 1, borderColor: T.border,
    },
    cancelDismissText: { fontSize: 15, fontWeight: '600', color: T.textSecondary },
});