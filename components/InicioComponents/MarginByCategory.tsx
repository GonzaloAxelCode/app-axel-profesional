import { useAppTheme } from '@/State/context/ThemeContext';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const COLORS = ['#C6FF00', '#6DFF7A', '#3BA7FF', '#FFB020', '#9B6DFF', '#FF5A5A'];

export default function MarginByCategory() {
    const { T } = useAppTheme();

    // Datos hardcodeados (igual que la web)
    const categories = [
        { nombre: 'Celulares', ingresos: 18000, costo: 10500, margen: 41.7 },
        { nombre: 'Accesorios', ingresos: 8500, costo: 4200, margen: 50.6 },
        { nombre: 'Repuestos', ingresos: 3200, costo: 2100, margen: 34.4 },
        { nombre: 'Tablets', ingresos: 2400, costo: 1700, margen: 29.2 },
    ];

    const maxMargen = Math.max(...categories.map(c => c.margen));

    return (
        <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Margen por Categoría</Text>
            <Text style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Porcentaje de ganancia por categoría</Text>

            <View style={{ gap: 14 }}>
                {categories.map((cat, i) => {
                    const pct = maxMargen > 0 ? (cat.margen / maxMargen) * 100 : 0;
                    return (
                        <View key={i}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Text style={{ fontSize: 13, color: T.textPrimary, fontWeight: '600' }}>{cat.nombre}</Text>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: T.accent }}>{cat.margen}%</Text>
                            </View>
                            <View style={{ height: 8, borderRadius: 4, backgroundColor: T.surfaceAlt, overflow: 'hidden' }}>
                                <View style={{ height: 8, borderRadius: 4, backgroundColor: COLORS[i % COLORS.length], width: `${pct}%` }} />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                <Text style={{ fontSize: 11, color: T.textMuted }}>Ingresos: S/ {cat.ingresos.toLocaleString()}</Text>
                                <Text style={{ fontSize: 11, color: T.textMuted }}>Costo: S/ {cat.costo.toLocaleString()}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
