import { useAppTheme } from '@/State/context/ThemeContext';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function DailyTopCategories({ data }: { data: any }) {
    const { T } = useAppTheme();

    if (!data || !data.categorias || data.categorias.length === 0) {
        return (
            <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Sin ventas por categoría hoy</Text>
            </View>
        );
    }

    const categories = data.categorias;
    const maxIngresos = Math.max(...categories.map((c: any) => c.ingreso_neto));

    return (
        <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Ventas por Categoría</Text>
            <Text style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Qué categorías generan más ingresos hoy</Text>

            <View style={{ gap: 12 }}>
                {categories.map((c: any, i: number) => {
                    const pct = maxIngresos > 0 ? (c.ingreso_neto / maxIngresos) * 100 : 0;
                    const color = c.color || T.accent;

                    return (
                        <View key={i}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Text style={{ fontSize: 13, color: T.textPrimary, fontWeight: '600' }} numberOfLines={1}>{c.nombre}</Text>
                                <Text style={{ fontSize: 12, color: T.textSecondary }}>{c.total_unidades} uds</Text>
                            </View>
                            <View style={{ height: 8, borderRadius: 4, backgroundColor: T.surfaceAlt, overflow: 'hidden' }}>
                                <View style={{ height: 8, borderRadius: 4, backgroundColor: color, width: `${pct}%` }} />
                            </View>
                            <Text style={{ fontSize: 12, color: T.textPrimary, fontWeight: '700', marginTop: 4 }}>S/ {c.ingreso_neto?.toFixed(0)}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
