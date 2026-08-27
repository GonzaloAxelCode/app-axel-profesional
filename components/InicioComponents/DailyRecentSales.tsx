import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function DailyRecentSales({ data }: { data: any }) {
    const { T } = useAppTheme();

    if (!data || !data.ventas_recientes || data.ventas_recientes.length === 0) {
        return (
            <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Sin ventas recientes hoy</Text>
            </View>
        );
    }

    const sales = data.ventas_recientes.slice(0, 5);

    return (
        <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Últimas Ventas Realizadas</Text>
            <Text style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Las {sales.length} ventas más recientes</Text>

            <View style={{ gap: 12 }}>
                {sales.map((s: any, i: number) => (
                    <View key={i} style={{
                        backgroundColor: T.surfaceAlt,
                        borderRadius: 12,
                        padding: 14,
                        borderWidth: 1,
                        borderColor: T.border,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 12, fontWeight: '700', color: T.accent }}>{s.numero_comprobante}</Text>
                                <Text style={{ fontSize: 12, color: T.textPrimary, marginTop: 2 }} numberOfLines={1}>{s.cliente}</Text>
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary }}>S/ {s.monto?.toFixed(2)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <Text style={{ fontSize: 11, color: T.textMuted }}>{s.hora}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Icon name="cash" size={12} color={T.textMuted} />
                                <Text style={{ fontSize: 11, color: T.textMuted }}>{s.metodo_pago}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}
