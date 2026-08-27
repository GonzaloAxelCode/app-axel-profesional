import { useAppTheme } from '@/State/context/ThemeContext';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface ProductData {
    nombre: string;
    cantidad: number;
    total: number;
}

export default function TopProductsChart({ products }: { products: ProductData[] }) {
    const { T } = useAppTheme();

    if (!products || products.length === 0) {
        return (
            <View style={{
                backgroundColor: T.surface,
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: T.border,
                alignItems: 'center',
                gap: 8,
            }}>
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Sin datos de productos</Text>
            </View>
        );
    }

    const maxQty = Math.max(...products.map(p => p.cantidad));

    return (
        <View style={{
            backgroundColor: T.surface,
            borderRadius: 16,
            padding: 18,
            borderWidth: 1,
            borderColor: T.border,
        }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 16 }}>
                Top Productos Vendidos
            </Text>

            <View style={{ gap: 14 }}>
                {products.slice(0, 6).map((product, i) => {
                    const pct = maxQty > 0 ? (product.cantidad / maxQty) * 100 : 0;
                    return (
                        <View key={i}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Text style={{ fontSize: 13, color: T.textPrimary, fontWeight: '600', flex: 1 }} numberOfLines={1}>
                                    {product.nombre}
                                </Text>
                                <Text style={{ fontSize: 13, color: T.textSecondary, fontWeight: '500' }}>
                                    {product.cantidad} u.
                                </Text>
                            </View>
                            <View style={{ height: 8, borderRadius: 4, backgroundColor: T.surfaceAlt, overflow: 'hidden' }}>
                                <View style={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: T.accent,
                                    width: `${pct}%`,
                                }} />
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
