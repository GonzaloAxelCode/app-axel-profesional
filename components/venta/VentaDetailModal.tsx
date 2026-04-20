import { Venta } from '@/State/models/venta.models';
import { C } from '@/State/utils/c';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
    Alert,
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
import { Text } from 'react-native-paper';

// ─── helpers ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [C.accent, '#6ee7b7', '#93c5fd', '#f9a8d4', '#fcd34d', '#a78bfa'];
const getAvatarColor = (n: string) => AVATAR_COLORS[(n?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
const getInitial = (name: string) => name?.trim()?.charAt(0)?.toUpperCase() ?? '?';

const getTipoLabel = (tipo: string) => {
    const map: Record<string, string> = {
        factura: 'Factura Electrónica',
        boleta: 'Boleta de Venta',
        nota_credito: 'Nota de Crédito',
        nota_debito: 'Nota de Débito',
    };
    return map[tipo] ?? tipo?.toUpperCase() ?? 'Comprobante';
};

const formatFecha = (fecha: string) => {
    if (!fecha) return '—';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getEstado = (estado: string) => {
    const map: Record<string, { color: string; bg: string; label: string }> = {
        pagado: { color: C.green, bg: C.green + '15', label: 'Pagado' },
        pendiente: { color: C.yellow, bg: C.yellow + '15', label: 'Pendiente' },
        anulada: { color: C.red, bg: C.red + '15', label: 'Anulada' },
    };
    return map[estado] ?? { color: C.textSecondary, bg: C.surfaceAlt, label: estado ?? '—' };
};



// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
    return (
        <View style={mStyles.sectionHeader}>
            <Text style={mStyles.sectionLabel}>{label}</Text>
            <View style={mStyles.sectionLine} />
        </View>
    );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={mStyles.infoRow}>
            <Text style={mStyles.infoLabel}>{label}</Text>
            <Text style={mStyles.infoValue} numberOfLines={1}>{value}</Text>
        </View>
    );
}

// ─── Cancel Confirmation ──────────────────────────────────────────────────────
function CancelModal({ visible, onConfirm, onClose }: {
    visible: boolean;
    onConfirm: () => void;
    onClose: () => void;
}) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={mStyles.cancelOverlay}>
                <View style={mStyles.cancelSheet}>
                    <View style={mStyles.cancelIconWrap}>
                        <Icon name="alert-circle-outline" size={36} color={C.red} />
                    </View>
                    <Text style={mStyles.cancelTitle}>¿Anular comprobante?</Text>
                    <Text style={mStyles.cancelSubtitle}>
                        Esta acción es irreversible. El comprobante quedará anulado ante SUNAT.
                    </Text>
                    <TouchableOpacity style={mStyles.cancelConfirmBtn} onPress={onConfirm} activeOpacity={0.8}>
                        <Icon name="cancel" size={18} color="#fff" />
                        <Text style={mStyles.cancelConfirmText}>Sí, anular venta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={mStyles.cancelDismissBtn} onPress={onClose} activeOpacity={0.7}>
                        <Text style={mStyles.cancelDismissText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

// ─── VentaDetalleModal ────────────────────────────────────────────────────────
export function VentaDetalleModal({
    venta, visible, onClose,
}: { venta: Venta | null; visible: boolean; onClose: () => void }) {
    const [whatsappNum, setWhatsappNum] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);

    if (!venta) return null;

    const cp = venta.comprobante;
    const isAnulada = venta.estado === 'anulada';
    const tipoLabel = getTipoLabel(cp?.tipo_comprobante ?? venta.tipo_comprobante ?? '');
    const serie = cp?.serie ?? '—';
    const correlativo = cp?.correlativo ?? '—';
    const avatarColor = getAvatarColor(venta.nombre_cliente ?? '');
    const estadoCfg = getEstado(venta.estado);

    const handleWhatsApp = () => {
        const num = whatsappNum.replace(/\D/g, '');
        if (!num) return;
        Linking.openURL(`https://wa.me/51${num}`);
    };

    const handleCancelConfirm = () => {
        setShowCancelModal(false);
        // TODO: dispatch cancel action
        Alert.alert('Venta anulada', 'El comprobante fue anulado correctamente.');
        onClose();
    };

    const docButtons = [
        { label: 'PDF', icon: 'file-pdf-box', color: C.red, url: cp?.pdf_url },
        { label: 'XML', icon: 'code-tags', color: C.blue, url: cp?.xml_url },
        { label: 'CDR', icon: 'file-check', color: C.green, url: cp?.cdr_url },
        { label: 'Ticket', icon: 'receipt', color: C.purple, url: cp?.ticket_url },
    ];

    return (
        <>
            <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
                <StatusBar barStyle="light-content" backgroundColor={C.bg} />
                <SafeAreaView style={mStyles.screen}>

                    {/* ── TOP BAR ── */}
                    <View style={mStyles.topBar}>
                        <TouchableOpacity style={mStyles.backBtn} onPress={onClose}>
                            <Icon name="arrow-left" size={20} color={C.textPrimary} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }} />
                        {/* Cancel sale button — only if not already anulada */}
                        {!isAnulada && (
                            <TouchableOpacity
                                style={mStyles.cancelBtn}
                                onPress={() => setShowCancelModal(true)}
                                activeOpacity={0.8}
                            >
                                <Icon name="cancel" size={15} color={C.red} />
                                <Text style={mStyles.cancelBtnText}>Anular</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={mStyles.scrollContent}
                    >
                        {/* ── HERO ── */}
                        <View style={mStyles.heroArea}>
                            {isAnulada && (
                                <View style={mStyles.anuladaBanner}>
                                    <Icon name="cancel" size={15} color={C.red} />
                                    <Text style={mStyles.anuladaText}>
                                        Comprobante anulado · {formatFecha(venta.fecha_hora ?? '')}
                                    </Text>
                                </View>
                            )}
                            <Text style={mStyles.comprobanteNum}>{serie} - {correlativo}</Text>
                            <View style={mStyles.heroMeta}>
                                <View style={mStyles.tipoChip}>
                                    <Text style={mStyles.tipoChipText}>{tipoLabel}</Text>
                                </View>
                                <View style={[mStyles.estadoBadge, { backgroundColor: estadoCfg.bg }]}>
                                    <View style={[mStyles.estadoDot, { backgroundColor: estadoCfg.color }]} />
                                    <Text style={[mStyles.estadoText, { color: estadoCfg.color }]}>
                                        {estadoCfg.label}
                                    </Text>
                                </View>
                            </View>
                            <Text style={[mStyles.totalHero, isAnulada && { color: C.red }]}>
                                S/ {venta.total ?? '0.00'}
                            </Text>
                        </View>

                        {/* ── DOC BUTTONS ── */}
                        <SectionHeader label="Documentos" />
                        <View style={mStyles.docRow}>
                            {docButtons.map(({ label, icon, color, url }) => (
                                <TouchableOpacity
                                    key={label}
                                    style={[mStyles.docBtn, !url && { opacity: 0.3 }]}
                                    onPress={() => url && Linking.openURL(url)}
                                    activeOpacity={url ? 0.75 : 1}
                                >
                                    <View style={[mStyles.docBtnIcon, { backgroundColor: color + '15' }]}>
                                        <Icon name={icon as any} size={22} color={url ? color : C.textMuted} />
                                    </View>
                                    <Text style={[mStyles.docLabel, url && { color: C.textSecondary }]}>{label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* ── CLIENTE ── */}
                        <SectionHeader label="Cliente" />
                        <View style={mStyles.clienteCard}>
                            <View style={[mStyles.clienteAvatar, { backgroundColor: avatarColor + '18', borderColor: avatarColor + '30' }]}>
                                <Text style={[mStyles.clienteAvatarText, { color: avatarColor }]}>
                                    {getInitial(venta.nombre_cliente ?? '')}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={mStyles.clienteNombre}>{venta.nombre_cliente || 'Anónimo'}</Text>
                                <Text style={mStyles.clienteDoc}>
                                    {venta.tipo_documento_cliente?.toUpperCase()}: {venta.numero_documento_cliente || '—'}
                                </Text>
                            </View>
                        </View>
                        <View style={mStyles.infoCard}>
                            <InfoRow label="Email" value={venta.email_cliente || venta.correo_cliente || 'Sin correo'} />
                            <View style={mStyles.infoDivider} />
                            <InfoRow label="Teléfono" value={venta.telefono_cliente || 'Sin teléfono'} />
                            <View style={mStyles.infoDivider} />
                            <InfoRow label="Dirección" value={venta.direccion_cliente || 'Sin dirección'} />
                        </View>

                        {/* ── WHATSAPP ── */}
                        <SectionHeader label="Enviar comprobante" />
                        <View style={mStyles.waRow}>
                            <View style={mStyles.waInput}>
                                <Icon name="whatsapp" size={18} color={C.green} />
                                <TextInput
                                    placeholder="+51 Número WhatsApp"
                                    placeholderTextColor={C.textMuted}
                                    value={whatsappNum}
                                    onChangeText={setWhatsappNum}
                                    keyboardType="numeric"
                                    style={mStyles.waTextInput}
                                />
                            </View>
                            <TouchableOpacity style={mStyles.waBtn} onPress={handleWhatsApp} activeOpacity={0.8}>
                                <Icon name="send" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* ── RESUMEN ── */}
                        <SectionHeader label="Resumen financiero" />
                        <View style={mStyles.resumenCard}>
                            {[
                                { label: 'Método de pago', value: venta.metodo_pago?.toUpperCase() ?? '—' },
                                { label: 'Fecha y hora', value: formatFecha(venta.fecha_hora ?? '') },
                                { label: 'Moneda', value: cp?.moneda ?? 'PEN' },
                                { label: 'Subtotal', value: `S/ ${venta.subtotal ?? cp?.sub_total ?? '—'}` },
                                { label: 'IGV (18%)', value: `S/ ${venta.igv_total ?? cp?.igv ?? '—'}` },
                            ].map(({ label, value }, i, arr) => (
                                <View key={label}>
                                    <View style={mStyles.statRow}>
                                        <Text style={mStyles.statLabel}>{label}</Text>
                                        <Text style={mStyles.statValue}>{value}</Text>
                                    </View>
                                    {i < arr.length - 1 && <View style={mStyles.infoDivider} />}
                                </View>
                            ))}
                        </View>
                        <View style={[mStyles.totalRow, isAnulada && { borderColor: C.red + '30', backgroundColor: C.red + '08' }]}>
                            <Text style={[mStyles.totalLabel, isAnulada && { color: C.red }]}>Total</Text>
                            <Text style={[mStyles.totalValue, isAnulada && { color: C.red }]}>
                                S/ {venta.total}
                            </Text>
                        </View>

                        {/* ── PRODUCTOS ── */}
                        <SectionHeader label={`Productos · ${venta.productos?.length ?? 0}`} />
                        <View style={{ gap: 8, marginBottom: 24 }}>
                            {venta.productos?.map((p, i) => (
                                <View key={i} style={mStyles.productoRow}>
                                    {p.producto_imagen ? (
                                        <Image
                                            source={{ uri: p.producto_imagen }}
                                            style={mStyles.productoImg}
                                            contentFit="cover"
                                        />
                                    ) : (
                                        <View style={[mStyles.productoImg, mStyles.productoImgEmpty]}>
                                            <Icon name="package-variant-closed" size={18} color={C.textMuted} />
                                        </View>
                                    )}
                                    <View style={{ flex: 1, paddingLeft: 12 }}>
                                        <Text style={mStyles.productoNombre} numberOfLines={2}>{p.producto_nombre}</Text>
                                        <View style={mStyles.productoFooter}>
                                            <View style={mStyles.cantBadge}>
                                                <Text style={mStyles.cantText}>×{p.cantidad}</Text>
                                            </View>
                                            <Text style={mStyles.productoTotal}>
                                                S/ {((p.precio_unitario ?? p.valor_unitario ?? 0) * p.cantidad).toFixed(2)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* ── ANULAR BOTTOM CTA ── */}
                        {!isAnulada && (
                            <TouchableOpacity
                                style={mStyles.anularBigBtn}
                                onPress={() => setShowCancelModal(true)}
                                activeOpacity={0.8}
                            >
                                <Icon name="cancel" size={20} color={C.red} />
                                <Text style={mStyles.anularBigText}>Anular venta</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            <CancelModal
                visible={showCancelModal}
                onConfirm={handleCancelConfirm}
                onClose={() => setShowCancelModal(false)}
            />
        </>
    );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const mStyles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.bg },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

    // top bar
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        backgroundColor: C.bg,
    },
    backBtn: {
        width: 38, height: 38, borderRadius: 12,
        backgroundColor: C.surface,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: C.border,
    },
    cancelBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: C.red + '12',
        borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
        borderWidth: 1, borderColor: C.red + '25',
    },
    cancelBtnText: { fontSize: 13, fontWeight: '700', color: C.red },

    // hero
    heroArea: { paddingTop: 24, paddingBottom: 8 },
    anuladaBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: C.red + '12', borderWidth: 1, borderColor: C.red + '25',
        borderRadius: 10, padding: 10, marginBottom: 16,
    },
    anuladaText: { fontSize: 12, color: C.red, fontWeight: '600', flex: 1 },
    comprobanteNum: { fontSize: 34, fontWeight: '800', color: C.textPrimary, letterSpacing: -1, marginBottom: 10 },
    heroMeta: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    tipoChip: {
        backgroundColor: C.surface, borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 5,
        borderWidth: 1, borderColor: C.border,
    },
    tipoChipText: { fontSize: 11, fontWeight: '600', color: C.textSecondary },
    estadoBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
    },
    estadoDot: { width: 6, height: 6, borderRadius: 3 },
    estadoText: { fontSize: 11, fontWeight: '700' },
    totalHero: { fontSize: 42, fontWeight: '800', color: C.accent, letterSpacing: -1.5 },

    // section header
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24, marginBottom: 12 },
    sectionLabel: { fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700' },
    sectionLine: { flex: 1, height: 1, backgroundColor: C.border },

    // doc buttons
    docRow: { flexDirection: 'row', gap: 8 },
    docBtn: {
        flex: 1, alignItems: 'center', gap: 8, paddingVertical: 14,
        backgroundColor: C.surface, borderRadius: 14,
        borderWidth: 1, borderColor: C.border,
    },
    docBtnIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    docLabel: { fontSize: 11, fontWeight: '700', color: C.textMuted },

    // cliente
    clienteCard: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: C.surface, borderRadius: 14,
        padding: 14, marginBottom: 8,
        borderWidth: 1, borderColor: C.border,
    },
    clienteAvatar: {
        width: 46, height: 46, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5,
    },
    clienteAvatarText: { fontWeight: '800', fontSize: 18 },
    clienteNombre: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
    clienteDoc: { fontSize: 12, color: C.textSecondary, marginTop: 2 },

    // info card
    infoCard: {
        backgroundColor: C.surface, borderRadius: 14,
        paddingHorizontal: 14, paddingVertical: 4,
        borderWidth: 1, borderColor: C.border,
    },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11 },
    infoLabel: { fontSize: 13, color: C.textMuted, fontWeight: '500' },
    infoValue: { fontSize: 13, color: C.textSecondary, flex: 1, textAlign: 'right', fontWeight: '600' },
    infoDivider: { height: 1, backgroundColor: C.border },

    // whatsapp
    waRow: { flexDirection: 'row', gap: 10 },
    waInput: {
        flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: C.surface, borderRadius: 14,
        paddingHorizontal: 14, borderWidth: 1, borderColor: C.border,
    },
    waTextInput: { flex: 1, color: C.textPrimary, fontSize: 14, paddingVertical: 14 },
    waBtn: {
        backgroundColor: '#15803d', borderRadius: 14,
        paddingHorizontal: 20, paddingVertical: 14,
        alignItems: 'center', justifyContent: 'center',
    },

    // resumen
    resumenCard: {
        backgroundColor: C.surface, borderRadius: 14,
        paddingHorizontal: 14, paddingVertical: 4,
        borderWidth: 1, borderColor: C.border,
        marginBottom: 8,
    },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
    statLabel: { fontSize: 13, color: C.textMuted },
    statValue: { fontSize: 13, fontWeight: '600', color: C.textSecondary },
    totalRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 16, backgroundColor: C.accentDim,
        borderRadius: 14, paddingHorizontal: 16,
        borderWidth: 1, borderColor: C.accent + '25',
    },
    totalLabel: { fontSize: 12, fontWeight: '700', color: C.accent, textTransform: 'uppercase', letterSpacing: 1 },
    totalValue: { fontSize: 28, fontWeight: '800', color: C.accent },

    // productos
    productoRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: C.surface, borderRadius: 14,
        padding: 12,
        borderWidth: 1, borderColor: C.border,
    },
    productoImg: { width: 52, height: 52, borderRadius: 10 },
    productoImgEmpty: {
        backgroundColor: C.surfaceAlt,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: C.border,
    },
    productoNombre: { fontSize: 14, fontWeight: '600', color: C.textPrimary, marginBottom: 8 },
    productoFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cantBadge: {
        backgroundColor: C.surfaceAlt, borderRadius: 6,
        paddingHorizontal: 8, paddingVertical: 3,
        borderWidth: 1, borderColor: C.border,
    },
    cantText: { fontSize: 11, fontWeight: '700', color: C.textSecondary },
    productoTotal: { fontSize: 15, fontWeight: '800', color: C.textPrimary },

    // anular big button
    anularBigBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        borderRadius: 16, paddingVertical: 16,
        backgroundColor: C.red + '10',
        borderWidth: 1, borderColor: C.red + '30',
        marginBottom: 8,
    },
    anularBigText: { fontSize: 15, fontWeight: '700', color: C.red },

    // cancel confirm modal
    cancelOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center', alignItems: 'center', padding: 24,
    },
    cancelSheet: {
        backgroundColor: C.surface, borderRadius: 24,
        padding: 28, alignItems: 'center',
        width: '100%',
        borderWidth: 1, borderColor: C.border,
    },
    cancelIconWrap: {
        width: 72, height: 72, borderRadius: 20,
        backgroundColor: C.red + '12',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: C.red + '25',
        marginBottom: 20,
    },
    cancelTitle: { fontSize: 20, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.5, marginBottom: 10 },
    cancelSubtitle: {
        fontSize: 14, color: C.textSecondary, textAlign: 'center',
        lineHeight: 22, marginBottom: 28,
    },
    cancelConfirmBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: C.red, borderRadius: 14,
        paddingVertical: 15, paddingHorizontal: 24,
        width: '100%', justifyContent: 'center',
        marginBottom: 10,
    },
    cancelConfirmText: { fontSize: 15, fontWeight: '800', color: '#fff' },
    cancelDismissBtn: {
        paddingVertical: 14, paddingHorizontal: 24,
        borderRadius: 14, width: '100%', alignItems: 'center',
        backgroundColor: C.surfaceAlt,
        borderWidth: 1, borderColor: C.border,
    },
    cancelDismissText: { fontSize: 15, fontWeight: '600', color: C.textSecondary },
});