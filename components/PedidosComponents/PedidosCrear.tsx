import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useInventario } from '@/State/hooks/useInventarios';
import { ProductosModal } from '@/components/venta/ProductosModal';
import { InventarioCart } from '@/State/models/inventario.models';

const METODOS_PAGO = ['Efectivo', 'YAPE', 'PLIN', 'Transferencia', 'Tarjeta'];

export default function PedidosCrear() {
    const { T } = useAppTheme();
    const [step, setStep] = useState(1);
    const [productos, setProductos] = useState<InventarioCart[]>([]);
    const [showProductosModal, setShowProductosModal] = useState(false);
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [showMetodoPicker, setShowMetodoPicker] = useState(false);

    // Cliente
    const [nombreCliente, setNombreCliente] = useState('');
    const [dniCliente, setDniCliente] = useState('');
    const [telefonoCliente, setTelefonoCliente] = useState('');
    const [observaciones, setObservaciones] = useState('');

    const subtotal = productos.reduce((acc, p) => acc + (p.costo_venta ?? 0) * (p.cantidad ?? 1), 0);
    const igv = subtotal * 0.18;
    const total = subtotal;

    const handleAddProducto = (item: InventarioCart) => {
        const existente = productos.find(p => p.id === item.id);
        if (existente) {
            setProductos(prev => prev.map(p => p.id === item.id ? { ...p, cantidad: (p.cantidad ?? 1) + 1 } : p));
        } else {
            setProductos(prev => [...prev, { ...item, cantidad: 1 }]);
        }
    };

    const handleRemoveProducto = (id: number) => {
        setProductos(prev => prev.filter(p => p.id !== id));
    };

    const handleChangeQty = (id: number, delta: number) => {
        setProductos(prev => prev.map(p => {
            if (p.id !== id) return p;
            const newQty = Math.max(1, (p.cantidad ?? 1) + delta);
            return { ...p, cantidad: newQty };
        }));
    };

    const handleConfirmar = () => {
        // Aquí se llamaría a createPedido del hook
        // Limpiar formulario
        setProductos([]);
        setNombreCliente('');
        setDniCliente('');
        setTelefonoCliente('');
        setObservaciones('');
        setMetodoPago('Efectivo');
        setStep(1);
    };

    const steps = [
        { num: 1, label: 'Productos', icon: 'package-variant-closed' },
        { num: 2, label: 'Cliente', icon: 'account-outline' },
        { num: 3, label: 'Confirmar', icon: 'check-circle-outline' },
    ];

    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            {/* Stepper */}
            <View style={{ flexDirection: 'row', marginBottom: 24, gap: 4 }}>
                {steps.map((s, i) => {
                    const active = step === s.num;
                    const completed = step > s.num;
                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => setStep(s.num)}
                            activeOpacity={0.8}
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                paddingVertical: 10,
                                borderRadius: 10,
                                backgroundColor: active ? T.accent : completed ? T.green + '15' : T.surfaceAlt,
                            }}
                        >
                            <Icon
                                name={completed ? 'check' : s.icon as any}
                                size={16}
                                color={active ? T.bg : completed ? T.green : T.textMuted}
                            />
                            <Text style={{ fontSize: 11, fontWeight: active ? '700' : '500', color: active ? T.bg : completed ? T.green : T.textMuted }}>
                                {s.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* PASO 1: Productos */}
            {step === 1 && (
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary }}>Productos ({productos.length})</Text>
                        <TouchableOpacity
                            onPress={() => setShowProductosModal(true)}
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
                            <Text style={{ fontSize: 12, color: T.textMuted }}>Agrega productos al pedido</Text>
                        </View>
                    ) : (
                        productos.map((p, i) => (
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: T.surface, padding: 12, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: T.border }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: T.textPrimary }} numberOfLines={1}>{p.producto_nombre}</Text>
                                    <Text style={{ fontSize: 11, color: T.textMuted }}>S/ {p.costo_venta ?? 0} c/u</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <TouchableOpacity onPress={() => handleChangeQty(p.id, -1)}>
                                        <Icon name="minus-circle-outline" size={20} color={T.textMuted} />
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: T.textPrimary, minWidth: 20, textAlign: 'center' }}>{p.cantidad ?? 1}</Text>
                                    <TouchableOpacity onPress={() => handleChangeQty(p.id, 1)}>
                                        <Icon name="plus-circle-outline" size={20} color={T.accent} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: T.accent, minWidth: 60, textAlign: 'right' }}>
                                    S/ {((p.costo_venta ?? 0) * (p.cantidad ?? 1)).toFixed(2)}
                                </Text>
                                <TouchableOpacity onPress={() => handleRemoveProducto(p.id)}>
                                    <Icon name="close-circle" size={20} color={T.red} />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}

                    {productos.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setStep(2)}
                            style={{ backgroundColor: T.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 }}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '700', color: T.bg }}>Siguiente: Cliente</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* PASO 2: Cliente */}
            {step === 2 && (
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 16 }}>Datos del Cliente</Text>

                    <Text style={{ fontSize: 11, color: T.textSecondary, letterSpacing: 1, marginBottom: 6 }}>NOMBRE COMPLETO</Text>
                    <View style={{ backgroundColor: T.surfaceAlt, borderRadius: 12, paddingHorizontal: 14, marginBottom: 12, height: 44, justifyContent: 'center' }}>
                        <TextInput
                            style={{ fontSize: 14, color: T.textPrimary }}
                            placeholder="Nombre del cliente"
                            placeholderTextColor={T.textMuted}
                            value={nombreCliente}
                            onChangeText={setNombreCliente}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 11, color: T.textSecondary, letterSpacing: 1, marginBottom: 6 }}>DNI / RUC</Text>
                            <View style={{ backgroundColor: T.surfaceAlt, borderRadius: 12, paddingHorizontal: 14, height: 44, justifyContent: 'center' }}>
                                <TextInput
                                    style={{ fontSize: 14, color: T.textPrimary }}
                                    placeholder="Documento"
                                    placeholderTextColor={T.textMuted}
                                    value={dniCliente}
                                    onChangeText={setDniCliente}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 11, color: T.textSecondary, letterSpacing: 1, marginBottom: 6 }}>TELÉFONO</Text>
                            <View style={{ backgroundColor: T.surfaceAlt, borderRadius: 12, paddingHorizontal: 14, height: 44, justifyContent: 'center' }}>
                                <TextInput
                                    style={{ fontSize: 14, color: T.textPrimary }}
                                    placeholder="Teléfono"
                                    placeholderTextColor={T.textMuted}
                                    value={telefonoCliente}
                                    onChangeText={setTelefonoCliente}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                    </View>

                    <Text style={{ fontSize: 11, color: T.textSecondary, letterSpacing: 1, marginBottom: 6 }}>OBSERVACIONES</Text>
                    <View style={{ backgroundColor: T.surfaceAlt, borderRadius: 12, paddingHorizontal: 14, marginBottom: 20, height: 80, justifyContent: 'flex-start' }}>
                        <TextInput
                            style={{ fontSize: 14, color: T.textPrimary, textAlignVertical: 'top', paddingTop: 10 }}
                            placeholder="Observaciones del pedido..."
                            placeholderTextColor={T.textMuted}
                            value={observaciones}
                            onChangeText={setObservaciones}
                            multiline
                        />
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity
                            onPress={() => setStep(1)}
                            style={{ flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: T.surfaceAlt, alignItems: 'center' }}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '600', color: T.textSecondary }}>Atrás</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setStep(3)}
                            style={{ flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: T.accent, alignItems: 'center' }}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '700', color: T.bg }}>Siguiente</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* PASO 3: Confirmar */}
            {step === 3 && (
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 16 }}>Confirmar Pedido</Text>

                    {/* Resumen productos */}
                    <View style={{ backgroundColor: T.surface, borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: T.border }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: T.textSecondary, marginBottom: 8 }}>PRODUCTOS ({productos.length})</Text>
                        {productos.map((p, i) => (
                            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={{ fontSize: 12, color: T.textPrimary, flex: 1 }} numberOfLines={1}>
                                    {p.producto_nombre} x{p.cantidad ?? 1}
                                </Text>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: T.textPrimary }}>
                                    S/ {((p.costo_venta ?? 0) * (p.cantidad ?? 1)).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Cliente */}
                    <View style={{ backgroundColor: T.surface, borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: T.border }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: T.textSecondary, marginBottom: 8 }}>CLIENTE</Text>
                        <Text style={{ fontSize: 13, color: T.textPrimary }}>{nombreCliente || 'Cliente Varios'}</Text>
                        {dniCliente ? <Text style={{ fontSize: 11, color: T.textMuted }}>DNI: {dniCliente}</Text> : null}
                        {telefonoCliente ? <Text style={{ fontSize: 11, color: T.textMuted }}>Tel: {telefonoCliente}</Text> : null}
                    </View>

                    {/* Método de pago */}
                    <TouchableOpacity
                        onPress={() => setShowMetodoPicker(true)}
                        style={{ backgroundColor: T.surface, borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: T.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <View>
                            <Text style={{ fontSize: 12, fontWeight: '700', color: T.textSecondary }}>MÉTODO DE PAGO</Text>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: T.textPrimary, marginTop: 4 }}>{metodoPago}</Text>
                        </View>
                                <Icon name="chevron-right" size={20} color={T.textMuted} />
                    </TouchableOpacity>

                    {/* Totales */}
                    <View style={{ backgroundColor: T.surface, borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: T.border }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                            <Text style={{ fontSize: 12, color: T.textSecondary }}>Subtotal</Text>
                            <Text style={{ fontSize: 12, color: T.textPrimary }}>S/ {subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                            <Text style={{ fontSize: 12, color: T.textSecondary }}>IGV (18%)</Text>
                            <Text style={{ fontSize: 12, color: T.textPrimary }}>S/ {igv.toFixed(2)}</Text>
                        </View>
                        <View style={{ height: 1, backgroundColor: T.border, marginVertical: 8 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary }}>Total</Text>
                            <Text style={{ fontSize: 20, fontWeight: '900', color: T.accent }}>S/ {total.toFixed(2)}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity
                            onPress={() => setStep(2)}
                            style={{ flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: T.surfaceAlt, alignItems: 'center' }}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '600', color: T.textSecondary }}>Atrás</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleConfirmar}
                            style={{ flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: T.accent, alignItems: 'center' }}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '700', color: T.bg }}>Confirmar Pedido</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Modal productos */}
            <ProductosModal
                visible={showProductosModal}
                onClose={() => setShowProductosModal(false)}
                onSelectProducto={handleAddProducto}
            />

            {/* Picker método de pago */}
            {showMetodoPicker && (
                <View style={{ marginTop: 16, backgroundColor: T.surfaceAlt, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: T.border }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: T.textSecondary, marginBottom: 8 }}>Seleccionar método</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {METODOS_PAGO.map((m) => (
                            <TouchableOpacity
                                key={m}
                                onPress={() => { setMetodoPago(m); setShowMetodoPicker(false); }}
                                style={{
                                    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
                                    backgroundColor: metodoPago === m ? T.accent : T.surface,
                                    borderWidth: 1, borderColor: metodoPago === m ? T.accent : T.border,
                                }}
                            >
                                <Text style={{ fontSize: 12, fontWeight: metodoPago === m ? '700' : '500', color: metodoPago === m ? T.bg : T.textPrimary }}>{m}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
}
