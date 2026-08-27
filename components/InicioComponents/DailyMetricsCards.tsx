import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface MetricData {
    label: string;
    value: string;
    icon: string;
    color?: string;
}

export default function DailyMetricsCards({ summary }: { summary: any }) {
    const { T } = useAppTheme();

    if (!summary) return null;

    const ticketPromedio = summary.comprobantes_emitidos > 0
        ? (summary.total_ventas / summary.comprobantes_emitidos)
        : 0;

    const metrics: MetricData[] = [
        { label: 'Total Ventas Hoy', value: `S/ ${summary.total_ventas?.toFixed(2) ?? '0.00'}`, icon: 'cash-multiple', color: T.green },
        { label: 'Comprobantes emitidos', value: String(summary.comprobantes_emitidos ?? 0), icon: 'receipt-text-outline', color: T.blue },
        { label: 'Ticket Promedio', value: `S/ ${ticketPromedio.toFixed(2)}`, icon: 'chart-line', color: T.purple },
        { label: 'Clientes Atendidos', value: String(summary.clientes_atendidos ?? 0), icon: 'account-group-outline', color: T.accent },
    ];

    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {metrics.map((m, i) => (
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
                        backgroundColor: (m.color ?? T.accent) + '18',
                        alignItems: 'center', justifyContent: 'center',
                        marginBottom: 10,
                    }}>
                        <Icon name={m.icon as any} size={18} color={m.color ?? T.accent} />
                    </View>
                    <Text style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{m.label}</Text>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: T.textPrimary }}>{m.value}</Text>
                </View>
            ))}
        </View>
    );
}
