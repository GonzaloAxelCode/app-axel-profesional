import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const STATS = {
    ventasTotales: 119,
    ingresosTotales: 9270,
    livesRealizados: 4,
    clientesNuevos: 15,
    productoMasVendido: 'iPhone 15 Pro',
    promedioVenta: 77.90,
    tasaConversion: 18.5,
    crecimientoMensual: 12.3,
};

export default function TikTokEstadisticas() {
    const { T } = useAppTheme();

    const mainStats = [
        { label: 'Ventas Totales', value: String(STATS.ventasTotales), icon: 'cart-outline', color: T.accent },
        { label: 'Ingresos Totales', value: `S/ ${STATS.ingresosTotales.toLocaleString()}`, icon: 'cash-multiple', color: T.green },
        { label: 'Lives Realizados', value: String(STATS.livesRealizados), icon: 'video-outline', color: '#FF0000' },
        { label: 'Clientes Nuevos', value: String(STATS.clientesNuevos), icon: 'account-plus-outline', color: T.blue },
    ];

    const extraStats = [
        { label: 'Producto Más Vendido', value: STATS.productoMasVendido, icon: 'star-outline' },
        { label: 'Promedio por Venta', value: `S/ ${STATS.promedioVenta.toFixed(2)}`, icon: 'chart-line' },
        { label: 'Tasa de Conversión', value: `${STATS.tasaConversion}%`, icon: 'percent' },
        { label: 'Crecimiento Mensual', value: `+${STATS.crecimientoMensual}%`, icon: 'trending-up' },
    ];

    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary }}>Estadísticas</Text>

            {/* Stats principales */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {mainStats.map((s, i) => (
                    <View
                        key={i}
                        style={{
                            width: '48%',
                            backgroundColor: T.surface,
                            borderRadius: 14,
                            padding: 14,
                            borderWidth: 1,
                            borderColor: T.border,
                        }}
                    >
                        <View style={{
                            width: 36, height: 36, borderRadius: 10,
                            backgroundColor: s.color + '18',
                            alignItems: 'center', justifyContent: 'center',
                            marginBottom: 10,
                        }}>
                            <Icon name={s.icon as any} size={18} color={s.color} />
                        </View>
                        <Text style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{s.label}</Text>
                        <Text style={{ fontSize: 18, fontWeight: '900', color: T.textPrimary }}>{s.value}</Text>
                    </View>
                ))}
            </View>

            {/* Stats extra */}
            <View style={{
                backgroundColor: T.surface,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: T.border,
                gap: 12,
            }}>
                {extraStats.map((s, i) => (
                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Icon name={s.icon as any} size={18} color={T.textMuted} />
                            <Text style={{ fontSize: 13, color: T.textSecondary }}>{s.label}</Text>
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: T.textPrimary }}>{s.value}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
