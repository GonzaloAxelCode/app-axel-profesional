import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const PEDIDOS = [
    { id: 'TK-2001', cliente: 'María García', dni: '12345678', fecha: '19/08/2026', producto: 'iPhone 15 Pro', cantidad: 1, precio: 4500, total: 4500, estado: 'pagado', live: 'Live #1' },
    { id: 'TK-2002', cliente: 'Juan Pérez', dni: '87654321', fecha: '19/08/2026', producto: 'Samsung Galaxy S24', cantidad: 1, precio: 3800, total: 3800, estado: 'enviado', live: 'Live #1' },
    { id: 'TK-2003', cliente: 'Ana López', dni: '11223344', fecha: '18/08/2026', producto: 'Cargador USB-C', cantidad: 2, precio: 45, total: 90, estado: 'entregado', live: 'Live #2' },
    { id: 'TK-2004', cliente: 'Carlos Ruiz', dni: '55667788', fecha: '18/08/2026', producto: 'Funda iPhone 15', cantidad: 3, precio: 35, total: 105, estado: 'pendiente', live: 'Live #2' },
    { id: 'TK-2005', cliente: 'Laura Torres', dni: '99887766', fecha: '17/08/2026', producto: 'AirPods Pro', cantidad: 1, precio: 850, total: 850, estado: 'pagado', live: 'Live #3' },
];

const ESTADO_COLORS: Record<string, { bg: string; text: string }> = {
    pagado: { bg: '#6DFF7A15', text: '#6DFF7A' },
    enviado: { bg: '#3BA7FF15', text: '#3BA7FF' },
    entregado: { bg: '#C6FF0015', text: '#C6FF00' },
    pendiente: { bg: '#FFB02015', text: '#FFB020' },
};

export default function TikTokPedidos() {
    const { T } = useAppTheme();

    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Pedidos por TikTok</Text>

            {PEDIDOS.map((p, i) => {
                const estadoColor = ESTADO_COLORS[p.estado] ?? ESTADO_COLORS.pendiente;
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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                            <View>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: T.accent }}>{p.id}</Text>
                                <Text style={{ fontSize: 12, color: T.textPrimary, marginTop: 2 }}>{p.cliente}</Text>
                                <Text style={{ fontSize: 11, color: T.textMuted }}>DNI: {p.dni}</Text>
                            </View>
                            <View style={{ backgroundColor: estadoColor.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                                <Text style={{ fontSize: 10, fontWeight: '700', color: estadoColor.text }}>{p.estado.toUpperCase()}</Text>
                            </View>
                        </View>

                        <View style={{ backgroundColor: T.surfaceAlt, borderRadius: 10, padding: 12, marginBottom: 10 }}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: T.textPrimary }}>{p.producto}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                <Text style={{ fontSize: 11, color: T.textMuted }}>Cant: {p.cantidad} x S/ {p.precio}</Text>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: T.textPrimary }}>S/ {p.total}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 11, color: T.textMuted }}>{p.fecha}</Text>
                            <Text style={{ fontSize: 11, color: T.textMuted }}>Live: {p.live}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}
