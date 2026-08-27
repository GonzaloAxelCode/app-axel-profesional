import { useAppTheme } from '@/State/context/ThemeContext';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function DailyPeakHours({ data }: { data: any }) {
    const { T } = useAppTheme();

    if (!data || !data.horas || data.horas.length === 0) {
        return (
            <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Sin datos de horas pico</Text>
            </View>
        );
    }

    const horas = data.horas;
    const maxSoles = Math.max(...horas.map((h: any) => h.total_soles));
    const horaPico = data.hora_pico_ventas;

    return (
        <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Hora Pico de Ventas</Text>
            <Text style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Ventas en soles por hora</Text>

            {/* Gráfico de barras */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 100 }}>
                {horas.map((h: any, i: number) => {
                    const heightPct = maxSoles > 0 ? (h.total_soles / maxSoles) * 100 : 0;
                    const height = Math.max(8, heightPct);
                    const isPeak = horaPico && h.hora === horaPico.hora;

                    return (
                        <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                            <View style={{
                                width: '100%',
                                height: height,
                                backgroundColor: isPeak ? T.accent : T.accent + '40',
                                borderRadius: 4,
                            }} />
                        </View>
                    );
                })}
            </View>

            {/* Labels de horas */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                {horas.filter((_: any, i: number) => i % 2 === 0).map((h: any, i: number) => (
                    <Text key={i} style={{ fontSize: 9, color: T.textMuted }}>{h.label}</Text>
                ))}
            </View>

            {/* Hora pico */}
            {horaPico && (
                <View style={{
                    flexDirection: 'row', alignItems: 'center', gap: 8,
                    marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: T.border,
                }}>
                    <Text style={{ fontSize: 12, color: T.textMuted }}>Hora pico:</Text>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: T.accent }}>{horaPico.label}</Text>
                    <Text style={{ fontSize: 12, color: T.textSecondary }}>({horaPico.cantidad_ventas} ventas)</Text>
                </View>
            )}
        </View>
    );
}
