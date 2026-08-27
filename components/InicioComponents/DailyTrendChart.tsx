import { useAppTheme } from '@/State/context/ThemeContext';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface DailyTrend {
    fecha: string;
    total: number;
}

export default function DailyTrendChart({ data }: { data: DailyTrend[] }) {
    const { T } = useAppTheme();

    if (!data || data.length === 0) {
        return (
            <View style={{
                backgroundColor: T.surface,
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: T.border,
                alignItems: 'center',
            }}>
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Sin datos de tendencia</Text>
            </View>
        );
    }

    const maxVal = Math.max(...data.map(d => d.total));
    const minVal = Math.min(...data.map(d => d.total));
    const range = maxVal - minVal || 1;

    return (
        <View style={{
            backgroundColor: T.surface,
            borderRadius: 16,
            padding: 18,
            borderWidth: 1,
            borderColor: T.border,
        }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 16 }}>
                Tendencia Diaria
            </Text>

            {/* Mini chart de barras */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 100 }}>
                {data.slice(-15).map((d, i) => {
                    const heightPct = ((d.total - minVal) / range) * 100;
                    const height = Math.max(8, heightPct);
                    return (
                        <View
                            key={i}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <View style={{
                                width: '100%',
                                height: height,
                                backgroundColor: T.accent,
                                borderRadius: 4,
                                opacity: 0.8,
                            }} />
                        </View>
                    );
                })}
            </View>

            {/* Labels */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ fontSize: 10, color: T.textMuted }}>
                    {data.length > 0 ? data[Math.max(0, data.length - 15)].fecha : ''}
                </Text>
                <Text style={{ fontSize: 10, color: T.textMuted }}>
                    {data.length > 0 ? data[data.length - 1].fecha : ''}
                </Text>
            </View>

            {/* Resumen */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: T.border }}>
                <View>
                    <Text style={{ fontSize: 11, color: T.textMuted }}>Promedio</Text>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: T.textPrimary }}>
                        S/ {(data.reduce((s, d) => s + d.total, 0) / data.length).toFixed(0)}
                    </Text>
                </View>
                <View>
                    <Text style={{ fontSize: 11, color: T.textMuted }}>Máximo</Text>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: T.green }}>
                        S/ {maxVal.toFixed(0)}
                    </Text>
                </View>
                <View>
                    <Text style={{ fontSize: 11, color: T.textMuted }}>Mínimo</Text>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: T.textSecondary }}>
                        S/ {minVal.toFixed(0)}
                    </Text>
                </View>
            </View>
        </View>
    );
}
