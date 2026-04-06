import { useInventario } from '@/State/hooks/useInventarios';
import { Inventario } from '@/State/models/inventario.models';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Cliente } from '@/State/models/cliente.models';
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

  const bottomSheetRef = useRef<any>(null);
  const bottomSheetRef2 = useRef<any>(null);

  const [cart, setCart] = useState<Inventario[]>([]); const [payMethod, setPayMethod] = useState<PayMethod>('efectivo');
  const [cliente, setCliente] = useState<Cliente | any>(null);

  // --- Lógica del carrito ---
  const addToCart = useCallback((item: Inventario) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, cantidad: (p.cantidad || 0) + 1 } : p
        );
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (!existing) return prev;
      if ((existing.cantidad ?? 0) > 1) {
        return prev.map((p) =>
          p.id === id ? { ...p, cantidad: (p.cantidad || 0) - 1 } : p
        );
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const changeQty = useCallback((id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, cantidad: p.cantidad + delta } : p))
        .filter((p) => p.cantidad > 0)
    );
  }, []);

  // --- Cálculos ---
  const subtotal = cart.reduce((acc, p) => acc + p.costo_venta * p.cantidad, 0);
  const descuento = subtotal * 0.1;
  const total = subtotal - descuento;

  // --- Handlers ---
  const handleConfirmar = () => {
    // TODO: conectar con Context / API
    console.log({ cart, cliente, payMethod, total });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.screen}>

        <VentaHeader />

        <View style={styles.divider} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          <ProductosCard
            cart={cart}
            onAgregar={() => bottomSheetRef.current?.expand()}
            onChangeQty={changeQty}
            onRemove={removeFromCart}
          />

          <ClienteCard
            cliente={cliente}
            onBuscar={() => bottomSheetRef2.current?.expand()}
          />

          <PagoCard payMethod={payMethod} onSelect={setPayMethod} />

          <ResumenCard subtotal={subtotal} descuento={descuento} total={total} />
        </ScrollView>

        <ConfirmarVentaBtn total={total} onConfirmar={handleConfirmar} />
      </View>

      <ProductosBottomSheet
        bottomSheetRef={bottomSheetRef}
        productos={productos}
        isLoading={isLoading}
        onSelectProducto={addToCart}
      />

      <ClienteBottomSheet
        bottomSheetRef={bottomSheetRef2}
        onClienteEncontrado={setCliente}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  divider: { height: 1 },
  body: { padding: 16, gap: 6, paddingBottom: 8 },
});