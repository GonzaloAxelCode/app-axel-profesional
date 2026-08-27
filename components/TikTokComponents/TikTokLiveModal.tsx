import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Path, G, Text as SvgText, Circle } from 'react-native-svg';
import { useInventario } from '@/State/hooks/useInventarios';
import { InventarioCart } from '@/State/models/inventario.models';
import { ProductosModal } from '@/components/venta/ProductosModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AVATAR_COLORS = ['#C6FF00', '#6DFF7A', '#3BA7FF', '#FFB020', '#9B6DFF', '#FF5A5A'];

const VENTAS_DEMO = [
    { id: 'TK-V001', cliente: '@maria_lopez_92', productos: [{ nombre: 'Funda iPhone 15 Pro Max', cantidad: 2, precio: 45 }], total: 90, metodoPago: 'YAPE', estado: 'pagado', hora: '20:05' },
    { id: 'TK-V002', cliente: '@carlosram_dev', productos: [{ nombre: 'Mica Templada iPhone 15', cantidad: 3, precio: 18 }], total: 54, metodoPago: 'PLIN', estado: 'pagado', hora: '20:12' },
    { id: 'TK-V003', cliente: '@ana_guti_shop', productos: [{ nombre: 'Funda Silicone MagSafe', cantidad: 1, precio: 52 }], total: 52, metodoPago: 'PLIN', estado: 'pagado', hora: '20:18' },
];

const METODOS_PAGO = ['YAPE', 'PLIN', 'Transferencia BCP', 'Transferencia Interbank', 'Efectivo', 'Tarjeta'];
const FORMAS_PAGO = ['Contraentrega', 'Adelanto 50%', 'Pago 100%', 'Reserva'];
const CANTIDADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

interface LiveModalProps {
    visible: boolean;
    live: any;
    onClose: () => void;
}

export default function TikTokLiveModal({ visible, live, onClose }: LiveModalProps) {
    const { T } = useAppTheme();
    const { productos: inventario } = useInventario();
    const [activeView, setActiveView] = useState<'usuarios' | 'pedido' | 'sorteos' | 'pedidosHoy'>('usuarios');
    const [busquedaCliente, setBusquedaCliente] = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState<{ nombre: string; telefono: string } | null>(null);
    const [metodoPago, setMetodoPago] = useState('YAPE');
    const [formaPago, setFormaPago] = useState('Contraentrega');
    const [showMetodoPicker, setShowMetodoPicker] = useState(false);
    const [showFormaPicker, setShowFormaPicker] = useState(false);

    // Clientes state
    const [clientes, setClientes] = useState([
        { nombre: '@maria_lopez_92', telefono: '999123456' },
        { nombre: '@carlosram_dev', telefono: '998456789' },
        { nombre: '@ana_guti_shop', telefono: '997789123' },
        { nombre: '@pedro_san_01', telefono: '996321654' },
        { nombre: '@lucia_fer_tech', telefono: '995987321' },
        { nombre: '@jorge_mendoza', telefono: '994654987' },
    ]);
    const [showAddUser, setShowAddUser] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const [newPhone, setNewPhone] = useState('');

    // Product selector
    const [showProductSelector, setShowProductSelector] = useState(false);

    // Sorteo
    const [sorteoSeleccionados, setSorteoSeleccionados] = useState<Set<string>>(new Set());
    const [sorteoListo, setSorteoListo] = useState(false);
    const [winner, setWinner] = useState<{ nombre: string; telefono: string } | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const rotationAnim = useRef(new Animated.Value(0)).current;

    // Ventas
    const [ventas, setVentas] = useState(VENTAS_DEMO);
    const [productos, setProductos] = useState<{ nombre: string; cantidad: number; precio: number }[]>([]);

    const clientesFiltrados = busquedaCliente.trim()
        ? clientes.filter(c => c.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) || c.telefono.includes(busquedaCliente))
        : clientes;

    const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
    const totalPedido = productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

    const VIEWS = [
        { key: 'usuarios', label: 'Usuarios', icon: 'account-group' },
        { key: 'pedido', label: 'Nuevo Pedido', icon: 'cart-plus' },
        { key: 'sorteos', label: 'Sorteos', icon: 'star-outline' },
        { key: 'pedidosHoy', label: 'Pedidos Hoy', icon: 'receipt-text-outline' },
    ];

    const handleAddUser = () => {
        if (!newNickname.trim() || !newPhone.trim()) return;
        const nickname = newNickname.startsWith('@') ? newNickname : `@${newNickname}`;
        setClientes(prev => [...prev, { nombre: nickname, telefono: newPhone }]);
        setNewNickname('');
        setNewPhone('');
        setShowAddUser(false);
    };

    const handleSelectProduct = (item: InventarioCart) => {
        const precio = item.costo_venta ?? 0;
        const existente = productos.find(p => p.nombre === item.producto_nombre);
        if (existente) {
            setProductos(prev => prev.map(p => p.nombre === item.producto_nombre ? { ...p, cantidad: p.cantidad + 1 } : p));
        } else {
            setProductos(prev => [...prev, { nombre: item.producto_nombre, cantidad: 1, precio }]);
        }
    };

    const handleSorteoToggle = (nombre: string) => {
        if (sorteoListo) return;
        const next = new Set(sorteoSeleccionados);
        if (next.has(nombre)) next.delete(nombre);
        else next.add(nombre);
        setSorteoSeleccionados(next);
    };

    const handleToggleTodos = () => {
        if (sorteoListo) return;
        if (sorteoSeleccionados.size === clientes.length) {
            setSorteoSeleccionados(new Set());
        } else {
            setSorteoSeleccionados(new Set(clientes.map(c => c.nombre)));
        }
    };

    const handleConfirmarSorteo = () => {
        if (sorteoSeleccionados.size < 2) return;
        setSorteoListo(true);
        setWinner(null);
    };

    const handleGirarRuleta = () => {
        if (isSpinning) return;
        const participantes = clientes.filter(c => sorteoSeleccionados.has(c.nombre));
        if (participantes.length === 0) return;

        setIsSpinning(true);
        setWinner(null);

        const winnerIndex = Math.floor(Math.random() * participantes.length);
        const sectorAngle = 360 / participantes.length;
        const sectorCenter = winnerIndex * sectorAngle + sectorAngle / 2;
        const extraDegrees = (360 - sectorCenter + 360) % 360;
        const totalRotation = 360 * 5 + extraDegrees;

        // Reset to 0 first then animate
        rotationAnim.setValue(0);

        Animated.timing(rotationAnim, {
            toValue: totalRotation,
            duration: 4200,
            useNativeDriver: true,
        }).start(() => {
            setWinner(participantes[winnerIndex]);
            setIsSpinning(false);
        });
    };

    const handleRegistrarPedido = () => {
        if (productos.length === 0) return;
        const ahora = new Date();
        const hora = ahora.getHours().toString().padStart(2, '0') + ':' + ahora.getMinutes().toString().padStart(2, '0');

        setVentas(prev => [{
            id: `TK-V${(3000 + prev.length + 1)}`,
            cliente: clienteSeleccionado?.nombre || 'Cliente TikTok',
            productos,
            total: totalPedido,
            metodoPago,
            estado: 'pagado',
            hora,
        }, ...prev]);

        setProductos([]);
        setClienteSeleccionado(null);
    };

    if (!visible) return null;

    return (
        <Modal visible={visible} animationType="slide" statusBarTranslucent>
            <View style={{ flex: 1, backgroundColor: T.bg }}>
                {/* Header */}
                <View style={{ paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingHorizontal: 20, paddingBottom: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon name="video" size={20} color="#FF0000" />
                            </View>
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: '900', color: T.textPrimary }}>{live?.titulo || 'Live'}</Text>
                                <Text style={{ fontSize: 11, color: T.textMuted }}>{live?.fecha} · {live?.hora}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="close" size={20} color={T.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    {/* Facturación */}
                    <View style={{ alignItems: 'center', marginBottom: 12 }}>
                        <Text style={{ fontSize: 10, color: T.textMuted, letterSpacing: 1 }}>FACTURACIÓN ESTIMADA</Text>
                        <Text style={{ fontSize: 36, fontWeight: '900', color: T.textPrimary }}>S/ {totalVentas.toFixed(2)}</Text>
                    </View>

                    {/* Stats */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.green + '18', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon name="cart-outline" size={18} color={T.green} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary }}>{ventas.length}</Text>
                                <Text style={{ fontSize: 10, color: T.textMuted }}>ventas</Text>
                            </View>
                        </View>
                        <View style={{ width: 1, backgroundColor: T.border }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.amber + '18', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon name="clock-outline" size={18} color={T.amber} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary }}>{live?.fecha}</Text>
                                <Text style={{ fontSize: 10, color: T.textMuted }}>fecha</Text>
                            </View>
                        </View>
                    </View>

                    {/* Tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4, gap: 6 }}>
                        {VIEWS.map((v) => {
                            const focused = activeView === v.key;
                            return (
                                <TouchableOpacity
                                    key={v.key}
                                    onPress={() => setActiveView(v.key as any)}
                                    activeOpacity={0.8}
                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: focused ? T.surface : 'transparent' }}
                                >
                                    <Icon name={v.icon as any} size={16} color={focused ? T.accent : T.textMuted} />
                                    <Text style={{ fontSize: 12, fontWeight: focused ? '700' : '500', color: focused ? T.accent : T.textMuted }}>{v.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Contenido */}
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* VISTA USUARIOS */}
                    {activeView === 'usuarios' && (
                        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Icon name="account-group-outline" size={20} color={T.textMuted} />
                                    <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary }}>Usuarios TikTok</Text>
                                    <Text style={{ fontSize: 12, color: T.textMuted }}>{clientesFiltrados.length}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setShowAddUser(true)}
                                    style={{ backgroundColor: T.accent, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 4 }}
                                >
                                    <Icon name="plus" size={16} color={T.bg} />
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: T.bg }}>Nuevo</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Buscar */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: T.surfaceAlt, borderRadius: 12, paddingHorizontal: 14, marginBottom: 16, height: 44 }}>
                                <Icon name="magnify" size={18} color={T.textMuted} />
                                <TextInput
                                    style={{ flex: 1, marginLeft: 10, fontSize: 14, color: T.textPrimary }}
                                    placeholder="Buscar por nickname o teléfono..."
                                    placeholderTextColor={T.textMuted}
                                    value={busquedaCliente}
                                    onChangeText={setBusquedaCliente}
                                />
                            </View>

                            {clientesFiltrados.map((c, i) => {
                                const isSelected = clienteSeleccionado?.nombre === c.nombre;
                                const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
                                return (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={() => setClienteSeleccionado(isSelected ? null : c)}
                                        activeOpacity={0.8}
                                        style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: isSelected ? T.accent + '10' : T.surface, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: isSelected ? T.accent : T.border }}
                                    >
                                        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: color + '22', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 14, fontWeight: '900', color }}>{c.nombre.replace('@', '').charAt(0).toUpperCase()}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 14, fontWeight: '700', color: T.textPrimary }}>{c.nombre}</Text>
                                            <Text style={{ fontSize: 11, color: T.textMuted }}>WhatsApp: {c.telefono}</Text>
                                        </View>
                                        {isSelected && <Icon name="check-circle" size={20} color={T.accent} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    {/* VISTA NUEVO PEDIDO */}
                    {activeView === 'pedido' && (
                        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary }}>Productos ({productos.length})</Text>
                                <TouchableOpacity
                                    onPress={() => setShowProductSelector(true)}
                                    style={{ backgroundColor: T.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 4 }}
                                >
                                    <Icon name="plus" size={16} color={T.bg} />
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: T.bg }}>Agregar</Text>
                                </TouchableOpacity>
                            </View>

                            {productos.length === 0 ? (
                                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                                    <Icon name="cart-outline" size={40} color={T.textMuted} />
                                    <Text style={{ fontSize: 14, color: T.textSecondary, marginTop: 8 }}>Sin productos</Text>
                                    <Text style={{ fontSize: 12, color: T.textMuted }}>Agrega productos para el pedido</Text>
                                </View>
                            ) : (
                                productos.map((p, i) => (
                                    <View key={i} style={{ backgroundColor: T.surface, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: T.border }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 14, fontWeight: '700', color: T.textPrimary, flex: 1 }} numberOfLines={1}>{p.nombre}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <TouchableOpacity onPress={() => setProductos(prev => prev.map((x, idx) => idx === i ? { ...x, cantidad: Math.max(1, x.cantidad - 1) } : x))}>
                                                    <Icon name="minus-circle-outline" size={22} color={T.textMuted} />
                                                </TouchableOpacity>
                                                <Text style={{ fontSize: 14, fontWeight: '700', color: T.textPrimary, minWidth: 20, textAlign: 'center' }}>{p.cantidad}</Text>
                                                <TouchableOpacity onPress={() => setProductos(prev => prev.map((x, idx) => idx === i ? { ...x, cantidad: x.cantidad + 1 } : x))}>
                                                    <Icon name="plus-circle-outline" size={22} color={T.accent} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => setProductos(prev => prev.filter((_, idx) => idx !== i))}>
                                                    <Icon name="close-circle" size={22} color={T.red} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                                            <Text style={{ fontSize: 12, color: T.textMuted }}>S/ {p.precio} c/u</Text>
                                            <Text style={{ fontSize: 14, fontWeight: '700', color: T.accent }}>S/ {(p.cantidad * p.precio).toFixed(2)}</Text>
                                        </View>
                                    </View>
                                ))
                            )}

                            {/* Cliente */}
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: 14, fontWeight: '800', color: T.textPrimary, marginBottom: 8 }}>Cliente</Text>
                                {clienteSeleccionado ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: T.accent + '10', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: T.accent }}>
                                        <Text style={{ fontSize: 13, fontWeight: '600', color: T.textPrimary }}>{clienteSeleccionado.nombre}</Text>
                                        <TouchableOpacity onPress={() => setClienteSeleccionado(null)}>
                                            <Icon name="close" size={16} color={T.textMuted} />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <Text style={{ fontSize: 12, color: T.textMuted }}>Selecciona un cliente en la pestaña Usuarios</Text>
                                )}
                            </View>

                            {/* Método de pago */}
                            <View style={{ marginTop: 16, flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity
                                    onPress={() => setShowMetodoPicker(true)}
                                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: T.surfaceAlt, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: T.border }}
                                >
                                    <Text style={{ fontSize: 12, color: T.textMuted }}>Método</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: T.textPrimary }}>{metodoPago}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setShowFormaPicker(true)}
                                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: T.surfaceAlt, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: T.border }}
                                >
                                    <Text style={{ fontSize: 12, color: T.textMuted }}>Forma</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: T.textPrimary }}>{formaPago}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Total y Registrar */}
                            {productos.length > 0 && (
                                <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 18, marginTop: 20, borderWidth: 1, borderColor: T.border }}>
                                    <Text style={{ fontSize: 11, color: T.textMuted, letterSpacing: 1 }}>TOTAL DEL PEDIDO</Text>
                                    <Text style={{ fontSize: 32, fontWeight: '900', color: T.accent }}>S/ {totalPedido.toFixed(2)}</Text>
                                    <TouchableOpacity
                                        onPress={handleRegistrarPedido}
                                        style={{ backgroundColor: T.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 12 }}
                                    >
                                        <Text style={{ fontSize: 14, fontWeight: '800', color: T.bg }}>Registrar Pedido</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}

                    {/* VISTA SORTEOS */}
                    {activeView === 'sorteos' && (
                        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Sorteo en Vivo</Text>
                            <Text style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>
                                {sorteoListo ? `${sorteoSeleccionados.size} participantes confirmados` : 'Selecciona participantes (mín. 2)'}
                            </Text>

                            {/* Ruleta SVG */}
                            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                {/* Pointer */}
                                <View style={{ marginBottom: -8, zIndex: 10 }}>
                                    <Svg width={30} height={28} viewBox="0 0 30 28">
                                        <Path d="M15 0 L28 28 L2 28 Z" fill="#FF0000" />
                                    </Svg>
                                </View>

                                {/* Ruleta */}
                                <View style={{ width: 280, height: 280, position: 'relative' }}>
                                    {/* Anillo dorado exterior */}
                                    <View style={{
                                        width: 280, height: 280, borderRadius: 140,
                                        backgroundColor: '#F59E0B',
                                        padding: 6,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        elevation: 8,
                                    }}>
                                        {/* Fondo oscuro */}
                                        <View style={{ flex: 1, borderRadius: 134, backgroundColor: '#1a1a1a', overflow: 'hidden' }}>
                                            {/* SVG Ruleta */}
                                            <Animated.View style={{
                                                flex: 1,
                                                transform: [{
                                                    rotate: rotationAnim.interpolate({
                                                        inputRange: [0, 360],
                                                        outputRange: ['0deg', '360deg'],
                                                    }),
                                                }],
                                            }}>
                                                <Svg width={268} height={268} viewBox="0 0 268 268">
                                                    <G rotation={0} origin="134, 134">
                                                        {(() => {
                                                            const participants = sorteoListo
                                                                ? clientes.filter(c => sorteoSeleccionados.has(c.nombre))
                                                                : clientes;
                                                            const count = participants.length || 1;
                                                            const sectorAngle = 360 / count;
                                                            const colors = ['#FF0000', '#FF7F00', '#FFD700', '#00CC00', '#00CED1', '#0000FF', '#4B0082', '#9400D3', '#FF1493', '#FF69B4'];
                                                            const cx = 134, cy = 134, r = 128;

                                                            return participants.map((c, i) => {
                                                                const startAngle = i * sectorAngle;
                                                                const endAngle = startAngle + sectorAngle;
                                                                const startRad = (startAngle - 90) * Math.PI / 180;
                                                                const endRad = (endAngle - 90) * Math.PI / 180;
                                                                const x1 = cx + r * Math.cos(startRad);
                                                                const y1 = cy + r * Math.sin(startRad);
                                                                const x2 = cx + r * Math.cos(endRad);
                                                                const y2 = cy + r * Math.sin(endRad);
                                                                const largeArc = sectorAngle > 180 ? 1 : 0;
                                                                const color = colors[i % colors.length];

                                                                // Centro del sector para el texto
                                                                const midAngle = startAngle + sectorAngle / 2;
                                                                const midRad = (midAngle - 90) * Math.PI / 180;
                                                                const textR = r * 0.55;
                                                                const tx = cx + textR * Math.cos(midRad);
                                                                const ty = cy + textR * Math.sin(midRad);

                                                                const displayName = c.nombre.replace('@', '').split('_')[0];

                                                                return (
                                                                    <G key={i}>
                                                                        <Path
                                                                            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                                            fill={color}
                                                                            stroke="#1a1a1a"
                                                                            strokeWidth={1}
                                                                        />
                                                                        <SvgText
                                                                            x={tx}
                                                                            y={ty}
                                                                            fill="white"
                                                                            fontSize={12}
                                                                            fontWeight="bold"
                                                                            textAnchor="middle"
                                                                            alignmentBaseline="middle"
                                                                            rotation={midAngle}
                                                                            origin={`${tx}, ${ty}`}
                                                                        >
                                                                            {displayName}
                                                                        </SvgText>
                                                                    </G>
                                                                );
                                                            });
                                                        })()}
                                                    </G>
                                                    {/* Borde interior */}
                                                    <Circle cx={134} cy={134} r={128} fill="none" stroke="#1a1a1a" strokeWidth={2} />
                                                </Svg>
                                            </Animated.View>

                                            {/* Centro - Botón SORTEO */}
                                            <View style={{
                                                position: 'absolute',
                                                top: '50%', left: '50%',
                                                marginTop: -36, marginLeft: -36,
                                                width: 72, height: 72, borderRadius: 36,
                                                backgroundColor: '#F59E0B',
                                                alignItems: 'center', justifyContent: 'center',
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.3,
                                                shadowRadius: 4,
                                                elevation: 4,
                                            }}>
                                                <TouchableOpacity
                                                    onPress={handleGirarRuleta}
                                                    disabled={isSpinning || !sorteoListo || sorteoSeleccionados.size < 2}
                                                    style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 1 }}>
                                                        {isSpinning ? '...' : 'SORTEO'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {sorteoListo && (
                                    <TouchableOpacity onPress={() => { setSorteoListo(false); setWinner(null); }} style={{ marginTop: 8 }}>
                                        <Text style={{ fontSize: 12, color: T.textMuted, textDecorationLine: 'underline' }}>Editar participantes</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Winner display */}
                            {winner && (
                                <View style={{ backgroundColor: T.accent + '15', borderRadius: 16, padding: 16, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: T.accent }}>
                                    <Icon name="star" size={28} color={T.accent} />
                                    <Text style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>Tenemos un ganador!</Text>
                                    <Text style={{ fontSize: 22, fontWeight: '900', color: T.textPrimary, marginTop: 4 }}>{winner.nombre}</Text>
                                    <Text style={{ fontSize: 13, color: T.textSecondary, marginTop: 4 }}>WhatsApp: {winner.telefono}</Text>
                                </View>
                            )}

                            {/* Acciones */}
                            {!sorteoListo && (
                                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                                    <TouchableOpacity onPress={handleToggleTodos} style={{ backgroundColor: T.surfaceAlt, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 }}>
                                        <Text style={{ fontSize: 12, color: T.textSecondary }}>
                                            {sorteoSeleccionados.size === clientes.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleConfirmarSorteo}
                                        disabled={sorteoSeleccionados.size < 2}
                                        style={{ backgroundColor: sorteoSeleccionados.size >= 2 ? T.accent : T.surfaceAlt, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 }}
                                    >
                                        <Text style={{ fontSize: 12, fontWeight: '700', color: sorteoSeleccionados.size >= 2 ? T.bg : T.textMuted }}>
                                            Listo ({sorteoSeleccionados.size})
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Lista de participantes */}
                            <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: T.border }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: T.textPrimary }}>
                                        {sorteoListo ? 'Participantes confirmados' : 'Seleccionar participantes'}
                                    </Text>
                                    <View style={{ backgroundColor: sorteoListo ? T.green + '20' : T.surfaceAlt, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                                        <Text style={{ fontSize: 11, fontWeight: '600', color: sorteoListo ? T.green : T.textSecondary }}>
                                            {sorteoListo ? `${sorteoSeleccionados.size} listos` : `${sorteoSeleccionados.size} de ${clientes.length}`}
                                        </Text>
                                    </View>
                                </View>

                                {clientes.map((c, i) => {
                                    const isSelected = sorteoSeleccionados.has(c.nombre);
                                    const isWinner = winner?.nombre === c.nombre;
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => handleSorteoToggle(c.nombre)}
                                            activeOpacity={0.8}
                                            style={{
                                                flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12,
                                                backgroundColor: isWinner ? T.accent + '15' : isSelected ? T.accent + '08' : 'transparent',
                                                borderRadius: 12, marginBottom: 4,
                                                borderWidth: isWinner ? 1 : 0, borderColor: T.accent,
                                            }}
                                        >
                                            {!sorteoListo && (
                                                <View style={{
                                                    width: 22, height: 22, borderRadius: 6,
                                                    borderWidth: 2,
                                                    borderColor: isSelected ? T.accent : T.textMuted,
                                                    backgroundColor: isSelected ? T.accent : 'transparent',
                                                    alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    {isSelected && <Icon name="check" size={14} color={T.bg} />}
                                                </View>
                                            )}
                                            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] + '22', alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ fontSize: 12, fontWeight: '800', color: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>{c.nombre.replace('@', '').charAt(0).toUpperCase()}</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 13, fontWeight: '600', color: T.textPrimary }}>{c.nombre}</Text>
                                                <Text style={{ fontSize: 10, color: T.textMuted }}>{c.telefono}</Text>
                                            </View>
                                            {isWinner && (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                    <Icon name="trophy" size={14} color={T.accent} />
                                                    <Text style={{ fontSize: 11, fontWeight: '700', color: T.accent }}>Ganador</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* VISTA PEDIDOS HOY */}
                    {activeView === 'pedidosHoy' && (
                        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary }}>Pedidos de Hoy</Text>
                                <View>
                                    <Text style={{ fontSize: 10, color: T.textMuted }}>Total hoy</Text>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: T.accent }}>S/ {totalVentas.toFixed(2)}</Text>
                                </View>
                            </View>

                            {ventas.map((v, i) => (
                                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: T.surface, padding: 14, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: T.border }}>
                                    <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: T.accent + '18', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 12, fontWeight: '800', color: T.accent }}>{v.cliente.replace('@', '').charAt(0).toUpperCase()}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <Text style={{ fontSize: 12, fontWeight: '700', color: T.accent }}>{v.id}</Text>
                                            <View style={{ backgroundColor: T.green + '15', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                                                <Text style={{ fontSize: 9, fontWeight: '700', color: T.green }}>{v.estado}</Text>
                                            </View>
                                        </View>
                                        <Text style={{ fontSize: 11, color: T.textSecondary }}>{v.cliente} · {v.metodoPago}</Text>
                                        <Text style={{ fontSize: 10, color: T.textMuted }}>{v.productos.map(p => `${p.nombre} (x${p.cantidad})`).join(', ')}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: 14, fontWeight: '800', color: T.accent }}>S/ {v.total.toFixed(2)}</Text>
                                        <Text style={{ fontSize: 10, color: T.textMuted }}>{v.hora}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>

                {/* Modal Agregar Usuario */}
                <Modal visible={showAddUser} transparent animationType="fade" statusBarTranslucent>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }} activeOpacity={1} onPress={() => setShowAddUser(false)}>
                        <View style={{ width: '100%', maxWidth: 340, backgroundColor: T.surface, borderRadius: 20, padding: 24 }} onStartShouldSetResponder={() => true}>
                            <Text style={{ fontSize: 18, fontWeight: '800', color: T.textPrimary, marginBottom: 20, textAlign: 'center' }}>Nuevo Usuario TikTok</Text>

                            <Text style={{ fontSize: 11, color: T.textSecondary, letterSpacing: 1, marginBottom: 6 }}>NICKNAME</Text>
                            <View style={{ backgroundColor: T.surfaceAlt, borderRadius: 12, paddingHorizontal: 14, marginBottom: 16, height: 44, justifyContent: 'center' }}>
                                <TextInput
                                    style={{ fontSize: 14, color: T.textPrimary }}
                                    placeholder="@usuario"
                                    placeholderTextColor={T.textMuted}
                                    value={newNickname}
                                    onChangeText={setNewNickname}
                                    autoCapitalize="none"
                                />
                            </View>

                            <Text style={{ fontSize: 11, color: T.textSecondary, letterSpacing: 1, marginBottom: 6 }}>TELÉFONO / WHATSAPP</Text>
                            <View style={{ backgroundColor: T.surfaceAlt, borderRadius: 12, paddingHorizontal: 14, marginBottom: 24, height: 44, justifyContent: 'center' }}>
                                <TextInput
                                    style={{ fontSize: 14, color: T.textPrimary }}
                                    placeholder="999123456"
                                    placeholderTextColor={T.textMuted}
                                    value={newPhone}
                                    onChangeText={setNewPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity
                                    onPress={() => setShowAddUser(false)}
                                    style={{ flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: T.surfaceAlt, alignItems: 'center' }}
                                >
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: T.textSecondary }}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleAddUser}
                                    style={{ flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: T.accent, alignItems: 'center' }}
                                >
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: T.bg }}>Agregar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Modal Selector de Productos - usa el mismo que hacer venta */}
                <ProductosModal
                    visible={showProductSelector}
                    onClose={() => setShowProductSelector(false)}
                    onSelectProducto={handleSelectProduct}
                />

                {/* Pickers */}
                <PickerSimple visible={showMetodoPicker} title="Método de pago" items={METODOS_PAGO} selected={metodoPago} onSelect={setMetodoPago} onClose={() => setShowMetodoPicker(false)} T={T} />
                <PickerSimple visible={showFormaPicker} title="Forma de cobro" items={FORMAS_PAGO} selected={formaPago} onSelect={setFormaPago} onClose={() => setShowFormaPicker(false)} T={T} />
            </View>
        </Modal>
    );
}

function PickerSimple({ visible, title, items, selected, onSelect, onClose, T }: any) {
    if (!visible) return null;
    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }} activeOpacity={1} onPress={onClose}>
                <View style={{ width: '100%', maxWidth: 300, backgroundColor: T.surface, borderRadius: 20, padding: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 16, textAlign: 'center' }}>{title}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                        {items.map((item: string) => {
                            const isActive = selected === item;
                            return (
                                <TouchableOpacity
                                    key={item}
                                    onPress={() => { onSelect(item); onClose(); }}
                                    style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: isActive ? T.accent : T.surfaceAlt, borderWidth: 1, borderColor: isActive ? T.accent : T.border }}
                                >
                                    <Text style={{ fontSize: 13, fontWeight: isActive ? '700' : '500', color: isActive ? T.bg : T.textPrimary }}>{item}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}
