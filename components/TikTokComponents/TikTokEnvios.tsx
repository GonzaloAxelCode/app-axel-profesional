import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const ENVIOS = [
    { id: 'SH-8001', pedido: 'TK-2001', cliente: 'María García', distrito: 'Miraflores', provincia: 'Lima', destino: 'Av. Larco 123', transportista: 'Shalom', estado: 'en_camino', fechaEnvio: '19/08/2026', fechaEstimada: '21/08/2026', tracking: 'SH2026081901' },
    { id: 'SH-8002', pedido: 'TK-2002', cliente: 'Juan Pérez', distrito: 'San Isidro', provincia: 'Lima', destino: 'Jr. Los Olivos 456', transportista: 'Shalom', estado: 'pendiente', fechaEnvio: '19/08/2026', fechaEstimada: '22/08/2026', tracking: 'SH2026081902' },
    { id: 'SH-8003', pedido: 'TK-2003', cliente: 'Ana López', distrito: 'Surco', provincia: 'Lima', destino: 'Calle Las Flores 789', transportista: 'Shalom', estado: 'entregado', fechaEnvio: '18/08/2026', fechaEstimada: '20/08/2026', tracking: 'SH2026081801' },
];

const ESTADO_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
    en_camino: { bg: '#3BA7FF15', text: '#3BA7FF', icon: 'truck-delivery-outline' },
    pendiente: { bg: '#FFB02015', text: '#FFB020', icon: 'clock-outline' },
    entregado: { bg: '#6DFF7A15', text: '#6DFF7A', icon: 'check-circle-outline' },
};

export default function TikTokEnvios() {
    const { T } = useAppTheme();

    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Envíos Pendientes</Text>

            {ENVIOS.map((e, i) => {
                const estado = ESTADO_COLORS[e.estado] ?? ESTADO_COLORS.pendiente;
                return (
                    <View
                        key={i}
                        style={{
                            backgroundColor: T.surface,
                            borderRadius: 16,
                            padding: 16,
                            borderWidth: 1,
                            borderColor: T.border,
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <View style={{
                                    width: 40, height: 40, borderRadius: 12,
                                    backgroundColor: estado.bg,
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon name={estado.icon as any} size={20} color={estado.text} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: T.textPrimary }}>{e.id}</Text>
                                    <Text style={{ fontSize: 11, color: T.textMuted }}>Pedido: {e.pedido}</Text>
                                </View>
                            </View>
                            <View style={{ backgroundColor: estado.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                                <Text style={{ fontSize: 10, fontWeight: '700', color: estado.text }}>
                                    {e.estado === 'en_camino' ? 'EN CAMINO' : e.estado.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View style={{ backgroundColor: T.surfaceAlt, borderRadius: 10, padding: 12, marginBottom: 10 }}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: T.textPrimary }}>{e.cliente}</Text>
                            <Text style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{e.destino}</Text>
                            <Text style={{ fontSize: 11, color: T.textMuted }}>{e.distrito}, {e.provincia}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={{ fontSize: 10, color: T.textMuted }}>Transportista</Text>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: T.textPrimary }}>{e.transportista}</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 10, color: T.textMuted }}>Tracking</Text>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: T.accent }}>{e.tracking}</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 10, color: T.textMuted }}>Estimada</Text>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: T.textPrimary }}>{e.fechaEstimada}</Text>
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}
