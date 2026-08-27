import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function PerformanceGauge({ data }: { data: any }) {
    const { T } = useAppTheme();

    if (!data) {
        return (
            <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Sin datos de rendimiento</Text>
            </View>
        );
    }

    const porcentaje = data.porcentaje ?? 0;
    const variacion = data.variacion ?? 0;
    const mesA = data.mes_a ?? {};
    const mesB = data.mes_b ?? {};
    const isPositive = variacion >= 0;

    return (
        <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Rendimiento de Ventas</Text>
            <Text style={{ fontSize: 12, color: T.textMuted, marginBottom: 20 }}>Comparativa entre meses</Text>

            {/* Gauge visual */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <View style={{
                    width: 160, height: 80,
                    borderTopLeftRadius: 80, borderTopRightRadius: 80,
                    backgroundColor: T.surfaceAlt,
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    {/* Fill */}
                    <View style={{
                        position: 'absolute',
                        bottom: 0, left: 0,
                        width: 160, height: 80,
                        borderTopLeftRadius: 80, borderTopRightRadius: 80,
                        backgroundColor: T.accent + '30',
                        transform: [{ rotate: '-90deg' }],
                    }} />
                </View>
                <Text style={{ fontSize: 32, fontWeight: '900', color: T.accent, marginTop: 8 }}>{porcentaje.toFixed(1)}%</Text>
                <Text style={{ fontSize: 12, color: T.textMuted }}>del mes anterior</Text>
            </View>

            {/* Variación */}
            <View style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                backgroundColor: isPositive ? T.green + '15' : T.red + '15',
                paddingVertical: 10, borderRadius: 12,
                marginBottom: 16,
            }}>
                <Icon name={isPositive ? 'trending-up' : 'trending-down'} size={20} color={isPositive ? T.green : T.red} />
                <Text style={{ fontSize: 16, fontWeight: '700', color: isPositive ? T.green : T.red }}>
                    {isPositive ? '+' : ''}{variacion.toFixed(0)}%
                </Text>
                <Text style={{ fontSize: 12, color: T.textSecondary }}>vs mes anterior</Text>
            </View>

            {/* Detalle meses */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 12, padding: 12, alignItems: 'center' }}>
                    <Text style={{ fontSize: 11, color: T.textMuted }}>Mes A</Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: T.textPrimary }}>S/ {(mesA.ventas ?? 0).toLocaleString()}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 12, padding: 12, alignItems: 'center' }}>
                    <Text style={{ fontSize: 11, color: T.textMuted }}>Mes B</Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: T.textPrimary }}>S/ {(mesB.ventas ?? 0).toLocaleString()}</Text>
                </View>
            </View>
        </View>
    );
}
