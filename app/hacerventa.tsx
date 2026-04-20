import { useInventario } from '@/State/hooks/useInventarios';
import { InventarioCart } from '@/State/models/inventario.models';
import { Venta } from "@/State/models/venta.models";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from "expo-image";
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, Text } from "react-native-paper";

import { ComprobanteCardSelect, ComprobanteMethod } from '@/components/venta/ComprobanteCardSelect';
import { Cliente } from '@/State/models/cliente.models';
import { useVentaStore } from '@/State/store/useVentaStore';
import { C } from '@/State/utils/c';
import { logJSON } from '@/utils/logjson';
import { ClienteBottomSheet } from '../components/venta/ClienteBottomSheet';
import { ClienteCard } from '../components/venta/ClienteCard';
import { ConfirmarVentaBtn } from '../components/venta/ConfirmarVentaBtn';
import { PagoCard, PayMethod } from '../components/venta/PagoCard';
import { ProductosBottomSheet } from '../components/venta/ProductosBottomSheet';
import { ProductosCard } from '../components/venta/ProductosCard';
import { ResumenCard } from '../components/venta/ResumenCard';
import { VentaHeader } from '../components/venta/VentaHeader';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatFecha = (fecha: string) => {
  if (!fecha) return '—';
  const d = new Date(fecha);
  return d.toLocaleDateString('es-PE', {
    month: 'short', day: 'numeric', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
};

const ESTADO_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  aceptado: { bg: C.green + '15', text: C.green, dot: C.green },
  pendiente: { bg: C.yellow + '15', text: C.yellow, dot: C.yellow },
  anulado: { bg: C.red + '15', text: C.red, dot: C.red },
  cancelado: { bg: C.surfaceAlt, text: C.textSecondary, dot: C.textMuted },
};
const getEstadoStyle = (e: string) =>
  ESTADO_STYLES[e?.toLowerCase()] ?? ESTADO_STYLES.cancelado;

const COMPROBANTE_LABEL: Record<string, string> = {
  '01': 'FACTURA', '03': 'BOLETA', boleta: 'BOLETA', factura: 'FACTURA',
};
const getTipoLabel = (tipo: string) =>
  COMPROBANTE_LABEL[tipo?.toLowerCase()] ?? tipo?.toUpperCase() ?? '—';

const getInitial = (n: string) => n?.trim()?.charAt(0)?.toUpperCase() ?? '?';

const AVATAR_COLORS = [C.accent, '#6ee7b7', '#93c5fd', '#f9a8d4', C.yellow, C.purple];
const getAvatarColor = (n: string) =>
  AVATAR_COLORS[(n?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

// ─── HacerVentaScreen ─────────────────────────────────────────────────────────
export default function HacerVentaScreen() {
  const { productos, isLoading } = useInventario();
  const { createVenta, temporaryVenta, showVentaDetailTemporary, loadingCreateVenta } = useVentaStore();

  const bottomSheetRef = useRef<any>(null);
  const bottomSheetRef2 = useRef<any>(null);

  const [cart, setCart] = useState<InventarioCart[]>([]);
  const [payMethod, setPayMethod] = useState<PayMethod>('Efectivo');
  const [comprobanteMethod, setComprobanteMethod] = useState<ComprobanteMethod>('Boleta');
  const [cliente, setCliente] = useState<Cliente | any>({ document: '', fullname: '' });

  // ── Cart logic ──
  const addToCart = useCallback((item: InventarioCart) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) return prev.map((p) => p.id === item.id ? { ...p, cantidad: (p.cantidad || 0) + 1 } : p);
      return [...prev, { ...item, cantidad: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (!existing) return prev;
      if ((existing.cantidad ?? 0) > 1) return prev.map((p) => p.id === id ? { ...p, cantidad: (p.cantidad || 0) - 1 } : p);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const changeQty = useCallback((id: number, delta: number) => {
    setCart((prev) => prev.map((p) => p.id === id ? { ...p, cantidad: Math.max(1, p.cantidad + delta) } : p));
  }, []);

  const changeDiscount = useCallback((id: number, discount: number) => {
    setCart(prev => prev.map(p => {
      if (p.id !== id) return p;
      const total = p.costo_venta * p.cantidad;
      return { ...p, descuento: Math.min(discount, total - 1) };
    }));
  }, []);

  // ── Calculations ──
  const subtotal = cart.reduce((acc, p) => acc + p.costo_venta * p.cantidad, 0);
  const descuentoTotal = cart.reduce((acc, p) => acc + (p.descuento || 0) * p.cantidad, 0);
  const total = subtotal - descuentoTotal;
  const igv = total * 0.18;

  const handleConfirmar = () => {
    logJSON("Confirmar Venta", { cart, cliente });
    const preparedData = {
      usuarioId: 0,
      metodoPago: payMethod,
      formaPago: "Contado",
      tipoComprobante: comprobanteMethod,
      cliente: {
        nombre_o_razon_social: cliente.fullname,
        nombre_completo: cliente.fullname,
        ruc: cliente.document,
        numero: cliente.document,
      },
      documento_cliente: cliente.document,
      nombre_cliente: cliente.fullname,
      correo_cliente: "",
      direccion_cliente: "",
      telefono_cliente: "",
      documento_cliente_existente: `${cliente?.document || cliente?.numero}-${cliente?.nombre_o_razon_social || cliente?.fullname}`,
      productos: cart.map((p: InventarioCart) => ({
        inventarioId: p.id,
        cantidad_final: p.cantidad,
        producto_nombre: p.producto_nombre,
        nombre_categoria: p.categoria_nombre,
        costo_venta: p.costo_venta,
        productoId: p.producto,
        stock_actual: "sin info",
        producto_sku: p.producto_sku,
        imagen_producto: p.imagen_producto,
        descuento: p.descuento || 0,
        costo_original: p.costo_venta,
      })),
      is_send_sunat: true,
      is_save_user: true,
      estado: true,
    };
    logJSON("Datos preparados para API", preparedData);
    createVenta(preparedData);
  };

  const handleDisabled =
    cart?.length === 0 ||
    cart.some(p => !p.cantidad || p.cantidad <= 0 || p.costo_venta <= 0) ||
    loadingCreateVenta ||
    (comprobanteMethod === "Factura" && (!cliente?.document || cliente.document?.length !== 11));

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={styles.screen}>

        <VentaHeader />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          <ComprobanteCardSelect
            comprobanteMethod={comprobanteMethod}
            onSelect={(e) => {
              setCliente({ document: '', fullname: '' });
              setComprobanteMethod(e);
            }}
          />

          {comprobanteMethod !== "Anonima" && (
            <ClienteCard
              cliente={cliente}
              onBuscar={() => bottomSheetRef2.current?.expand()}
            />
          )}

          <ProductosCard
            cart={cart}
            onAgregar={() => bottomSheetRef.current?.expand()}
            onChangeQty={changeQty}
            onRemove={removeFromCart}
            onChangeDiscount={changeDiscount}
          />

          <PagoCard payMethod={payMethod} onSelect={setPayMethod} />

          <ResumenCard subtotal={subtotal} descuento={descuentoTotal} total={total} igv={igv} />
        </ScrollView>

        <ConfirmarVentaBtn
          loading={loadingCreateVenta}
          total={total}
          onConfirmar={handleConfirmar}
          disabled={handleDisabled}
        />
      </View>

      <ProductosBottomSheet
        bottomSheetRef={bottomSheetRef}
        productos={productos.map(p => ({ ...p, descuento: 0 }))}
        isLoading={isLoading}
        onSelectProducto={addToCart}
      />

      <ClienteBottomSheet
        tipodoc={comprobanteMethod === "Factura" ? "ruc" : "dni"}
        bottomSheetRef={bottomSheetRef2}
        onClienteEncontrado={setCliente}
      />

      <VentaDetalleModal
        venta={temporaryVenta}
        visible={showVentaDetailTemporary}
        onClose={() => useVentaStore.setState({ showVentaDetailTemporary: false, temporaryVenta: {} as Venta })}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  body: { padding: 16, gap: 10, paddingBottom: 8 },
});

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
            <Icon name="alert-circle-outline" size={38} color={C.red} />
          </View>
          <Text style={mStyles.cancelTitle}>¿Anular comprobante?</Text>
          <Text style={mStyles.cancelSubtitle}>
            Esta acción es irreversible. El comprobante quedará anulado ante SUNAT con motivo Anulación de la operación.
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
    console.log(venta?.comprobante?.nombre_cliente, " Venta para detalle modal");
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
      `👋 Hola, somos *Movil Axel*\n\n` +
      `🧾 *Comprobante de pago*\n` +
      `Tipo: ${venta.tipo_comprobante}\n` +
      `Serie: ${venta.comprobante.serie}-${venta.comprobante.correlativo}\n` +
      `Fecha: ${new Date(venta.fecha_hora).toLocaleString()}\n\n` +
      `👤 *Cliente*\n${venta.comprobante.nombre_cliente}\n` +
      `DNI: ${venta.comprobante.numero_documento_cliente}\n\n` +
      `🛍️ *Detalle*\n` +
      venta.productos.map(p =>
        `• ${p.producto_nombre}\n  Cant: ${p.cantidad} x S/ ${p.precio_unitario}\n  Subtotal: S/ ${p.valor_venta}`
      ).join('\n') +
      `\n\n💰 *Resumen*\n` +
      `Subtotal: S/ ${venta.gravado_total}\nIGV: S/ ${venta.igv_total}\nTotal: *S/ ${venta.total}*\n\n` +
      `📄 Descargar comprobante:\n${venta.comprobante.ticket_url}\n\nGracias por tu compra 🙌`
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
            <TouchableOpacity style={mStyles.backBtn} onPress={onClose} activeOpacity={0.8}>
              <Icon name="arrow-left" size={20} color={C.textPrimary} />
            </TouchableOpacity>
            <Text style={mStyles.topBarTitle}>Detalle de venta</Text>
            {!isAnulado ? (
              <TouchableOpacity
                style={mStyles.anularTopBtn}
                onPress={() => setShowCancelConfirm(true)}
                activeOpacity={0.8}
              >
                {loadingNotaCredito
                  ? <ActivityIndicator size="small" color={C.red} />
                  : <>
                    <Icon name="cancel" size={14} color={C.red} />
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
                  <Icon name="cancel" size={14} color={C.red} />
                  <Text style={mStyles.anuladaText}>Comprobante anulado · {formatFecha(venta.fecha_hora)}</Text>
                </View>
              )}

              <Text style={mStyles.comprobanteNum}>{serie} - {correlativo}</Text>

              <View style={mStyles.heroChips}>
                <View style={mStyles.tipoChip}>
                  <Text style={mStyles.tipoChipText}>{tipoLabel}</Text>
                </View>
                <View style={[mStyles.estadoBadge, { backgroundColor: estadoStyle.bg }]}>
                  <View style={[mStyles.estadoDot, { backgroundColor: estadoStyle.dot }]} />
                  <Text style={[mStyles.estadoText, { color: estadoStyle.text }]}>
                    {venta.estado?.charAt(0).toUpperCase() + venta.estado?.slice(1)}
                  </Text>
                </View>
              </View>

              <Text style={[mStyles.totalHero, isAnulado && { color: C.red }]}>
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
                  <View style={[mStyles.docBtnIcon, { backgroundColor: color + '15' }]}>
                    <Icon name={icon as any} size={22} color={url ? color : C.textMuted} />
                  </View>
                  <Text style={[mStyles.docBtnLabel, url && { color: C.textSecondary }]}>{label}</Text>
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
            </View>

            {/* ── WHATSAPP ── */}
            <SectionHeader label="Enviar comprobante" />
            <View style={mStyles.whatsappRow}>
              <View style={mStyles.whatsappInput}>
                <Icon name="whatsapp" size={18} color={C.green} />
                <TextInput
                  placeholder="+51 Número WhatsApp"
                  placeholderTextColor={C.textMuted}
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
            <View style={[mStyles.totalRow, isAnulado && { borderColor: C.red + '30', backgroundColor: C.red + '08' }]}>
              <Text style={[mStyles.totalLabel, isAnulado && { color: C.red }]}>Total</Text>
              <Text style={[mStyles.totalValue, isAnulado && { color: C.red }]}>S/ {venta.total}</Text>
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
                      <Icon name="package-variant-closed" size={22} color={C.textMuted} />
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
              {/* Imprimir ticket */}
              <TouchableOpacity
                style={[mStyles.ticketBtn, !cp?.ticket_url && { opacity: 0.4 }]}
                onPress={() => cp?.ticket_url && Linking.openURL(cp.ticket_url)}
                activeOpacity={cp?.ticket_url ? 0.8 : 1}
              >
                <View style={mStyles.ticketIconWrap}>
                  <Icon name="printer-outline" size={20} color={cp?.ticket_url ? C.textPrimary : C.textMuted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[mStyles.ticketBtnText, !cp?.ticket_url && { color: C.textMuted }]}>Imprimir ticket</Text>
                  <Text style={mStyles.ticketBtnSub}>{cp?.ticket_url ? 'Abre en el navegador' : 'No disponible'}</Text>
                </View>
                <Icon name="open-in-new" size={15} color={C.textMuted} />
              </TouchableOpacity>

              {/* Anular venta */}
              {!isAnulado && (
                <TouchableOpacity
                  style={mStyles.anularFooterBtn}
                  onPress={() => setShowCancelConfirm(true)}
                  activeOpacity={0.8}
                >
                  {loadingNotaCredito
                    ? <ActivityIndicator size="small" color={C.red} />
                    : <>
                      <Icon name="cancel" size={18} color={C.red} />
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

// ─── Modal Styles ─────────────────────────────────────────────────────────────
const mStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  // top bar
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: C.border,
    backgroundColor: C.bg,
    gap: 12,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: C.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  topBarTitle: {
    flex: 1, fontSize: 16, fontWeight: '700',
    color: C.textPrimary, letterSpacing: -0.3,
  },
  anularTopBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.red + '12',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: C.red + '25',
    minWidth: 70, justifyContent: 'center',
  },
  anularTopBtnText: { fontSize: 13, fontWeight: '700', color: C.red },
  anularTopBtnGhost: { minWidth: 70 },

  // hero
  heroArea: { paddingTop: 24, paddingBottom: 4 },
  anuladaBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.red + '12', borderWidth: 1, borderColor: C.red + '25',
    borderRadius: 10, padding: 10, marginBottom: 16,
  },
  anuladaText: { fontSize: 12, color: C.red, fontWeight: '600', flex: 1 },
  comprobanteNum: {
    fontSize: 34, fontWeight: '800', color: C.textPrimary,
    letterSpacing: -1, marginBottom: 10,
  },
  heroChips: { flexDirection: 'row', gap: 8, marginBottom: 14 },
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
  totalHero: {
    fontSize: 44, fontWeight: '800', color: C.accent,
    letterSpacing: -1.5, marginBottom: 8,
  },

  // section header
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginTop: 24, marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 10, color: C.textMuted,
    textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700',
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: C.border },

  // docs
  docBtnsRow: { flexDirection: 'row', gap: 8 },
  docBtn: {
    flex: 1, alignItems: 'center', gap: 8, paddingVertical: 14,
    backgroundColor: C.surface, borderRadius: 14,
    borderWidth: 1, borderColor: C.border,
  },
  docBtnIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  docBtnLabel: { fontSize: 11, fontWeight: '700', color: C.textMuted },

  // cliente
  clienteCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.surface, borderRadius: 14,
    padding: 14,
    borderWidth: 1, borderColor: C.border,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontWeight: '800', fontSize: 18 },
  clienteNombre: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
  clienteDoc: { fontSize: 12, color: C.textSecondary, marginTop: 2 },

  // whatsapp
  whatsappRow: { flexDirection: 'row', gap: 10 },
  whatsappInput: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.surface, borderRadius: 14,
    paddingHorizontal: 14, borderWidth: 1, borderColor: C.border,
  },
  whatsappTextInput: { flex: 1, color: C.textPrimary, fontSize: 14, paddingVertical: 14 },
  whatsappBtn: {
    backgroundColor: '#15803d', borderRadius: 14,
    paddingHorizontal: 20, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center',
  },

  // stats
  statsCard: {
    backgroundColor: C.surface, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 4,
    borderWidth: 1, borderColor: C.border,
    marginBottom: 8,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  statDivider: { height: 1, backgroundColor: C.border },
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
  productoCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surface, borderRadius: 14,
    padding: 12, borderWidth: 1, borderColor: C.border,
  },
  productoImg: { width: 54, height: 54, borderRadius: 10 },
  productoImgPlaceholder: {
    backgroundColor: C.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  productoNombre: { fontSize: 14, fontWeight: '600', color: C.textPrimary, marginBottom: 8 },
  productoFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cantidadBadge: {
    backgroundColor: C.surfaceAlt, borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: C.border,
  },
  cantidadText: { fontSize: 11, fontWeight: '700', color: C.textSecondary },
  productoTotal: { fontSize: 15, fontWeight: '800', color: C.textPrimary },

  // footer actions
  footerActions: { gap: 10, marginTop: 8 },
  ticketBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.surface, borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 16,
    borderWidth: 1, borderColor: C.border,
  },
  ticketIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: C.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  ticketBtnText: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
  ticketBtnSub: { fontSize: 11, color: C.textMuted, marginTop: 2 },
  anularFooterBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: 16, paddingVertical: 15,
    backgroundColor: C.red + '10',
    borderWidth: 1, borderColor: C.red + '30',
  },
  anularFooterText: { fontSize: 15, fontWeight: '700', color: C.red },

  // cancel confirm modal
  cancelOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  cancelSheet: {
    backgroundColor: C.surface, borderRadius: 24,
    padding: 28, alignItems: 'center', width: '100%',
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
    width: '100%', justifyContent: 'center', marginBottom: 10,
    minHeight: 50,
  },
  cancelConfirmText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  cancelDismissBtn: {
    paddingVertical: 14, paddingHorizontal: 24,
    borderRadius: 14, width: '100%', alignItems: 'center',
    backgroundColor: C.surfaceAlt, borderWidth: 1, borderColor: C.border,
  },
  cancelDismissText: { fontSize: 15, fontWeight: '600', color: C.textSecondary },
});