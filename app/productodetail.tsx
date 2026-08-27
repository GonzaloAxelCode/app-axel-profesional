import T from '@/constants/THEME';
import { buscarProductoPorSKU } from '@/State/api/inventario.api';
import { useProductos } from '@/State/hooks/useProductos';
import { Producto } from '@/State/models/producto.models';
import { URLS } from '@/State/utils/endpoints';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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
import Barcode from 'react-native-barcode-svg';

const W = Dimensions.get('window').width;

const formatFecha = (fecha?: Date | string) => {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-PE', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

export default function ProductoDetailScreen() {
  const { id, sku, fromScanner } = useLocalSearchParams<{ id: string; sku: string; fromScanner: string }>();
  const router = useRouter();
  const [imageVisible, setImageVisible] = useState(false);
  const { productos, isLoading } = useProductos(200);
  const [productoFromSku, setProductoFromSku] = useState<any>(null);
  const [loadingSku, setLoadingSku] = useState(false);
  const [errorSku, setErrorSku] = useState<string | null>(null);

  const producto: Producto | undefined = useMemo(
    () => productos?.find((p) => p.id.toString() === id),
    [productos, id]
  );

  useEffect(() => {
    if (sku && fromScanner === 'true') {
      setLoadingSku(true);
      setErrorSku(null);
      buscarProductoPorSKU(sku)
        .then((data) => {
          setProductoFromSku(data.producto);
        })
        .catch((err) => {
          setErrorSku(err?.data?.error || 'Error al buscar producto');
        })
        .finally(() => {
          setLoadingSku(false);
        });
    }
  }, [sku, fromScanner]);

  const currentProducto = productoFromSku || producto;

  const handleShare = async () => {
    if (!currentProducto) return;
    await Share.share({ message: `${currentProducto.nombre} — S/ ${currentProducto.inventario?.costo_venta ?? '—'}` });
  };

  if (isLoading || loadingSku) {
    return (
      <GestureHandlerRootView style={s.center}>
        <ActivityIndicator size="large" color={T.accent} />
        <Text style={s.loadingText}>{loadingSku ? 'Buscando producto por SKU...' : 'Cargando...'}</Text>
      </GestureHandlerRootView>
    );
  }

  if (errorSku) {
    return (
      <GestureHandlerRootView style={s.center}>
        <Icon name="alert-circle-outline" size={52} color={T.red} />
        <Text style={s.emptyTitle}>{errorSku}</Text>
        <TouchableOpacity style={s.backPill} onPress={() => router.back()}>
          <Text style={s.backPillText}>Volver</Text>
        </TouchableOpacity>
      </GestureHandlerRootView>
    );
  }

  if (!currentProducto) {
    return (
      <GestureHandlerRootView style={s.center}>
        <Icon name="package-variant-closed" size={52} color={T.textMuted} />
        <Text style={s.emptyTitle}>Producto no encontrado</Text>
        <TouchableOpacity style={s.backPill} onPress={() => router.back()}>
          <Text style={s.backPillText}>Volver</Text>
        </TouchableOpacity>
      </GestureHandlerRootView>
    );
  }

  const inv = currentProducto.inventario;
  const precioVenta = inv?.costo_venta;
  const precioCompra = inv?.costo_compra;
  const stock = inv?.cantidad ?? null;
  const ganancia = precioVenta && precioCompra ? precioVenta - precioCompra : null;
  const margen = precioVenta && precioCompra ? Math.round(((precioVenta - precioCompra) / precioVenta) * 100) : null;

  const getImg = (p: any) =>
    p?.imagen ? URLS.BASE + p.imagen : URLS.IMAGE_URL_PLACEHOLDER;

  const infoRows = [
    { label: 'SKU', value: currentProducto.sku || '—', icon: 'barcode' },
    { label: 'Marca', value: currentProducto.marca || '—', icon: 'tag-outline' },
    { label: 'Modelo', value: currentProducto.modelo || '—', icon: 'cube-outline' },
    { label: 'Costo compra', value: precioCompra != null ? `S/ ${precioCompra}` : '—', icon: 'cart-outline' },
    { label: 'Categoría', value: currentProducto.categoria_nombre || '—', icon: 'shape-outline' },
    { label: 'Creado', value: formatFecha(currentProducto.fecha_creacion), icon: 'calendar-outline' },
  ].filter(r => r.value !== '—');

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: T.bg }}>

      {/* ── HERO ── */}
      <View style={s.hero}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setImageVisible(true)} style={{ flex: 1 }}>
          <Image
            source={{ uri: getImg(currentProducto) }}
            style={s.heroImg}
            contentFit="cover"
          />
          {/* overlay gradient */}
          <View style={s.heroOverlay} />
        </TouchableOpacity>

        {/* Back */}
        <TouchableOpacity style={[s.fab, s.fabLeft]} onPress={() => router.back()}>
          <Icon name="chevron-left" size={22} color={T.textPrimary} />
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity style={[s.fab, s.fabRight]} onPress={handleShare}>
          <Icon name="share-variant-outline" size={18} color={T.textPrimary} />
        </TouchableOpacity>

        {/* Estado badge */}
        <View style={[s.estadoBadge, { backgroundColor: currentProducto.activo ? T.green + '20' : T.red + '20' }]}>
          <View style={[s.estadoDot, { backgroundColor: currentProducto.activo ? T.green : T.red }]} />
          <Text style={[s.estadoText, { color: currentProducto.activo ? T.green : T.red }]}>
            {currentProducto.activo ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── NOMBRE + PRECIO ── */}
        <View style={s.topSection}>
          <View style={{ flex: 1 }}>
            <Text style={s.nombre}>{currentProducto.nombre}</Text>
            {currentProducto.categoria_nombre && (
              <View style={s.catChip}>
                <Icon name="shape-outline" size={11} color={T.textMuted} />
                <Text style={s.catText}>{currentProducto.categoria_nombre}</Text>
              </View>
            )}
          </View>
          {precioVenta != null && (
            <View style={s.precioBox}>
              <Text style={s.precioLabel}>S/</Text>
              <Text style={s.precio}>{precioVenta}</Text>
            </View>
          )}
        </View>

        {/* ── STATS GRID ── */}
        <View style={s.statsGrid}>
          {stock != null && (
            <View style={[s.statCard, { backgroundColor: T.accent + '15' }]}>
              <Text style={[s.statVal, { color: T.accent }]}>{stock}</Text>
              <Text style={s.statLbl}>Stock</Text>
            </View>
          )}
          {ganancia != null && (
            <View style={[s.statCard, { backgroundColor: T.green + '15' }]}>
              <Text style={[s.statVal, { color: T.green }]}>S/{ganancia}</Text>
              <Text style={s.statLbl}>Ganancia</Text>
            </View>
          )}
          {margen != null && (
            <View style={[s.statCard, { backgroundColor: T.blue + '15' }]}>
              <Text style={[s.statVal, { color: T.blue }]}>{margen}%</Text>
              <Text style={s.statLbl}>Margen</Text>
            </View>
          )}
        </View>

        {/* ── INFO ROWS ── */}
        {infoRows.length > 0 && (
          <View style={s.infoCard}>
            {infoRows.map(({ label, value, icon }, i) => (
              <View key={label} style={[s.infoRow, i < infoRows.length - 1 && s.infoRowBorder]}>
                <View style={s.infoLeft}>
                  <View style={s.infoIconBox}>
                    <Icon name={icon as any} size={14} color={T.textMuted} />
                  </View>
                  <Text style={s.infoLabel}>{label}</Text>
                </View>
                <Text style={s.infoValue} numberOfLines={1}>{value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── DESCRIPCIÓN ── */}
        {currentProducto.descripcion && (
          <View style={s.descCard}>
            <Text style={s.sectionLabel}>Descripción</Text>
            <Text style={s.descripcion}>{currentProducto.descripcion}</Text>
          </View>
        )}

        {/* ── CARACTERÍSTICAS ── */}
        {currentProducto.caracteristicas && Object.keys(currentProducto.caracteristicas).length > 0 && (
          <View style={s.infoCard}>
            <Text style={[s.sectionLabel, { paddingHorizontal: 16, paddingTop: 14 }]}>Características</Text>
            {Object.entries(currentProducto.caracteristicas).map(([key, val], i, arr) => (
              <View key={key} style={[s.infoRow, i < arr.length - 1 && s.infoRowBorder]}>
                <Text style={s.infoLabel}>{key}</Text>
                <Text style={s.infoValue}>{String(val)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── CÓDIGO DE BARRAS ── */}
        {currentProducto.sku && (
          <View style={s.barcodeCard}>
            <Text style={s.sectionLabel}>Código de Barras</Text>
            <View style={s.barcodeContainer}>
              <Barcode
                value={currentProducto.sku}
                format="CODE128"
                singleBarWidth={1.5}
                height={60}
                lineColor="#000000"
                backgroundColor="#FFFFFF"
                onError={(error: Error) => console.warn('Barcode error:', error)}
              />
              <Text style={s.barcodeText}>{currentProducto.sku}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <ImageViewing
        images={[{ uri: getImg(currentProducto) }]}
        imageIndex={0}
        visible={imageVisible}
        onRequestClose={() => setImageVisible(false)}
      />
    </GestureHandlerRootView>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, backgroundColor: T.bg, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 14, color: T.textMuted, marginTop: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: T.textMuted, marginTop: 12 },
  backPill: { marginTop: 12, backgroundColor: T.accent, borderRadius: 100, paddingHorizontal: 20, paddingVertical: 10 },
  backPillText: { color: '#0A0A0A', fontWeight: '700', fontSize: 14 },

  hero: { height: 300, backgroundColor: T.surfaceAlt, position: 'relative' },
  heroImg: { width: W, height: 300 },
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
    backgroundColor: 'transparent',
  },

  fab: {
    position: 'absolute', top: 52,
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: T.surface + 'EE',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: T.border,
  },
  fabLeft: { left: 16 },
  fabRight: { right: 16 },

  estadoBadge: {
    position: 'absolute', bottom: 16, left: 16,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6,
  },
  estadoDot: { width: 6, height: 6, borderRadius: 3 },
  estadoText: { fontSize: 12, fontWeight: '700' },

  scroll: { padding: 20, gap: 14, paddingBottom: 40 },

  topSection: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  nombre: { fontSize: 24, fontWeight: '900', color: T.textPrimary, letterSpacing: -0.5, lineHeight: 28, marginBottom: 6 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start', backgroundColor: T.surfaceAlt,
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4,
  },
  catText: { fontSize: 11, fontWeight: '600', color: T.textMuted },
  precioBox: { alignItems: 'flex-end' },
  precioLabel: { fontSize: 12, fontWeight: '700', color: T.accent, marginBottom: -2 },
  precio: { fontSize: 32, fontWeight: '900', color: T.accent, letterSpacing: -1 },

  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, borderRadius: T.radiusLg,
    paddingVertical: 16, alignItems: 'center', gap: 4,
  },
  statVal: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  statLbl: { fontSize: 10, color: T.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },

  infoCard: {
    backgroundColor: T.surface, borderRadius: T.radiusLg,
    borderWidth: 1, borderColor: T.border, overflow: 'hidden',
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: T.border },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoIconBox: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center',
  },
  infoLabel: { fontSize: 13, color: T.textMuted },
  infoValue: { fontSize: 13, fontWeight: '700', color: T.textPrimary, flex: 1, textAlign: 'right', marginLeft: 16 },

  descCard: {
    backgroundColor: T.surface, borderRadius: T.radiusLg,
    borderWidth: 1, borderColor: T.border, padding: 16, gap: 8,
  },
  sectionLabel: { fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700' },
  descripcion: { fontSize: 14, lineHeight: 22, color: T.textSecondary },
  barcodeCard: {
    backgroundColor: T.surface, borderRadius: T.radiusLg,
    borderWidth: 1, borderColor: T.border, padding: 16, gap: 12,
  },
  barcodeContainer: {
    alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 12,
    padding: 20, borderWidth: 1, borderColor: T.border,
  },
  barcodeVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    height: 60,
  },
  barcodeLine: {
    borderRadius: 1,
  },
  barcodeText: {
    fontSize: 16, fontWeight: '800', color: T.textPrimary,
    letterSpacing: 4, fontFamily: 'monospace',
  },
});