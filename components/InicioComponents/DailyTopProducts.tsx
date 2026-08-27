import { useAppTheme } from '@/State/context/ThemeContext';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function DailyTopProducts({ data }: { data: any }) {
    const { T } = useAppTheme();

    if (!data || !data.productos || data.productos.length === 0) {
        return (
            <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Sin productos vendidos hoy</Text>
            </View>
        );
    }

    const products = data.productos.slice(0, 10);

    return (
        <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Top 10 Productos Más Vendidos</Text>
            <Text style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Los que más salieron hoy</Text>

            {/* Header */}
            <View style={{ flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: T.border, marginBottom: 8 }}>
                <Text style={{ width: 30, fontSize: 11, color: T.textMuted, fontWeight: '600' }}>#</Text>
                <Text style={{ flex: 1, fontSize: 11, color: T.textMuted, fontWeight: '600' }}>Producto</Text>
                <Text style={{ width: 40, fontSize: 11, color: T.textMuted, fontWeight: '600', textAlign: 'right' }}>Cant.</Text>
                <Text style={{ width: 70, fontSize: 11, color: T.textMuted, fontWeight: '600', textAlign: 'right' }}>Total</Text>
            </View>

            {/* Rows */}
            {products.map((p: any, i: number) => (
                <View key={i} style={{ flexDirection: 'row', paddingVertical: 8, borderBottomWidth: i < products.length - 1 ? 1 : 0, borderBottomColor: T.border }}>
                    <Text style={{ width: 30, fontSize: 12, color: T.textSecondary, fontWeight: '600' }}>{p.posicion ?? i + 1}</Text>
                    <Text style={{ flex: 1, fontSize: 12, color: T.textPrimary, fontWeight: '500' }} numberOfLines={1}>{p.nombre}</Text>
                    <Text style={{ width: 40, fontSize: 12, color: T.textSecondary, textAlign: 'right' }}>{p.cantidad_vendida}</Text>
                    <Text style={{ width: 70, fontSize: 12, color: T.textPrimary, fontWeight: '700', textAlign: 'right' }}>S/ {p.total_neto?.toFixed(2)}</Text>
                </View>
            ))}
        </View>
    );
}
