import { InventarioCart } from '@/State/models/inventario.models';
import { URLS } from '@/State/utils/endpoints';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { Text } from 'react-native-paper';


// ═══════════════════════════════════════════════════════════════════════════════
// ProductosCard.tsx
// ═══════════════════════════════════════════════════════════════════════════════
import { C } from '@/State/utils/c';

interface ProductosCardProps {
  cart: InventarioCart[];
  onAgregar: () => void;
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onChangeDiscount: (id: number, discount: number) => void;
}

const getImagenProducto = (producto: InventarioCart) =>
  producto.imagen_producto ? URLS.BASE + producto.imagen_producto : URLS.IMAGE_URL_PLACEHOLDER;

function ProductRow({
  item, onChangeQty, onRemove, onChangeDiscount, onImagePress,
}: {
  item: InventarioCart;
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onChangeDiscount: (id: number, discount: number) => void;
  onImagePress: (uri: string) => void;
}) {
  const [discountText, setDiscountText] = useState(item.descuento ? String(item.descuento) : '0');
  const subtotal = item.costo_venta * item.cantidad;
  const descuento = parseFloat(discountText) || 0;
  const total = Math.max(0, subtotal - descuento);

  const handleDiscountDelta = (delta: number) => {
    const current = parseFloat(discountText) || 0;
    const maxDiscount = Math.max(0, subtotal - 1);
    const next = Math.max(0, Math.min(maxDiscount, current + delta));
    setDiscountText(next === 0 ? '0' : String(next));
    onChangeDiscount(item.id, next);
  };

  return (
    <View style={pStyles.container}>
      {/* Top: imagen + info + close */}
      <View style={pStyles.topRow}>
        <TouchableOpacity onPress={() => onImagePress(getImagenProducto(item))}>
          <Image source={{ uri: getImagenProducto(item) }} style={pStyles.image} contentFit="cover" />
        </TouchableOpacity>
        <View style={pStyles.info}>
          <Text style={pStyles.nombre} numberOfLines={2}>{item.producto_nombre}</Text>
          {item.producto_sku && (
            <View style={pStyles.codigoWrap}>
              <Icon name="barcode" size={12} color={C.textMuted} />
              <Text style={pStyles.codigo}>{item.producto_sku}</Text>
            </View>
          )}
          <Text style={pStyles.precio}>S/ {item.costo_venta}</Text>
        </View>
        <TouchableOpacity style={pStyles.closeBtn} onPress={() => onRemove(item.id)}>
          <Icon name="close" size={15} color={C.red} />
        </TouchableOpacity>
      </View>

      {/* Qty + Discount */}
      <View style={pStyles.controlsRow}>
        <View style={pStyles.controlBlock}>
          <Text style={pStyles.fieldLabel}>Cantidad</Text>
          <View style={pStyles.stepper}>
            <TouchableOpacity style={pStyles.stepBtn} onPress={() => onChangeQty(item.id, -1)}>
              <Icon name="minus" size={14} color={C.textSecondary} />
            </TouchableOpacity>
            <Text style={pStyles.stepNum}>{item.cantidad}</Text>
            <TouchableOpacity style={pStyles.stepBtn} onPress={() => onChangeQty(item.id, 1)}>
              <Icon name="plus" size={14} color={C.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={pStyles.controlBlock}>
          <Text style={pStyles.fieldLabel}>Descuento</Text>
          <View style={pStyles.stepper}>
            <TouchableOpacity style={pStyles.stepBtn} onPress={() => handleDiscountDelta(-1)}>
              <Icon name="minus" size={14} color={C.textSecondary} />
            </TouchableOpacity>
            <Text style={pStyles.stepNum}>S/ {descuento.toFixed(0)}</Text>
            <TouchableOpacity style={pStyles.stepBtn} onPress={() => handleDiscountDelta(1)}>
              <Icon name="plus" size={14} color={C.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Total */}
      <View style={pStyles.totalRow}>
        <Text style={pStyles.totalLabel}>Total</Text>
        <Text style={pStyles.totalValue}>S/ {total.toFixed(2)}</Text>
      </View>
    </View>
  );
}

export function ProductosCard({ cart, onAgregar, onChangeQty, onRemove, onChangeDiscount }: ProductosCardProps) {
  const [imageVisible, setImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  return (
    <>
      <View style={prodStyles.card}>
        <View style={prodStyles.cardHead}>
          <Text style={prodStyles.secLabel}>PRODUCTOS</Text>
          <TouchableOpacity style={prodStyles.secAction} onPress={onAgregar}>
            <Icon name="plus" size={12} color={C.bg} />
            <Text style={prodStyles.secActionText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {cart.length === 0 ? (
          <TouchableOpacity style={prodStyles.ghostRow} onPress={onAgregar} activeOpacity={0.7}>
            <View style={prodStyles.ghostIcon}>
              <Icon name="plus" size={16} color={C.textMuted} />
            </View>
            <Text style={prodStyles.ghostText}>Toca Agregar para añadir productos</Text>
          </TouchableOpacity>
        ) : (
          <View style={prodStyles.list}>
            {cart.map((item, idx) => (
              <View key={item.id}>
                <ProductRow
                  item={item}
                  onChangeQty={onChangeQty}
                  onRemove={onRemove}
                  onChangeDiscount={onChangeDiscount}
                  onImagePress={(uri) => { setSelectedImage(uri); setImageVisible(true); }}
                />
                {idx < cart.length - 1 && <View style={prodStyles.separator} />}
              </View>
            ))}
          </View>
        )}
      </View>

      <ImageViewing
        images={[{ uri: selectedImage }]}
        imageIndex={0}
        visible={imageVisible}
        onRequestClose={() => setImageVisible(false)}
      />
    </>
  );
}

const prodStyles = StyleSheet.create({
  card: {
    borderRadius: 16, backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border, overflow: 'hidden',
  },
  cardHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  secLabel: { fontSize: 10, fontWeight: '800', color: C.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' },
  secAction: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.accent, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  secActionText: { fontSize: 13, fontWeight: '700', color: C.bg },
  ghostRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  ghostIcon: {
    width: 38, height: 38, borderRadius: 10,
    borderWidth: 1.5, borderColor: C.border, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.surfaceAlt,
  },
  ghostText: { fontSize: 14, color: C.textMuted },
  list: { paddingVertical: 4 },
  separator: { height: 1, backgroundColor: C.border, marginHorizontal: 16 },
});

const pStyles = StyleSheet.create({
  container: { padding: 14, gap: 12 },
  topRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  image: { width: 68, height: 68, borderRadius: 12, backgroundColor: C.surfaceAlt },
  info: { flex: 1, gap: 3 },
  nombre: { fontSize: 14, fontWeight: '700', color: C.textPrimary, lineHeight: 19 },
  codigoWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  codigo: { fontSize: 11, color: C.textMuted },
  precio: { fontSize: 13, fontWeight: '700', color: C.accent },
  closeBtn: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: C.red + '12',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.red + '25',
  },
  controlsRow: { flexDirection: 'row', gap: 10 },
  controlBlock: { flex: 1, gap: 6 },
  fieldLabel: { fontSize: 10, fontWeight: '700', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  stepper: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: C.surfaceAlt, borderRadius: 12,
    borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 10, paddingVertical: 10,
  },
  stepBtn: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNum: { fontSize: 14, fontWeight: '700', color: C.textPrimary },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 2 },
  totalLabel: { fontSize: 12, color: C.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  totalValue: { fontSize: 22, fontWeight: '900', color: C.accent, letterSpacing: -0.5 },
});
