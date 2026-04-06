import { Inventario } from '@/State/models/inventario.models';
import { URLS } from '@/State/utils/endpoints';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, MD3Colors, Text } from 'react-native-paper';
import ImageViewing from 'react-native-image-viewing';

interface ProductosCardProps {
  cart: Inventario[];
  onAgregar: () => void;
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

const getImagenProducto = (producto: Inventario) =>
  producto.imagen_producto
    ? URLS.BASE + producto.imagen_producto
    : URLS.IMAGE_URL_PLACEHOLDER;

export function ProductosCard({ cart, onAgregar, onChangeQty, onRemove }: ProductosCardProps) {
  const [imageVisible, setImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Text style={styles.secLabel}>PRODUCTOS</Text>
          <TouchableOpacity style={styles.secAction} onPress={onAgregar}>
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
          cart.map((item) => (
            <View key={item.id} style={styles.prodRow}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedImage(getImagenProducto(item));
                  setImageVisible(true);
                }}
              >
                <Image
                  source={{ uri: getImagenProducto(item) }}
                  style={styles.cardImage}
                  contentFit="cover"
                />
              </TouchableOpacity>

              <View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.prodName, { width: '50%' }]} numberOfLines={3}>
                    {item.producto_nombre}
                  </Text>
                  <Text style={styles.prodMeta}>S/.{item.costo_venta} c/u</Text>
                </View>

                <View style={styles.qtyCtrl}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => onChangeQty(item.id, -1)}>
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyNum}>{item.cantidad}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => onChangeQty(item.id, 1)}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ position: 'absolute', right: 10, bottom: 10 }}>
                <Text style={styles.prodPrice}>S/.{item.costo_venta * item.cantidad}</Text>
              </View>

              <View style={{ position: 'absolute', right: 2, top: 2 }}>
                <IconButton
                  icon="close"
                  size={20}
                  mode="contained-tonal"
                  onPress={() => onRemove(item.id)}
                  iconColor={MD3Colors.error50}
                />
              </View>
            </View>
          ))
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

const styles = StyleSheet.create({
  card: { borderRadius: 20, backgroundColor: '#f7f7f7', overflow: 'hidden' },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingHorizontal: 18 },
  secLabel: { fontSize: 14, fontWeight: '800', color: '#000', letterSpacing: 1 },
  secAction: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#000', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 9 },
  secActionText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  ghostRow: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 18, paddingBottom: 14, gap: 12 },
  ghostIcon: { width: 36, height: 36, borderRadius: 10, borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  ghostText: { fontSize: 15, color: 'gray' },
  prodRow: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 18, paddingBottom: 14, gap: 14, position: 'relative' },
  cardImage: { width: 90, height: 90, borderRadius: 10 },
  prodName: { fontSize: 16, fontWeight: '700', color: '#000', flexShrink: 1 },
  prodMeta: { fontSize: 14, color: 'black', marginTop: 2 },
  prodPrice: { fontSize: 20, fontWeight: '900', color: '#000', minWidth: 56, textAlign: 'right' },
  qtyCtrl: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  qtyBtn: { width: 40, height: 40, backgroundColor: 'white', borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 18, fontWeight: '300', color: '#000', lineHeight: 22 },
  qtyNum: { fontSize: 16, fontWeight: '700', width: 26, textAlign: 'center', color: '#000' },
});
