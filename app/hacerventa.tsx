import { useInventario } from '@/State/hooks/useInventarios';
import { InventarioCart } from '@/State/models/inventario.models';
import { Venta } from "@/State/models/venta.models";
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

import { ComprobanteCardSelect, ComprobanteMethod } from '@/components/venta/ComprobanteCardSelect';
import VentaDetalleModal from '@/components/venta/VentaDetailModal';
import { useAppTheme } from '@/State/context/ThemeContext';
import { Cliente } from '@/State/models/cliente.models';
import { useVentaStore } from '@/State/store/useVentaStore';

import { logJSON } from '@/utils/logjson';
import { ClienteCard } from '../components/venta/ClienteCard';
import { ConfirmarVentaBtn } from '../components/venta/ConfirmarVentaBtn';
import { PagoCard, PayMethod } from '../components/venta/PagoCard';

import { ClientesModal } from '@/components/venta/ClientesModal';
import { ProductosModal } from '@/components/venta/ProductosModal';
import { ProductosCard } from '../components/venta/ProductosCard';
import { ResumenCard } from '../components/venta/ResumenCard';
import BarcodeScannerModal from '@/components/venta/BarcodeScannerModal';
import { ComprobantePreview } from '@/components/venta/ComprobantePreview';

function HacerVentaScreen() {
  const { T } = useAppTheme();
  const { productos } = useInventario();
  const { createVenta, temporaryVenta, showVentaDetailTemporary, loadingCreateVenta } = useVentaStore();
  const [visibleProductosModal, setVisibleProductosModal] = useState(false);
  const [visibleClientesModal, setVisibleClientesModal] = useState(false);
  const [visibleBarcodeScanner, setVisibleBarcodeScanner] = useState(false);

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

  // ── Barcode scan handler ──
  const handleBarcodeScan = useCallback((sku: string) => {
    const producto = productos?.find((p) => p.producto_sku?.toLowerCase() === sku.toLowerCase());
    if (producto) {
      addToCart(producto);
    }
  }, [productos, addToCart]);

  // ── Handle scanned SKU from barcode scanner modal ──
  const handleScanFromModal = useCallback((sku: string) => {
    handleBarcodeScan(sku);
  }, [handleBarcodeScan]);

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

  const handleCloseVentaDetail = useCallback(() => {
    useVentaStore.setState({
      showVentaDetailTemporary: false,
      temporaryVenta: {} as Venta
    });
    setCart([]);
    setPayMethod('Efectivo');
    setComprobanteMethod('Boleta');
    setCliente({ document: '', fullname: '' });
  }, []);

  return (
    <View style={makeStyles(T).screen}>

      {/* ── Contenido scrolleable ── */}
      <ScrollView
        style={makeStyles(T).scroll}
        contentContainerStyle={makeStyles(T).scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
            onBuscar={() => setVisibleClientesModal(true)}
          />
        )}

        <ProductosCard
          cart={cart}
          onAgregar={() => setVisibleProductosModal(true)}
          onEscanear={() => setVisibleBarcodeScanner(true)}
          onChangeQty={changeQty}
          onRemove={removeFromCart}
          onChangeDiscount={changeDiscount}
        />

        {cart.length > 0 && (
          <>
            <PagoCard payMethod={payMethod} onSelect={setPayMethod} />

            <ResumenCard subtotal={subtotal} descuento={descuentoTotal} total={total} igv={igv} />

            <ComprobantePreview
              cart={cart}
              subtotal={subtotal}
              descuento={descuentoTotal}
              total={total}
              igv={igv}
              metodoPago={payMethod}
              cliente={cliente}
            />
          </>
        )}

        {/* ── Botón fijo abajo ── */}
        <View style={makeStyles(T).footer}>
          <ConfirmarVentaBtn
            loading={loadingCreateVenta}
            total={total}
            onConfirmar={handleConfirmar}
            disabled={handleDisabled}
          />
        </View>
      </ScrollView>




      <ClientesModal tipodoc={comprobanteMethod === "Factura" ? "ruc" : "dni"}
        visible={visibleClientesModal}
        onClienteEncontrado={setCliente}
        onClose={() => setVisibleClientesModal(false)}
      />

      <ProductosModal visible={visibleProductosModal} onClose={() => setVisibleProductosModal(false)}

        onSelectProducto={addToCart}
      />

      <VentaDetalleModal
        venta={temporaryVenta}
        visible={showVentaDetailTemporary}
        onClose={handleCloseVentaDetail}
      />

      <BarcodeScannerModal
        visible={visibleBarcodeScanner}
        onClose={() => setVisibleBarcodeScanner(false)}
        onScan={handleScanFromModal}
        productos={productos || []}
      />
    </View>
  );
}

export default HacerVentaScreen;

const makeStyles = (T: any) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: T.bg,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 55,
    gap: 12,
    paddingBottom: 16,
  },

  footer: {
    paddingBottom: 70,
    backgroundColor: T.bg,
  },
});