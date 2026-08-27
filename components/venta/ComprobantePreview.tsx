import { useAppTheme } from '@/State/context/ThemeContext';
import { InventarioCart } from '@/State/models/inventario.models';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface Props {
  cart: InventarioCart[];
  subtotal: number;
  descuento: number;
  total: number;
  igv: number;
  metodoPago: string;
  cliente: {
    document: string;
    fullname: string;
  };
}

export function ComprobantePreview({ cart, subtotal, descuento, total, igv, metodoPago, cliente }: Props) {
  const { T } = useAppTheme();

  if (cart.length === 0) return null;

  const fecha = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const hora = new Date().toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: T.textMuted }]}>VISTA PREVIA COMPROBANTE</Text>
      <View style={styles.receipt}>
        {/* Header */}
        <Text style={styles.center}>MI TIENDA S.A.C.</Text>
        <Text style={styles.centerSmall}>Av. Principal 123, Lima - Lima</Text>
        <Text style={styles.centerSmall}>Tel: (01) 123-4567 / 999 888 777</Text>
        <Text style={styles.centerSmall}>RUC: 20123456789</Text>
        <Text style={styles.centerSmall}>ventas@mitienda.com</Text>

        <View style={styles.divider} />

        {/* Tipo de comprobante */}
        <Text style={styles.centerBold}>BOLETA DE VENTA ELECTRÓNICA</Text>
        <Text style={styles.centerBold}>B001-00000001</Text>

        <View style={styles.divider} />

        {/* Datos del cliente */}
        <Text style={styles.line}>Cliente: {cliente.fullname || 'Cliente General'}</Text>
        <Text style={styles.line}>Doc: {cliente.document || '-'}</Text>
        <Text style={styles.line}>Fecha: {fecha} {hora}</Text>
        <Text style={styles.line}>Pago: {metodoPago}</Text>
        <Text style={styles.line}>Cajero: Admin</Text>

        <View style={styles.divider} />

        {/* Productos */}
        <View style={styles.productsHeader}>
          <Text style={[styles.productCol, { flex: 2 }]}>DESCRIPCIÓN</Text>
          <Text style={[styles.productCol, { textAlign: 'center' }]}>QTY</Text>
          <Text style={[styles.productCol, { textAlign: 'right' }]}>P.U.</Text>
          <Text style={[styles.productCol, { textAlign: 'right' }]}>TOTAL</Text>
        </View>

        <View style={styles.dividerDotted} />

        {cart.map((p, i) => {
          const precio = Number(p.costo_venta || 0).toFixed(2);
          const totalProd = (Number(p.costo_venta || 0) * p.cantidad).toFixed(2);
          return (
            <View key={i} style={styles.productRow}>
              <Text style={[styles.productCol, { flex: 2 }]} numberOfLines={1}>{p.producto_nombre}</Text>
              <Text style={[styles.productCol, { textAlign: 'center' }]}>{p.cantidad}</Text>
              <Text style={[styles.productCol, { textAlign: 'right' }]}>{precio}</Text>
              <Text style={[styles.productCol, { textAlign: 'right' }]}>{totalProd}</Text>
            </View>
          );
        })}

        <View style={styles.dividerDotted} />

        {/* Totales */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>SUBTOTAL</Text>
          <Text style={styles.totalValue}>S/ {(subtotal / 1.18).toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>IGV (18%)</Text>
          <Text style={styles.totalValue}>S/ {igv.toFixed(2)}</Text>
        </View>
        {descuento > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>DESCUENTO</Text>
            <Text style={styles.totalValue}>- S/ {descuento.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalBold}>TOTAL</Text>
          <Text style={styles.totalBold}>S/ {total.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        {/* Footer */}
        <Text style={styles.centerSmall}>¡Gracias por su compra!</Text>
        <Text style={styles.centerSmall}>Representación impresa de la</Text>
        <Text style={styles.centerSmall}>Boleta Electrónica</Text>

        <View style={styles.sunatContainer}>
          <Text style={styles.sunatText}>AUTORIZADO POR SUNAT</Text>
          <Text style={styles.sunatSmall}>Consulte su comprobante en</Text>
          <Text style={styles.sunatSmall}>www.sunat.gob.pe</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  receipt: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 20,
    paddingBottom: 30,
  },
  center: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  centerBold: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 2,
  },
  centerSmall: {
    fontSize: 10,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 2,
  },
  line: {
    fontSize: 11,
    color: '#000000',
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 8,
  },
  dividerDotted: {
    height: 1,
    borderTopWidth: 1,
    borderTopColor: '#000000',
    borderStyle: 'dashed',
    marginVertical: 6,
  },
  productsHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  productCol: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
  },
  productRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  totalLabel: {
    fontSize: 11,
    color: '#000000',
  },
  totalValue: {
    fontSize: 11,
    color: '#000000',
  },
  totalBold: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
  },
  sunatContainer: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: '#000000',
  },
  sunatText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 4,
  },
  sunatSmall: {
    fontSize: 9,
    color: '#333333',
    textAlign: 'center',
  },
});
