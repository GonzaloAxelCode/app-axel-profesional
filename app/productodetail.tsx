import { useProductos } from '@/State/hooks/useProductos';
import { Producto } from '@/State/models/producto.models';
import { URLS } from '@/State/utils/endpoints';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageViewing from 'react-native-image-viewing';
import { Text } from 'react-native-paper';

const SCREEN_WIDTH = Dimensions.get('window').width;
// ─── helpers ─────────────────────────────────────────────────────────────────

const formatFecha = (fecha?: Date | string) => {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-PE', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

// ─── ProductoDetailScreen ─────────────────────────────────────────────────────

export default function ProductoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [imageVisible, setImageVisible] = useState(false);
  const { productos, isLoading } = useProductos(200);

  const producto: Producto | undefined = useMemo(
    () => productos?.find((p) => p.id.toString() === id),
    [productos, id]
  );

  const handleShare = async () => {
    if (!producto) return;
    await Share.share({ message: `${producto.nombre} — S/ ${producto.inventario?.costo_venta ?? '—'}` });
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <GestureHandlerRootView style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#0a0a0a" />
        <Text style={styles.loadingText}>Cargando producto...</Text>
      </GestureHandlerRootView>
    );
  }

  // ── Not found ──
  if (!producto) {
    return (
      <GestureHandlerRootView style={styles.loadingWrap}>
        <Icon name="package-variant-closed" size={52} color="#e5e7eb" />
        <Text style={styles.emptyTitle}>Producto no encontrado</Text>
        <TouchableOpacity style={styles.backPill} onPress={() => router.back()}>
          <Text style={styles.backPillText}>Volver</Text>
        </TouchableOpacity>
      </GestureHandlerRootView>
    );
  }

  const inv = producto.inventario;
  const precioVenta = inv?.costo_venta;
  const precioCompra = inv?.costo_compra;
  const stock = inv?.cantidad ?? inv?.cantidad ?? null;
  const vendidos = null;

  const getImagenProducto = (producto: Producto) =>
    producto?.imagen ? URLS.BASE + producto.imagen : URLS.IMAGE_URL_PLACEHOLDER;


  const infoRows = [
    { label: 'SKU', value: producto.sku || '—' },
    { label: 'Marca', value: producto.marca || '—' },
    { label: 'Modelo', value: producto.modelo || '—' },
    { label: 'Precio compra', value: precioCompra != null ? `S/ ${precioCompra}` : '—' },
    { label: 'Categoría', value: producto.categoria_nombre || '—' },
    { label: 'Creado', value: formatFecha(producto.fecha_creacion) },
  ].filter(r => r.value !== '—');

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.screen}>

        {/* ── HERO IMAGE ── */}
        <View style={styles.hero}>
          {producto.imagen ? (
            <TouchableOpacity activeOpacity={0.9} onPress={() => setImageVisible(true)}>
              <Image
                source={{ uri: getImagenProducto(producto) }}
                style={styles.heroImg}
                contentFit="cover"
                placeholder={URLS.IMAGE_URL_PLACEHOLDER}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.heroPlaceholder}>
              <Icon name="package-variant-closed" size={64} color="#d1d5db" />
              <Text style={styles.heroPlaceholderText}>Sin imagen</Text>
            </View>
          )}

          {/* Back */}
          <TouchableOpacity style={[styles.circleBtn, styles.circleBtnLeft]} onPress={() => router.back()} activeOpacity={0.8}>
            <Icon name="chevron-left" size={22} color="#0a0a0a" />
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity style={[styles.circleBtn, styles.circleBtnRight]} onPress={handleShare} activeOpacity={0.8}>
            <Icon name="share-variant-outline" size={19} color="#0a0a0a" />
          </TouchableOpacity>

          {/* Stock badge */}
          {stock != null && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockBadgeText}>{stock} en stock</Text>
            </View>
          )}
        </View>

        {/* ── CONTENT ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Nombre + Precio */}
          <View style={styles.topRow}>
            <Text style={styles.nombre}>{producto.nombre}</Text>
            {precioVenta != null && (
              <Text style={styles.precio}>S/ {precioVenta}</Text>
            )}
          </View>

          {/* Categoría chip */}
          {producto.categoria_nombre && (
            <View style={styles.categoriaChip}>
              <Icon name="tag-outline" size={12} color="#6b7280" />
              <Text style={styles.categoriaText}>{producto.categoria_nombre}</Text>
            </View>
          )}

          {/* Stats pills */}
          <View style={styles.statsRow}>
            {stock != null && (
              <View style={styles.statPill}>
                <Text style={styles.statVal}>{stock}</Text>
                <Text style={styles.statLbl}>Stock</Text>
              </View>
            )}
            {vendidos != null && (
              <View style={styles.statPill}>
                <Text style={styles.statVal}>{vendidos}</Text>
                <Text style={styles.statLbl}>Vendidos</Text>
              </View>
            )}
            <View style={styles.statPill}>
              <Text style={[styles.statVal, styles.statValEstado, { color: producto.activo ? '#16a34a' : '#ef4444' }]}>
                {producto.activo ? 'ACTIVO' : 'INACTIVO'}
              </Text>
              <Text style={styles.statLbl}>Estado</Text>
            </View>
          </View>

          {/* Info card */}
          {infoRows.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Información</Text>
              <View style={styles.infoCard}>
                {infoRows.map(({ label, value }, i) => (
                  <View
                    key={label}
                    style={[styles.infoRow, i < infoRows.length - 1 && styles.infoRowBorder]}
                  >
                    <Text style={styles.infoLabel}>{label}</Text>
                    <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Descripción */}
          {producto.descripcion && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>Descripción</Text>
              <Text style={styles.descripcion}>{producto.descripcion}</Text>
            </>
          )}

          {/* Características */}
          {producto.caracteristicas && Object.keys(producto.caracteristicas).length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>Características</Text>
              <View style={styles.infoCard}>
                {Object.entries(producto.caracteristicas).map(([key, val], i, arr) => (
                  <View
                    key={key}
                    style={[styles.infoRow, i < arr.length - 1 && styles.infoRowBorder]}
                  >
                    <Text style={styles.infoLabel}>{key}</Text>
                    <Text style={styles.infoValue}>{String(val)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>

        {/* ──  <View style={styles.bottomBar}>

          <TouchableOpacity style={styles.addBtn} activeOpacity={0.85}>
            <Icon name="pencil" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Editar</Text>
          </TouchableOpacity>
        </View> ── */}


      </View>
      <ImageViewing
        images={[{ uri: getImagenProducto(producto) }]}
        imageIndex={0}
        visible={imageVisible}
        onRequestClose={() => setImageVisible(false)}
      />
    </GestureHandlerRootView>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },

  loadingWrap: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 15, color: '#9ca3af', marginTop: 14 },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: '#9ca3af', marginTop: 14 },
  backPill: { marginTop: 8, backgroundColor: '#0a0a0a', borderRadius: 100, paddingHorizontal: 20, paddingVertical: 10 },
  backPillText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // hero
  hero: {
    height: 340,
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImg: { width: SCREEN_WIDTH, height: 340 },
  heroPlaceholder: { alignItems: 'center' },
  heroPlaceholderText: { fontSize: 13, color: '#9ca3af', marginTop: 10 },

  circleBtn: {
    position: 'absolute', top: 52,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center', justifyContent: 'center',
  },
  circleBtnLeft: { left: 20 },
  circleBtnRight: { right: 20 },

  stockBadge: {
    position: 'absolute', bottom: 18, right: 18,
    backgroundColor: '#0a0a0a', borderRadius: 100, paddingHorizontal: 14, paddingVertical: 6,
  },
  stockBadgeText: { fontSize: 12, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },

  // scroll
  scrollContent: { padding: 24, paddingBottom: 110 },

  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 },
  nombre: { flex: 1, fontSize: 26, fontWeight: '800', color: '#0a0a0a', letterSpacing: -0.8, lineHeight: 30, marginRight: 12 },
  precio: { fontSize: 26, fontWeight: '800', color: '#0a0a0a', letterSpacing: -0.8, flexShrink: 0 },

  categoriaChip: {
    flexDirection: 'row', alignItems: 'center',
    alignSelf: 'flex-start', backgroundColor: '#f5f5f5',
    borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 20,
  },
  categoriaText: { fontSize: 12, fontWeight: '700', color: '#6b7280', marginLeft: 6 },

  statsRow: { flexDirection: 'row', marginBottom: 24 },
  statPill: {
    flex: 1, backgroundColor: '#f9f9f9', borderRadius: 16,
    borderWidth: 0.5, borderColor: '#ebebeb', padding: 14, alignItems: 'center',
    marginRight: 10,
  },
  statVal: { fontSize: 20, fontWeight: '800', color: '#0a0a0a', letterSpacing: -0.5 },
  statValEstado: { fontSize: 13 },
  statLbl: { fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '700', marginTop: 3 },

  // section
  sectionLabel: { fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700', marginBottom: 12 },
  divider: { height: 0.5, backgroundColor: '#f5f5f5', marginVertical: 20 },

  // info card
  infoCard: { backgroundColor: '#f9f9f9', borderRadius: 16, borderWidth: 0.5, borderColor: '#ebebeb', overflow: 'hidden' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13 },
  infoRowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#ebebeb' },
  infoLabel: { fontSize: 14, color: '#6b7280' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#0a0a0a', flex: 1, textAlign: 'right', marginLeft: 16 },

  // descripción
  descripcion: { fontSize: 14, lineHeight: 22, color: '#6b7280' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 0.5, borderTopColor: '#ebebeb',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 14, paddingBottom: 32,
  },
  editBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f5f5f5', borderRadius: 14,
    paddingHorizontal: 18, paddingVertical: 14,
    marginRight: 12,
  },
  editBtnText: { fontSize: 14, fontWeight: '700', color: '#0a0a0a', marginLeft: 6 },
  addBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0a0a0a', borderRadius: 14, paddingVertical: 15,
  },
  addBtnText: { fontSize: 15, fontWeight: '700', color: '#fff', marginLeft: 8 },
});