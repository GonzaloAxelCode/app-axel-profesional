
import T from '@/constants/THEME';
import { InventarioCart } from '@/State/models/inventario.models';
import { URLS } from '@/State/utils/endpoints';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { Text } from 'react-native-paper';

interface ProductosCardProps {
  cart: InventarioCart[];
  onAgregar: () => void;
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onChangeDiscount: (id: number, discount: number) => void;
}

const getImagenProducto = (p: InventarioCart) =>
  p.imagen_producto
    ? URLS.BASE + p.imagen_producto
    : URLS.IMAGE_URL_PLACEHOLDER;

// ─────────────────────────────────────────────
// ROW
// ─────────────────────────────────────────────
function ProductRow({
  item,
  onChangeQty,
  onRemove,
  onChangeDiscount,
  onImagePress,
}: any) {
  const [discountText, setDiscountText] = useState(
    item.descuento ? String(item.descuento) : '0'
  );

  const subtotal = item.costo_venta * item.cantidad;
  const descuento = parseFloat(discountText) || 0;
  const total = Math.max(0, subtotal - descuento);

  const handleDiscountDelta = (delta: number) => {
    const current = parseFloat(discountText) || 0;
    const max = Math.max(0, subtotal - 1);
    const next = Math.max(0, Math.min(max, current + delta));

    setDiscountText(next === 0 ? '0' : String(next));
    onChangeDiscount(item.id, next);
  };

  return (
    <View style={styles.row}>
      {/* IMAGE */}
      <TouchableOpacity onPress={() => onImagePress(getImagenProducto(item))}>
        <Image source={{ uri: getImagenProducto(item) }} style={styles.image} />
      </TouchableOpacity>

      {/* INFO */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.producto_nombre}
        </Text>

        {item.producto_sku && (
          <View style={styles.skuRow}>
            <Icon name="barcode" size={12} color={T.textMuted} />
            <Text style={styles.sku}>{item.producto_sku}</Text>
          </View>
        )}

        <Text style={styles.price}>S/ {item.costo_venta}</Text>
      </View>

      {/* REMOVE */}
      <TouchableOpacity
        style={styles.close}
        onPress={() => onRemove(item.id)}
      >
        <Icon name="close" size={15} color={T.red} />
      </TouchableOpacity>

      {/* CONTROLS */}
      <View style={styles.controls}>
        {/* qty */}
        <View style={styles.block}>
          <Text style={styles.label}>Cant</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => onChangeQty(item.id, -1)}
            >
              <Icon name="minus" size={14} color={T.textSecondary} />
            </TouchableOpacity>

            <Text style={styles.stepText}>{item.cantidad}</Text>

            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => onChangeQty(item.id, 1)}
            >
              <Icon name="plus" size={14} color={T.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* discount */}
        <View style={styles.block}>
          <Text style={styles.label}>Desc</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => handleDiscountDelta(-1)}
            >
              <Icon name="minus" size={14} color={T.textSecondary} />
            </TouchableOpacity>

            <Text style={styles.stepText}>S/ {descuento.toFixed(0)}</Text>

            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => handleDiscountDelta(1)}
            >
              <Icon name="plus" size={14} color={T.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* TOTAL */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>S/ {total.toFixed(2)}</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// MAIN CARD
// ─────────────────────────────────────────────
export function ProductosCard({
  cart,
  onAgregar,
  onChangeQty,
  onRemove,
  onChangeDiscount,
}: ProductosCardProps) {
  const [visible, setVisible] = useState(false);
  const [img, setImg] = useState('');

  return (
    <>
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>PRODUCTOS</Text>

          <TouchableOpacity style={styles.addBtn} onPress={onAgregar}>
            <Icon name="plus" size={14} color={T.bg} />
            <Text style={styles.addText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* EMPTY */}
        {cart.length === 0 ? (
          <TouchableOpacity style={styles.empty} onPress={onAgregar}>
            <View style={styles.emptyIcon}>
              <Icon name="plus" size={16} color={T.textMuted} />
            </View>
            <Text style={styles.emptyText}>
              Toca Agregar para añadir productos
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.list}>
            {cart.map((item, i) => (
              <View key={item.id}>
                <ProductRow
                  item={item}
                  onChangeQty={onChangeQty}
                  onRemove={onRemove}
                  onChangeDiscount={onChangeDiscount}
                  onImagePress={(u: string) => {
                    setImg(u);
                    setVisible(true);
                  }}
                />

                {i < cart.length - 1 && <View style={styles.sep} />}
              </View>
            ))}
          </View>
        )}
      </View>

      <ImageViewing
        images={[{ uri: img }]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </>
  );
}

// ─────────────────────────────────────────────
// STYLES (T SYSTEM)
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: T.surface,
    borderRadius: T.radiusLg,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
    ...T.shadowCard,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    backgroundColor: T.surfaceAlt,
  },

  title: {
    fontSize: 11,
    fontWeight: '800',
    color: T.textMuted,
    letterSpacing: 1.2,
  },

  addBtn: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: T.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: T.radiusFull,
    alignItems: 'center',
  },

  addText: {
    color: T.bg,
    fontWeight: '700',
    fontSize: 12,
  },

  empty: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    alignItems: 'center',
  },

  emptyIcon: {
    width: 40,
    height: 40,
    borderRadius: T.radiusMd,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    color: T.textMuted,
    fontSize: 14,
  },

  list: {
    paddingVertical: 6,
  },

  sep: {
    height: 1,
    backgroundColor: T.border,
    marginHorizontal: 16,
  },

  // ROW
  row: {
    padding: 14,
    gap: 10,
  },

  image: {
    width: 68,
    height: 68,
    borderRadius: T.radiusMd,
    backgroundColor: T.surfaceAlt,
  },

  info: {
    flex: 1,
    gap: 3,
  },

  name: {
    fontSize: 14,
    fontWeight: '700',
    color: T.textPrimary,
  },

  skuRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },

  sku: {
    fontSize: 11,
    color: T.textMuted,
  },

  price: {
    fontSize: 13,
    fontWeight: '700',
    color: T.accent,
  },

  close: {
    position: 'absolute',
    right: 14,
    top: 14,
    width: 28,
    height: 28,
    borderRadius: T.radiusSm,
    backgroundColor: T.red + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  controls: {
    flexDirection: 'row',
    gap: 10,
  },

  block: {
    flex: 1,
    gap: 6,
  },

  label: {
    fontSize: 10,
    fontWeight: '700',
    color: T.textMuted,
    textTransform: 'uppercase',
  },

  stepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: T.radiusMd,
    backgroundColor: T.surfaceAlt,
    borderWidth: 1,
    borderColor: T.border,
  },

  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: T.radiusSm,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stepText: {
    fontWeight: '700',
    color: T.textPrimary,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontSize: 12,
    color: T.textMuted,
    fontWeight: '600',
  },

  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: T.accent,
  },
});