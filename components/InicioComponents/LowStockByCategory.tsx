import { useAppTheme } from '@/State/context/ThemeContext';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const COLORS = ['#C6FF00', '#6DFF7A', '#3BA7FF', '#FFB020', '#9B6DFF', '#FF5A5A', '#f9a8d4', '#00C9A7'];

export default function LowStockByCategory({ products }: { products: any[] }) {
    const { T } = useAppTheme();

    if (!products || products.length === 0) {
        return (
            <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Sin datos por categoría</Text>
            </View>
        );
    }

    // Agrupar por categoría
    const categoryMap: Record<string, number> = {};
    products.forEach(p => {
        const cat = p.inventario?.categoria_nombre ?? 'Sin categoría';
        categoryMap[cat] = (categoryMap[cat] ?? 0) + 1;
    });

    const categories = Object.entries(categoryMap)
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad);

    const maxQty = Math.max(...categories.map(c => c.cantidad));

    return (
        <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Distribución por Categoría</Text>
            <Text style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Productos con bajo stock por categoría</Text>

            <View style={{ gap: 12 }}>
                {categories.slice(0, 6).map((cat, i) => {
                    const pct = maxQty > 0 ? (cat.cantidad / maxQty) * 100 : 0;
                    return (
                        <View key={i}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Text style={{ fontSize: 13, color: T.textPrimary, fontWeight: '600' }} numberOfLines={1}>{cat.nombre}</Text>
                                <Text style={{ fontSize: 12, color: T.textSecondary }}>{cat.cantidad} prod.</Text>
                            </View>
                            <View style={{ height: 8, borderRadius: 4, backgroundColor: T.surfaceAlt, overflow: 'hidden' }}>
                                <View style={{ height: 8, borderRadius: 4, backgroundColor: COLORS[i % COLORS.length], width: `${pct}%` }} />
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
