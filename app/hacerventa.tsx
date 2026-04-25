import { useInventario } from '@/State/hooks/useInventarios';
import { InventarioCart } from '@/State/models/inventario.models';
import { Venta } from "@/State/models/venta.models";
import { useCallback, useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ComprobanteCardSelect, ComprobanteMethod } from '@/components/venta/ComprobanteCardSelect';
import VentaDetalleModal from '@/components/venta/VentaDetailModal';
import T from '@/constants/THEME';
import { Cliente } from '@/State/models/cliente.models';
import { useVentaStore } from '@/State/store/useVentaStore';

import { ClienteBottomSheet } from '../components/venta/ClienteBottomSheet';
import { ClienteCard } from '../components/venta/ClienteCard';
import { ConfirmarVentaBtn } from '../components/venta/ConfirmarVentaBtn';
import { PagoCard, PayMethod } from '../components/venta/PagoCard';
import { ProductosBottomSheet } from '../components/venta/ProductosBottomSheet';
import { ProductosCard } from '../components/venta/ProductosCard';
import { ResumenCard } from '../components/venta/ResumenCard';
import { VentaHeader } from '../components/venta/VentaHeader';

export default function HacerVentaScreen() {
  const { productos, isLoading } = useInventario();
  const { createVenta, temporaryVenta, showVentaDetailTemporary, loadingCreateVenta } = useVentaStore();

  const bottomSheetRef = useRef<any>(null);
  const bottomSheetRef2 = useRef<any>(null);

  const [cart, setCart] = useState<InventarioCart[]>([]);
  const [payMethod, setPayMethod] = useState<PayMethod>('Efectivo');
  const [comprobanteMethod, setComprobanteMethod] = useState<ComprobanteMethod>('Boleta');
  const [cliente, setCliente] = useState<Cliente | any>({ document: '', fullname: '' });

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

  const subtotal = cart.reduce((acc, p) => acc + p.costo_venta * p.cantidad, 0);
  const descuentoTotal = cart.reduce((acc, p) => acc + (p.descuento || 0) * p.cantidad, 0);
  const total = subtotal - descuentoTotal;
  const igv = total * 0.18;

  const handleConfirmar = () => {
    const preparedData = { /* tu lógica intacta */ };
    createVenta(preparedData);
  };

  const handleDisabled =
    cart?.length === 0 ||
    cart.some(p => !p.cantidad || p.cantidad <= 0 || p.costo_venta <= 0) ||
    loadingCreateVenta ||
    (comprobanteMethod === "Factura" && (!cliente?.document || cliente.document?.length !== 11));

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={T.bg} />

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
  screen: {
    flex: 1,
    position: 'relative',
    backgroundColor: T.bg,
  },

  body: {
    padding: 16,
    gap: 12,
    paddingBottom: 8,
  },


});