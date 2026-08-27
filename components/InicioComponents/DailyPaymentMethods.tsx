import { useAppTheme } from '@/State/context/ThemeContext';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const COLORS = ['#C6FF00', '#6DFF7A', '#3BA7FF', '#FFB020', '#9B6DFF', '#FF5A5A'];

export default function DailyPaymentMethods({ data }: { data: any }) {
    const { T } = useAppTheme();

    if (!data || !data.metodos_pago || data.metodos_pago.length === 0) {
        return (
            <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Sin datos de métodos de pago</Text>
            </View>
        );
    }

    const methods = data.metodos_pago;
    const total = data.total_general_soles ?? 0;

    return (
        <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Métodos de Pago de Hoy</Text>
            <Text style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Cantidad de transacciones por método</Text>

            {/* Barra apilada */}
            <View style={{ height: 12, borderRadius: 6, flexDirection: 'row', overflow: 'hidden', marginBottom: 16 }}>
                {methods.map((m: any, i: number) => {
                    const pct = total > 0 ? (m.total_soles / total) * 100 : 0;
                    return (
                        <View key={i} style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                    );
                })}
            </View>

            {/* Leyenda */}
            <View style={{ gap: 10 }}>
                {methods.map((m: any, i: number) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: COLORS[i % COLORS.length] }} />
                            <Text style={{ fontSize: 13, color: T.textPrimary, fontWeight: '500' }} numberOfLines={1}>{m.metodo_pago}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{ fontSize: 12, color: T.textMuted }}>{m.cantidad_transacciones} trans.</Text>
                            <Text style={{ fontSize: 13, color: T.textPrimary, fontWeight: '700' }}>S/ {m.total_soles?.toFixed(0)}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}
