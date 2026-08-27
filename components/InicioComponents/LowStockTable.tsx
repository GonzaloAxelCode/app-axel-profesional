import { useAppTheme } from '@/State/context/ThemeContext';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function LowStockTable({ products }: { products: any[] }) {
    const { T } = useAppTheme();

    if (!products || products.length === 0) {
        return (
            <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Sin productos con bajo stock</Text>
            </View>
        );
    }

    const getStatusColor = (cantidad: number) => {
        if (cantidad <= 3) return T.red;
        if (cantidad <= 10) return T.amber;
        return T.green;
    };

    return (
        <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Productos con Bajo Stock</Text>
            <Text style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Lista de productos que necesitan reposición</Text>

            {/* Header */}
            <View style={{ flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: T.border, marginBottom: 8 }}>
                <Text style={{ flex: 1, fontSize: 11, color: T.textMuted, fontWeight: '600' }}>Producto</Text>
                <Text style={{ width: 45, fontSize: 11, color: T.textMuted, fontWeight: '600', textAlign: 'center' }}>Stock</Text>
                <Text style={{ width: 45, fontSize: 11, color: T.textMuted, fontWeight: '600', textAlign: 'center' }}>Mín</Text>
                <Text style={{ width: 50, fontSize: 11, color: T.textMuted, fontWeight: '600', textAlign: 'right' }}>Estado</Text>
            </View>

            {/* Rows */}
            {products.slice(0, 15).map((p, i) => {
                const cantidad = p.inventario?.cantidad ?? 0;
                const stockMin = p.inventario?.stock_minimo ?? 0;
                const statusColor = getStatusColor(cantidad);
                const estado = cantidad <= 3 ? 'Crítico' : cantidad <= 10 ? 'Bajo' : 'Normal';

                return (
                    <View key={i} style={{
                        flexDirection: 'row',
                        paddingVertical: 10,
                        borderBottomWidth: i < products.length - 1 ? 1 : 0,
                        borderBottomColor: T.border,
                        alignItems: 'center',
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 12, fontWeight: '600', color: T.textPrimary }} numberOfLines={1}>{p.item?.nombre ?? p.inventario?.producto_nombre}</Text>
                            <Text style={{ fontSize: 10, color: T.textMuted }}>{p.inventario?.categoria_nombre}</Text>
                        </View>
                        <View style={{ width: 45, alignItems: 'center' }}>
                            <View style={{
                                backgroundColor: statusColor + '18',
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                                borderRadius: 6,
                            }}>
                                <Text style={{ fontSize: 12, fontWeight: '700', color: statusColor }}>{cantidad}</Text>
                            </View>
                        </View>
                        <Text style={{ width: 45, fontSize: 12, color: T.textSecondary, textAlign: 'center' }}>{stockMin}</Text>
                        <View style={{ width: 50, alignItems: 'flex-end' }}>
                            <View style={{
                                backgroundColor: statusColor + '18',
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                                borderRadius: 6,
                            }}>
                                <Text style={{ fontSize: 9, fontWeight: '700', color: statusColor }}>{estado}</Text>
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}
