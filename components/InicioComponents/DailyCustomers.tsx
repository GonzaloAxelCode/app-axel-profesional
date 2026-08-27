import { useAppTheme } from '@/State/context/ThemeContext';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function DailyCustomers({ data }: { data: any }) {
    const { T } = useAppTheme();

    if (!data) {
        return (
            <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Sin datos de clientes</Text>
            </View>
        );
    }

    const nuevos = data.clientes_nuevos ?? 0;
    const recurrentes = data.clientes_recurrentes ?? 0;
    const total = nuevos + recurrentes;
    const retencion = data.tasa_retencion ?? 0;

    const pctNuevos = total > 0 ? (nuevos / total) * 100 : 0;
    const pctRecurrentes = total > 0 ? (recurrentes / total) * 100 : 0;

    return (
        <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Clientes Nuevos vs Recurrentes</Text>
            <Text style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Quiénes compraron hoy</Text>

            {/* Barra dividida */}
            <View style={{ height: 16, borderRadius: 8, flexDirection: 'row', overflow: 'hidden', marginBottom: 16 }}>
                <View style={{ width: `${pctNuevos}%`, backgroundColor: '#3BA7FF' }} />
                <View style={{ width: `${pctRecurrentes}%`, backgroundColor: '#C6FF00' }} />
            </View>

            {/* Datos */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 12, padding: 14, alignItems: 'center' }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#3BA7FF', marginBottom: 8 }} />
                    <Text style={{ fontSize: 11, color: T.textMuted }}>Nuevos</Text>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: T.textPrimary }}>{nuevos}</Text>
                    <Text style={{ fontSize: 11, color: T.textSecondary }}>{pctNuevos.toFixed(0)}%</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 12, padding: 14, alignItems: 'center' }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#C6FF00', marginBottom: 8 }} />
                    <Text style={{ fontSize: 11, color: T.textMuted }}>Recurrentes</Text>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: T.textPrimary }}>{recurrentes}</Text>
                    <Text style={{ fontSize: 11, color: T.textSecondary }}>{pctRecurrentes.toFixed(0)}%</Text>
                </View>
            </View>

            {/* Retención */}
            <View style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: T.border,
            }}>
                <Text style={{ fontSize: 12, color: T.textMuted }}>Retención:</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: T.green }}>{retencion}%</Text>
                <Text style={{ fontSize: 12, color: T.textSecondary }}>de clientes son recurrentes</Text>
            </View>
        </View>
    );
}
