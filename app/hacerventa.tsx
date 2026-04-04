import { useInventario } from '@/State/hooks/useInventarios';
import { Inventario } from '@/State/models/inventario.models';
import { URLS } from '@/State/utils/endpoints';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, IconButton, MD3Colors, Text, TextInput } from 'react-native-paper';


type PayMethod = 'efectivo' | 'tarjeta' | 'yape';
const getImagenProducto = (producto: Inventario) => producto.imagen_producto ? URLS.BASE + producto.imagen_producto : URLS.IMAGE_URL_PLACEHOLDER;
const PAY_OPTIONS: { key: PayMethod; label: string }[] = [
  { key: 'efectivo', label: 'Efectivo' },
  { key: 'tarjeta', label: 'Tarjeta' },
  { key: 'yape', label: 'Yape' },
];

export default function HacerVentaScreen() {
  const { productos, isLoading } = useInventario();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRef2 = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['100%'], []);

  const [cart, setCart] = useState<Inventario[]>([]);
  const [payMethod, setPayMethod] = useState<PayMethod>('efectivo');
  const [cliente, setCliente] = useState<{ nombre: string; doc: string } | null>(null);
  const [dniInput, setDniInput] = useState('');

  const handleChange = useCallback(() => { }, []);

  const addToCart = (item: { id: number; producto_nombre: string; costo_venta: number }) => {
    setCart((prev: Inventario[]) => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) return prev.map(p => p.id === item.id ? { ...p, cantidad: (p.cantidad || 0) + 1 } : p);
      const newItem = { ...productos.find(prod => prod.id === item.id)!, cantidad: 1 } as Inventario;
      return [...prev, newItem];
    });
  };
  const removeFromCart = (id: number) => {
    setCart((prev: Inventario[]) => {
      const existing = prev.find(p => p.id === id);

      if (!existing) return prev;

      // 👉 si hay más de 1, solo resta
      if ((existing.cantidad ?? 0) > 1) {
        return prev.map(p =>
          p.id === id
            ? { ...p, cantidad: (p.cantidad || 0) - 1 }
            : p
        );
      }

      // 👉 si es 1, eliminar del carrito
      return prev.filter(p => p.id !== id);
    });
  };
  const changeQty = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(p => p.id === id ? { ...p, cantidad: p.cantidad + delta } : p).filter(p => p.costo_venta > 0)
    );
  };

  const subtotal = cart.reduce((acc, p) => acc + p.costo_venta * p.cantidad, 0);
  const descuento = subtotal * 0.1;
  const total = subtotal - descuento;

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>


      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.hTitle}>Nueva{' '}venta</Text>
              <Text style={styles.hSub}>#V-00421 · 3 abr 2026</Text>
            </View>

          </View>
        </View>

        <View style={styles.divider} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {/* Productos */}
          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.secLabel}>PRODUCTOS</Text>
              <TouchableOpacity
                style={styles.secAction}
                onPress={() => bottomSheetRef.current?.expand()}
              >
                <Icon name="plus" size={11} color="#fff" />
                <Text style={styles.secActionText}>Agregar</Text>
              </TouchableOpacity>
            </View>

            {cart.length === 0 ? (
              <View style={styles.ghostRow}>
                <View style={styles.ghostIcon}>
                  <Icon name="plus" size={13} color="#ccc" />
                </View>
                <Text style={styles.ghostText}>Toca Agregar para añadir productos</Text>
              </View>
            ) : (
              <>
                {cart.map((item: Inventario) => (
                  <View key={item.id} style={styles.prodRow}>
                    <View >
                      <Image
                        source={{ uri: getImagenProducto(item) }}
                        style={styles.sheetProducts_cardImage}
                        contentFit="cover"
                      />

                    </View>

                    <View>


                      <View style={{ flex: 1 }}>
                        <Text style={[styles.prodName, { width: "50%" }]} numberOfLines={3}>{item.producto_nombre}</Text>
                        <Text style={styles.prodMeta}>S/.{item.costo_venta} c/u</Text>
                      </View>

                      <View style={styles.qtyCtrl}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.id, -1)}>
                          <Text style={styles.qtyBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyNum}>{item.cantidad}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.id, 1)}>
                          <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{ position: "absolute", right: 10, bottom: 10 }}>
                      <Text style={styles.prodPrice}>S/.{(item.costo_venta * item.cantidad)}</Text>
                    </View>
                    <View style={{ position: "absolute", right: 2, top: 2 }}>



                      <IconButton

                        icon="close"
                        size={20}
                        mode='contained-tonal'
                        onPress={() => removeFromCart(item.id)}
                        iconColor={MD3Colors.error50}

                      />


                    </View>
                  </View>
                ))}

              </>
            )}
          </View>

          {/* Cliente */}
          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.secLabel}>CLIENTE</Text>
              <TouchableOpacity
                style={styles.secAction}
                onPress={() => bottomSheetRef2.current?.expand()}
              >
                <Icon name="magnify" size={11} color="#fff" />
                <Text style={styles.secActionText}>Buscar</Text>
              </TouchableOpacity>
            </View>
            {cliente ? (
              <View style={styles.clientRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials(cliente.nombre)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.clientName}>{cliente.nombre}</Text>
                  <Text style={styles.prodMeta}>DNI · {cliente.doc}</Text>
                </View>
                <Icon name="chevron-right" size={18} color="#ccc" />
              </View>
            ) : (
              <View style={styles.clientRow}>
                <View style={[styles.avatar, { backgroundColor: '#f0f0f0' }]}>
                  <Icon name="account-outline" size={16} color="#ccc" />
                </View>
                <Text style={styles.ghostText}>Ningún cliente seleccionado</Text>
              </View>
            )}
          </View>

          {/* Pago */}
          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.secLabel}>PAGO</Text>
            </View>
            <View style={styles.payRow}>
              {PAY_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.payOpt, payMethod === opt.key && styles.payActive]}
                  onPress={() => setPayMethod(opt.key)}
                >
                  <Text style={[styles.payLabel, payMethod === opt.key && styles.payLabelActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Resumen */}
          <View style={styles.card}>
            <View style={styles.summaryBlk}>
              <View style={styles.sRow}>
                <Text style={styles.sLbl}>Subtotal</Text>
                <Text style={styles.sVal}>S/.{subtotal}</Text>
              </View>
              <View style={styles.sRow}>
                <Text style={styles.sLbl}>Descuento</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={styles.discPill}><Text style={styles.discText}>−10%</Text></View>
                  <Text style={styles.discVal}>−S/.{descuento ? descuento.toFixed(2) : descuento}</Text>
                </View>
              </View>
              <View style={styles.sDivider} />
              <View style={styles.sRow}>
                <Text style={styles.tLbl}>Total</Text>
                <Text style={styles.tVal}>S/.{total}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* CTA */}
        <View style={styles.ctaWrap}>
          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>
            <View style={styles.ctaLeft}>
              <View style={styles.ctaIcon}>
                <Icon name="check" size={14} color="#000" />
              </View>
              <Text style={styles.ctaText}>Confirmar venta</Text>
            </View>
            <Text style={styles.ctaPrice}>S/.{total}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={handleChange}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetProducts_content}>

          <Text style={styles.sheetProducts_title}>
            Seleccionar producto
          </Text>

          <FlatList
            data={productos}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => {
              const cantidad = item.cantidad;

              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.sheetProducts_card}
                  onPress={() => {
                    bottomSheetRef.current?.close();

                    addToCart(item)
                  }
                  }
                >
                  {/* Imagen */}
                  <Image
                    source={{ uri: getImagenProducto(item) }}
                    style={styles.sheetProducts_cardImage}
                    contentFit="cover"
                  />

                  {/* Body */}
                  <View style={styles.sheetProducts_cardBody}>

                    <View>
                      <Text
                        style={styles.sheetProducts_cardName}
                        numberOfLines={3}
                      >
                        {item.producto_nombre}
                      </Text>

                      <Text style={styles.sheetProducts_cardMeta}>
                        {[
                          `Stock: ${cantidad ?? 0}`,
                          `S/.${item.costo_venta ?? '—'}`
                        ].join(' · ')}
                      </Text>
                    </View>

                    {/* Footer */}
                    <View style={styles.sheetProducts_cardBottom}>

                      <Text style={styles.sheetProducts_cardPrice}>
                        S/.{item.costo_venta ?? '—'}
                      </Text>



                    </View>

                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.sheetProducts_emptyText}>
                {isLoading ? 'Cargando...' : 'Sin productos'}
              </Text>
            }
          />
        </BottomSheetScrollView>
      </BottomSheet>
      {/* Bottom Sheet — Clientes */}
      <BottomSheet ref={bottomSheetRef2} index={-1} snapPoints={snapPoints} enablePanDownToClose onChange={handleChange}>
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Buscar cliente</Text>
          <TextInput
            label="DNI o RUC"
            value={dniInput}
            onChangeText={setDniInput}
            mode="outlined"
            keyboardType="numeric"
            style={{ marginBottom: 14 }}
            outlineColor="#e0e0e0"
            activeOutlineColor="#000"
          />
          <Button
            mode="contained"
            buttonColor="#000"
            textColor="#fff"
            onPress={() => {
              if (dniInput.length > 0) {
                setCliente({ nombre: 'Cliente Encontrado', doc: dniInput });
                bottomSheetRef2.current?.close();
              }
            }}
          >
            Buscar
          </Button>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  hTitle: { fontSize: 34, fontWeight: '800', color: '#000', letterSpacing: -1, lineHeight: 36 },
  hSub: { fontSize: 14, color: 'black', marginTop: 6 },
  badge: { backgroundColor: '#000', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginTop: 4 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  divider: { height: 1, },
  body: { padding: 16, gap: 6, paddingBottom: 8 },
  card: { borderRadius: 20, backgroundColor: '#f7f7f7', overflow: 'hidden' },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingHorizontal: 18 },
  secLabel: { fontSize: 14, fontWeight: '800', color: '#000', letterSpacing: 1 },
  secAction: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#000', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 9 },
  secActionText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  prodRow: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 18, paddingBottom: 14, gap: 14, position: "relative" },
  prodNum: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  prodNumText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  prodName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    flexShrink: 1,

  },
  prodMeta: { fontSize: 14, color: 'black', marginTop: 2 },
  qtyCtrl: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  qtyBtn: { width: 40, height: 40, backgroundColor: "white", borderWidth: 1, borderColor: "#f0f0f0", borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 18, fontWeight: '300', color: '#000', lineHeight: 22 },
  qtyNum: { fontSize: 16, fontWeight: '700', width: 26, textAlign: 'center', color: '#000' },
  prodPrice: { fontSize: 20, fontWeight: '900', color: '#000', minWidth: 56, textAlign: 'right' },
  ghostRow: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 18, paddingBottom: 14, gap: 12 },
  ghostIcon: { width: 36, height: 36, borderRadius: 10, borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  ghostText: { fontSize: 15, color: 'gray' },
  clientRow: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 18, paddingBottom: 16, gap: 14 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  clientName: { fontSize: 16, fontWeight: '700', color: '#000' },
  payRow: { flexDirection: 'row', gap: 8, padding: 10, paddingHorizontal: 16, paddingBottom: 16 },
  payOpt: { flex: 1, paddingVertical: 12, borderRadius: 50, alignItems: 'center', backgroundColor: '#fff' },
  payActive: { backgroundColor: '#000' },
  payLabel: { fontSize: 15, fontWeight: '700', color: 'black' },
  payLabelActive: { color: '#fff' },
  summaryBlk: { padding: 18 },
  sRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  sLbl: { fontSize: 15, color: 'gray' },
  sVal: { fontSize: 15, fontWeight: '600', color: '#000' },
  sDivider: { height: 1, backgroundColor: '#ebebeb', marginVertical: 10 },
  tLbl: { fontSize: 17, fontWeight: '800', color: '#000' },
  tVal: { fontSize: 26, fontWeight: '800', color: '#000', letterSpacing: -0.8 },
  discPill: { backgroundColor: '#000', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3 },
  discText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  discVal: { fontSize: 15, fontWeight: '700', color: '#000' },
  ctaWrap: { padding: 16, paddingBottom: 36 },
  ctaBtn: { backgroundColor: '#000', borderRadius: 18, paddingVertical: 18, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctaLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ctaIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: 21, fontWeight: '800', color: '#fff' },
  ctaPrice: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  sheetContent: { padding: 22, paddingBottom: 40, flexGrow: 1 },
  sheetTitle: { fontSize: 22, fontWeight: '800', color: '#000', letterSpacing: -0.5, marginBottom: 18 },


  sheetProducts_content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  sheetProducts_title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
    color: '#000',
  },

  sheetProducts_card: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    borderRadius: 18,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    elevation: 2,
  },

  sheetProducts_cardImage: {
    width: 90,
    height: 90,
  },

  sheetProducts_cardBody: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },

  sheetProducts_cardName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },

  sheetProducts_cardMeta: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },

  sheetProducts_cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sheetProducts_cardPrice: {
    fontSize: 21,
    fontWeight: '800',
    color: '#000',
  },

  sheetProducts_addBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  sheetProducts_addBtnText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },

  sheetProducts_emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#999',
  },
}); 