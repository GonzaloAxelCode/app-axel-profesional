import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

const ESTADO_COLORS: Record<string, { bg: string; text: string }> = {
    COTIZADO: { bg: '#3BA7FF15', text: '#3BA7FF' },
    PENDIENTE: { bg: '#FFB02015', text: '#FFB020' },
    REALIZADO: { bg: '#6DFF7A15', text: '#6DFF7A' },
    CANCELADO: { bg: '#FF5A5A15', text: '#FF5A5A' },
};

const PEDIDOS_DEMO = [
    { id: 1, numero_pedido: 'PED-001', fecha_hora: '2026-08-19T10:30:00', metodo_pago: 'YAPE', estado: 'REALIZADO', total: 4500, nombre_cliente: 'María García', telefono_cliente: '999123456', productos: [{ producto_nombre: 'iPhone 15 Pro', cantidad: 1, precio_unitario: 4500 }] },
    { id: 2, numero_pedido: 'PED-002', fecha_hora: '2026-08-19T14:15:00', metodo_pago: 'PLIN', estado: 'PENDIENTE', total: 3800, nombre_cliente: 'Juan Pérez', telefono_cliente: '987654321', productos: [{ producto_nombre: 'Samsung Galaxy S24', cantidad: 1, precio_unitario: 3800 }] },
    { id: 3, numero_pedido: 'PED-003', fecha_hora: '2026-08-18T09:00:00', metodo_pago: 'Efectivo', estado: 'REALIZADO', total: 270, nombre_cliente: 'Ana López', telefono_cliente: '976543210', productos: [{ producto_nombre: 'Funda iPhone 15', cantidad: 3, precio_unitario: 45 }, { producto_nombre: 'Mica Templada', cantidad: 3, precio_unitario: 30 }] },
    { id: 4, numero_pedido: 'PED-004', fecha_hora: '2026-08-17T16:45:00', metodo_pago: 'Transferencia', estado: 'CANCELADO', total: 850, nombre_cliente: 'Carlos Ruiz', telefono_cliente: '965432109', productos: [{ producto_nombre: 'AirPods Pro', cantidad: 1, precio_unitario: 850 }] },
    { id: 5, numero_pedido: 'PED-005', fecha_hora: '2026-08-17T11:20:00', metodo_pago: 'YAPE', estado: 'PENDIENTE', total: 1200, nombre_cliente: 'Laura Torres', telefono_cliente: '954321098', productos: [{ producto_nombre: 'Cargador USB-C', cantidad: 10, precio_unitario: 45 }, { producto_nombre: 'Cable Lightning', cantidad: 10, precio_unitario: 75 }] },
];

export default function PedidosHistorial() {
    const { T } = useAppTheme();
    const [filtroEstado, setFiltroEstado] = useState<string | null>(null);

    const estados = ['Todos', 'COTIZADO', 'PENDIENTE', 'REALIZADO', 'CANCELADO'];

    const pedidosFiltrados = filtroEstado && filtroEstado !== 'Todos'
        ? PEDIDOS_DEMO.filter(p => p.estado === filtroEstado)
        : PEDIDOS_DEMO;

    const formatFecha = (fecha: string) => {
        const d = new Date(fecha);
        const dia = d.getDate().toString().padStart(2, '0');
        const mes = (d.getMonth() + 1).toString().padStart(2, '0');
        const hora = d.getHours().toString().padStart(2, '0');
        const min = d.getMinutes().toString().padStart(2, '0');
        return `${dia}/${mes} ${hora}:${min}`;
    };

    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            {/* Filtros de estado */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
                {estados.map((e) => {
                    const active = (e === 'Todos' && !filtroEstado) || filtroEstado === e;
                    return (
                        <TouchableOpacity
                            key={e}
                            onPress={() => setFiltroEstado(e === 'Todos' ? null : e)}
                            activeOpacity={0.8}
                            style={{
                                paddingHorizontal: 14,
                                paddingVertical: 8,
                                borderRadius: 20,
                                backgroundColor: active ? T.accent : T.surfaceAlt,
                                borderWidth: 1,
                                borderColor: active ? T.accent : T.border,
                            }}
                        >
                            <Text style={{ fontSize: 12, fontWeight: active ? '700' : '500', color: active ? T.bg : T.textSecondary }}>
                                {e}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Contador */}
            <Text style={{ fontSize: 12, color: T.textMuted, marginBottom: 12 }}>
                {pedidosFiltrados.length} pedido{pedidosFiltrados.length !== 1 ? 's' : ''}
            </Text>

            {/* Lista de pedidos */}
            {pedidosFiltrados.map((p, i) => {
                const estadoColor = ESTADO_COLORS[p.estado] ?? ESTADO_COLORS.PENDIENTE;
                return (
                    <View
                        key={i}
                        style={{
                            backgroundColor: T.surface,
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 10,
                            borderWidth: 1,
                            borderColor: T.border,
                        }}
                    >
                        {/* Header */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <View style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    backgroundColor: estadoColor.bg,
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon name="receipt-text-outline" size={18} color={estadoColor.text} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: T.accent }}>{p.numero_pedido}</Text>
                                    <Text style={{ fontSize: 11, color: T.textMuted }}>{formatFecha(p.fecha_hora)}</Text>
                                </View>
                            </View>
                            <View style={{ backgroundColor: estadoColor.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                                <Text style={{ fontSize: 10, fontWeight: '700', color: estadoColor.text }}>{p.estado}</Text>
                            </View>
                        </View>

                        {/* Cliente */}
                        <View style={{ backgroundColor: T.surfaceAlt, borderRadius: 10, padding: 10, marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Icon name="account-outline" size={16} color={T.textMuted} />
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: T.textPrimary }}>{p.nombre_cliente}</Text>
                                </View>
                                <Text style={{ fontSize: 11, color: T.textMuted }}>{p.telefono_cliente}</Text>
                            </View>
                        </View>

                        {/* Productos */}
                        {p.productos.map((prod, j) => (
                            <View key={j} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={{ fontSize: 12, color: T.textSecondary, flex: 1 }} numberOfLines={1}>
                                    {prod.producto_nombre} x{prod.cantidad}
                                </Text>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: T.textPrimary }}>
                                    S/ {(prod.precio_unitario * prod.cantidad).toFixed(2)}
                                </Text>
                            </View>
                        ))}

                        {/* Footer */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: T.border }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Icon name="cash" size={14} color={T.textMuted} />
                                <Text style={{ fontSize: 12, color: T.textSecondary }}>{p.metodo_pago}</Text>
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: T.accent }}>S/ {p.total.toFixed(2)}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}
