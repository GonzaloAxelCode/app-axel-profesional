import { useVentas } from '@/State/hooks/useVentas';
import React, { RefObject, useCallback, useMemo, useState } from 'react';
import { Animated, Dimensions, Easing, FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

// ═══════════════════════════════════════════════════════════════════════════════
// ClienteCard.tsx
// ═══════════════════════════════════════════════════════════════════════════════
import { Cliente } from '@/State/models/cliente.models';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import { ActivityIndicator, Text, TextInput, TouchableRipple } from 'react-native-paper';


// ═══════════════════════════════════════════════════════════════════════════════
// ClientesList.tsx
// ═══════════════════════════════════════════════════════════════════════════════
import { useClientes } from '@/State/hooks/useClientes';




// ═══════════════════════════════════════════════════════════════════════════════
// ConfirmarVentaBtn.tsx
// ═══════════════════════════════════════════════════════════════════════════════
import { useEffect, useRef } from 'react';



// ═══════════════════════════════════════════════════════════════════════════════
// ProductosCard.tsx
// ═══════════════════════════════════════════════════════════════════════════════
import { InventarioCart } from '@/State/models/inventario.models';
import { URLS } from '@/State/utils/endpoints';
import { Image } from 'expo-image';

import ImageViewing from 'react-native-image-viewing';


// ═══════════════════════════════════════════════════════════════════════════════
// ProductosBottomSheet.tsx
// ═══════════════════════════════════════════════════════════════════════════════
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';




// ═══════════════════════════════════════════════════════════════════════════════
// ClienteBottomSheet.tsx
// ═══════════════════════════════════════════════════════════════════════════════
import { useClientes as useClientesHook } from '@/State/hooks/useClientes';
import { C } from '@/State/utils/c';


// ═══════════════════════════════════════════════════════════════════════════════
// VentasUltimos30DiasChart.tsx
// ═══════════════════════════════════════════════════════════════════════════════




// ═══════════════════════════════════════════════════════════════════════════════
// SHARED DESIGN TOKENS — importar desde aquí en todos los componentes
// ═══════════════════════════════════════════════════════════════════════════════


interface ClienteCardProps {
    cliente: Cliente | null;
    onBuscar: () => void;
}

const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const AVATAR_COLORS = [C.accent, '#6ee7b7', '#93c5fd', '#f9a8d4', C.yellow, C.purple];
const getAvatarColor = (seed: string) =>
    AVATAR_COLORS[(seed?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

export function ClienteCard({ cliente, onBuscar }: ClienteCardProps) {
    const hasCliente = cliente && (cliente.fullname !== '' || cliente.document !== '');
    const avatarColor = hasCliente ? getAvatarColor(cliente?.fullname || '') : C.textMuted;

    return (
        <View style={cStyles.card}>
            <View style={cStyles.cardHead}>
                <Text style={cStyles.secLabel}>CLIENTE</Text>
                <TouchableOpacity style={cStyles.secAction} onPress={onBuscar}>
                    <Icon name="magnify" size={12} color={C.bg} />
                    <Text style={cStyles.secActionText}>Buscar</Text>
                </TouchableOpacity>
            </View>

            {hasCliente ? (
                <View style={cStyles.clientRow}>
                    <View style={[cStyles.avatar, { backgroundColor: avatarColor + '20', borderColor: avatarColor + '40', borderWidth: 1.5 }]}>
                        <Text style={[cStyles.avatarText, { color: avatarColor }]}>{initials(cliente?.fullname || '')}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={cStyles.clientName}>{cliente?.fullname}</Text>
                        <Text style={cStyles.prodMeta}>Documento · {cliente?.document}</Text>
                    </View>
                    <View style={cStyles.checkBadge}>
                        <Icon name="check" size={14} color={C.green} />
                    </View>
                </View>
            ) : (
                <View style={cStyles.clientRow}>
                    <View style={[cStyles.avatar, { backgroundColor: C.surfaceAlt, borderColor: C.border, borderWidth: 1 }]}>
                        <Icon name="account-outline" size={18} color={C.textMuted} />
                    </View>
                    <Text style={cStyles.ghostText}>Selecciona un cliente</Text>
                    <Icon name="chevron-right" size={16} color={C.textMuted} />
                </View>
            )}
        </View>
    );
}

const cStyles = StyleSheet.create({
    card: {
        borderRadius: 16,
        backgroundColor: C.surface,
        borderWidth: 0.5,
        borderColor: C.border,
        overflow: 'hidden',
    },
    cardHead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
    },
    secLabel: { fontSize: 10, fontWeight: '800', color: C.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' },
    secAction: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: C.accent, borderRadius: 20,
        paddingHorizontal: 14, paddingVertical: 7,
    },
    secActionText: { fontSize: 13, fontWeight: '700', color: C.bg },
    clientRow: {
        flexDirection: 'row', alignItems: 'center',
        padding: 14, paddingHorizontal: 16, gap: 12,
    },
    avatar: {
        width: 42, height: 42, borderRadius: 13,
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    avatarText: { fontSize: 15, fontWeight: '800' },
    clientName: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
    prodMeta: { fontSize: 12, color: C.textSecondary, marginTop: 2 },
    ghostText: { fontSize: 14, color: C.textMuted, flex: 1 },
    checkBadge: {
        width: 28, height: 28, borderRadius: 8,
        backgroundColor: C.green + '15',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: C.green + '30',
    },
});

interface ClientesListProps {
    search: string;
    onSelect: (cliente: Cliente) => void;
    onResultsChange?: (hasResults: boolean) => void;
}

const LIST_AVATAR_COLORS = [C.accent, '#6ee7b7', '#93c5fd', '#f9a8d4', C.yellow];
const getListAvatarColor = (nombre: string) =>
    LIST_AVATAR_COLORS[(nombre?.charCodeAt(0) ?? 0) % LIST_AVATAR_COLORS.length];

export function ClientesList({ search, onSelect, onResultsChange }: ClientesListProps) {
    const { clientes, loading } = useClientes();

    if (loading) {
        return (
            <View style={lStyles.center}>
                <ActivityIndicator color={C.accent} />
                <Text style={lStyles.loadingText}>Cargando clientes...</Text>
            </View>
        );
    }

    const filtered = clientes.filter((c: Cliente) => {
        const text = search.toLowerCase();
        return (
            c.document.includes(text) ||
            c.fullname?.toLowerCase().includes(text) ||
            c.firstname?.toLowerCase().includes(text)
        );
    });

    onResultsChange?.(filtered.length > 0);

    if (filtered.length === 0) {
        return (
            <View style={lStyles.center}>
                <View style={lStyles.emptyIcon}>
                    <Icon name="account-search-outline" size={28} color={C.textMuted} />
                </View>
                <Text style={lStyles.emptyText}>No hay resultados locales</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Cliente }) => {
        const nombre = item.fullname || item.firstname || '';
        const color = getListAvatarColor(nombre);
        const isRuc = item.document?.length === 11;

        return (
            <TouchableRipple
                onPress={() => onSelect(item)}
                style={lStyles.item}
                rippleColor={C.accent + '15'}
            >
                <View style={lStyles.row}>
                    <View style={[lStyles.avatar, { backgroundColor: color + '18', borderColor: color + '35', borderWidth: 1.5 }]}>
                        <Text style={[lStyles.avatarText, { color }]}>{nombre.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={lStyles.info}>
                        <Text style={lStyles.name} numberOfLines={1}>{nombre}</Text>
                        <Text style={lStyles.doc}>{isRuc ? 'RUC' : 'DNI'}: {item.document}</Text>
                    </View>
                    <Icon name="chevron-right" size={16} color={C.textMuted} />
                </View>
            </TouchableRipple>
        );
    };

    return (
        <FlatList
            data={filtered}
            keyExtractor={(item) => item.document}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
            ItemSeparatorComponent={() => <View style={lStyles.separator} />}
        />
    );
}

const lStyles = StyleSheet.create({
    center: { alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
    loadingText: { fontSize: 14, color: C.textSecondary },
    emptyIcon: {
        width: 60, height: 60, borderRadius: 18,
        backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: C.border,
    },
    emptyText: { fontSize: 14, color: C.textMuted },
    item: { paddingHorizontal: 16, paddingVertical: 12 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 16, fontWeight: '800' },
    info: { flex: 1 },
    name: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
    doc: { fontSize: 12, color: C.textSecondary, marginTop: 2 },
    separator: { height: 1, backgroundColor: C.border, marginLeft: 70 },
});


// ═══════════════════════════════════════════════════════════════════════════════
// ComprobanteCardSelect.tsx
// ═══════════════════════════════════════════════════════════════════════════════
export type ComprobanteMethod = 'Boleta' | 'Factura' | 'Anonima';

const COMPROBANTE_OPTIONS: { key: ComprobanteMethod; label: string; icon: string }[] = [
    { key: 'Boleta', label: 'Boleta', icon: 'receipt' },
    { key: 'Factura', label: 'Factura', icon: 'file-document-outline' },
    { key: 'Anonima', label: 'Anónima', icon: 'account-off-outline' },
];

interface ComprobanteCardProps {
    comprobanteMethod: ComprobanteMethod;
    onSelect: (method: ComprobanteMethod) => void;
}

export function ComprobanteCardSelect({ comprobanteMethod, onSelect }: ComprobanteCardProps) {
    return (
        <View style={compStyles.card}>
            <View style={compStyles.cardHead}>
                <Text style={compStyles.secLabel}>COMPROBANTE</Text>
            </View>
            <View style={compStyles.optRow}>
                {COMPROBANTE_OPTIONS.map((opt) => {
                    const isActive = comprobanteMethod === opt.key;
                    return (
                        <TouchableOpacity
                            key={opt.key}
                            style={[compStyles.opt, isActive && compStyles.optActive]}
                            onPress={() => onSelect(opt.key)}
                            activeOpacity={0.8}
                        >
                            <Icon
                                name={opt.icon as any}
                                size={15}
                                color={isActive ? C.bg : C.textSecondary}
                            />
                            <Text style={[compStyles.optLabel, isActive && compStyles.optLabelActive]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const compStyles = StyleSheet.create({
    card: {
        borderRadius: 16, backgroundColor: C.surface,
        borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    },
    cardHead: {
        padding: 14, paddingHorizontal: 16,
        borderBottomWidth: 1, borderBottomColor: C.border,
    },
    secLabel: { fontSize: 10, fontWeight: '800', color: C.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' },
    optRow: { flexDirection: 'row', gap: 8, padding: 12, paddingHorizontal: 14 },
    opt: {
        flex: 1, paddingVertical: 11, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: C.surfaceAlt,
        borderWidth: 1, borderColor: C.border,
        flexDirection: 'row', gap: 6,
    },
    optActive: { backgroundColor: C.accent, borderColor: C.accent },
    optLabel: { fontSize: 13, fontWeight: '700', color: C.textSecondary },
    optLabelActive: { color: C.bg },
});


// ═══════════════════════════════════════════════════════════════════════════════
// PagoCard.tsx
// ═══════════════════════════════════════════════════════════════════════════════
export type PayMethod = 'Efectivo' | 'PLIN' | 'YAPE';

const PAY_OPTIONS: { key: PayMethod; label: string; icon: string }[] = [
    { key: 'Efectivo', label: 'Efectivo', icon: 'cash' },
    { key: 'PLIN', label: 'PLIN', icon: 'cellphone' },
    { key: 'YAPE', label: 'YAPE', icon: 'qrcode-scan' },
];

interface PagoCardProps {
    payMethod: PayMethod;
    onSelect: (method: PayMethod) => void;
}

export function PagoCard({ payMethod, onSelect }: PagoCardProps) {
    return (
        <View style={pagoStyles.card}>
            <View style={pagoStyles.cardHead}>
                <Text style={pagoStyles.secLabel}>MÉTODO DE PAGO</Text>
            </View>
            <View style={pagoStyles.optRow}>
                {PAY_OPTIONS.map((opt) => {
                    const isActive = payMethod === opt.key;
                    return (
                        <TouchableOpacity
                            key={opt.key}
                            style={[pagoStyles.opt, isActive && pagoStyles.optActive]}
                            onPress={() => onSelect(opt.key)}
                            activeOpacity={0.8}
                        >
                            <Icon
                                name={opt.icon as any}
                                size={16}
                                color={isActive ? C.bg : C.textSecondary}
                            />
                            <Text style={[pagoStyles.optLabel, isActive && pagoStyles.optLabelActive]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const pagoStyles = StyleSheet.create({
    card: {
        borderRadius: 16, backgroundColor: C.surface,
        borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    },
    cardHead: {
        padding: 14, paddingHorizontal: 16,
        borderBottomWidth: 1, borderBottomColor: C.border,
    },
    secLabel: { fontSize: 10, fontWeight: '800', color: C.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' },
    optRow: { flexDirection: 'row', gap: 8, padding: 12, paddingHorizontal: 14 },
    opt: {
        flex: 1, paddingVertical: 11, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: C.surfaceAlt,
        borderWidth: 1, borderColor: C.border,
        flexDirection: 'row', gap: 6,
    },
    optActive: { backgroundColor: C.accent, borderColor: C.accent },
    optLabel: { fontSize: 13, fontWeight: '700', color: C.textSecondary },
    optLabelActive: { color: C.bg },
});


// ═══════════════════════════════════════════════════════════════════════════════
// ResumenCard.tsx
// ═══════════════════════════════════════════════════════════════════════════════
interface ResumenCardProps {
    subtotal: number;
    descuento: number;
    total: number;
    igv: number;
}

export function ResumenCard({ subtotal, descuento, total, igv = 0 }: ResumenCardProps) {
    const descPct = subtotal > 0 ? ((descuento / subtotal) * 100).toFixed(0) : '0';

    return (
        <View style={rStyles.card}>
            <View style={rStyles.cardHead}>
                <Text style={rStyles.secLabel}>RESUMEN</Text>
            </View>
            <View style={rStyles.body}>
                <View style={rStyles.row}>
                    <Text style={rStyles.label}>Subtotal</Text>
                    <Text style={rStyles.value}>S/ {subtotal.toFixed(2)}</Text>
                </View>
                <View style={rStyles.divider} />

                <View style={rStyles.row}>
                    <Text style={rStyles.label}>Descuento</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        {descuento > 0 && (
                            <View style={rStyles.discPill}>
                                <Text style={rStyles.discPct}>{descPct}%</Text>
                            </View>
                        )}
                        <Text style={[rStyles.value, descuento > 0 && { color: C.red }]}>
                            -{' '}S/ {descuento ? descuento.toFixed(2) : '0.00'}
                        </Text>
                    </View>
                </View>
                <View style={rStyles.divider} />

                <View style={rStyles.row}>
                    <Text style={rStyles.label}>IGV (18%)</Text>
                    <Text style={rStyles.value}>S/ {igv.toFixed(2)}</Text>
                </View>

                <View style={rStyles.totalSep} />

                <View style={rStyles.totalRow}>
                    <Text style={rStyles.totalLabel}>Total</Text>
                    <Text style={rStyles.totalValue}>S/ {total.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    );
}

const rStyles = StyleSheet.create({
    card: {
        borderRadius: 16, backgroundColor: C.surface,
        borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    },
    cardHead: {
        padding: 14, paddingHorizontal: 16,
        borderBottomWidth: 1, borderBottomColor: C.border,
    },
    secLabel: { fontSize: 10, fontWeight: '800', color: C.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' },
    body: { padding: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    label: { fontSize: 14, color: C.textSecondary },
    value: { fontSize: 14, fontWeight: '600', color: C.textPrimary },
    divider: { height: 1, backgroundColor: C.border },
    discPill: {
        backgroundColor: C.red + '18', borderRadius: 8,
        paddingHorizontal: 7, paddingVertical: 2,
        borderWidth: 1, borderColor: C.red + '30',
    },
    discPct: { fontSize: 10, fontWeight: '700', color: C.red },
    totalSep: { height: 1, backgroundColor: C.border, marginVertical: 8 },
    totalRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingVertical: 4,
    },
    totalLabel: { fontSize: 15, fontWeight: '800', color: C.textPrimary },
    totalValue: { fontSize: 28, fontWeight: '900', color: C.accent, letterSpacing: -1 },
});

interface ConfirmarVentaBtnProps {
    total: number;
    onConfirmar: () => void;
    loading: boolean;
    disabled: boolean;
}

export function ConfirmarVentaBtn({ total, onConfirmar, loading, disabled }: ConfirmarVentaBtnProps) {
    const spinAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shimmerAnim = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        if (loading) {
            Animated.loop(
                Animated.timing(spinAnim, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true })
            ).start();
        } else {
            spinAnim.stopAnimation();
            spinAnim.setValue(0);
        }
    }, [loading]);

    useEffect(() => {
        if (!loading && !disabled) {
            Animated.loop(
                Animated.timing(shimmerAnim, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
            ).start();
        } else {
            shimmerAnim.stopAnimation();
        }
    }, [loading, disabled]);

    const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.975, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
    const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

    const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    const shimmerTranslate = shimmerAnim.interpolate({ inputRange: [-1, 1], outputRange: [-300, 300] });

    const isOff = loading || disabled;

    return (
        <View style={btnStyles.wrap}>
            <Animated.View style={[btnStyles.outerRing, { transform: [{ scale: scaleAnim }] }]}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onConfirmar}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={isOff}
                    style={[btnStyles.btn, isOff && btnStyles.btnDisabled]}
                >
                    {/* Shimmer sweep */}
                    {!isOff && (
                        <Animated.View
                            style={[btnStyles.shimmer, { transform: [{ translateX: shimmerTranslate }, { rotate: '20deg' }] }]}
                        />
                    )}

                    <View style={btnStyles.left}>
                        <View style={[btnStyles.iconWrap, isOff && btnStyles.iconWrapDisabled]}>
                            {loading ? (
                                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                    <Icon name="loading" size={18} color={C.bg} />
                                </Animated.View>
                            ) : (
                                <Icon name="check-bold" size={18} color={C.bg} />
                            )}
                        </View>
                        <View>
                            <Text style={btnStyles.label}>{loading ? 'Procesando…' : 'Confirmar venta'}</Text>
                            {!loading && <Text style={btnStyles.sublabel}>Toca para finalizar</Text>}
                        </View>
                    </View>

                    <View style={btnStyles.priceWrap}>
                        <Text style={btnStyles.currency}>S/</Text>
                        <Text style={btnStyles.price}>{Number(total).toFixed(2)}</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const btnStyles = StyleSheet.create({
    wrap: { paddingHorizontal: 16, paddingBottom: 38, paddingTop: 10 },
    outerRing: {
        borderRadius: 20,

        shadowColor: C.accent, shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25, shadowRadius: 20, elevation: 12,
        overflow: 'hidden',
    },
    btn: {
        backgroundColor: C.accent, borderRadius: 18,
        paddingVertical: 18, paddingHorizontal: 20,
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', overflow: 'hidden',
    },
    btnDisabled: { backgroundColor: C.surfaceAlt },
    shimmer: {
        position: 'absolute', top: 0, bottom: 0, width: 70,
        backgroundColor: 'rgba(255,255,255,0.2)', zIndex: 0,
    },
    left: { flexDirection: 'row', alignItems: 'center', gap: 14, zIndex: 1 },
    iconWrap: {
        width: 38, height: 38, borderRadius: 12,
        backgroundColor: C.bg + '25',
        alignItems: 'center', justifyContent: 'center',
    },
    iconWrapDisabled: { backgroundColor: C.border },
    label: { fontSize: 16, fontWeight: '800', color: C.bg, letterSpacing: -0.2 },
    sublabel: { fontSize: 11, color: C.bg + 'aa', marginTop: 1, fontWeight: '600' },
    priceWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, zIndex: 1 },
    currency: { fontSize: 14, fontWeight: '700', color: C.bg + 'aa', marginBottom: 3 },
    price: { fontSize: 26, fontWeight: '900', color: C.bg, letterSpacing: -1 },
});

interface ProductosCardProps {
    cart: InventarioCart[];
    onAgregar: () => void;
    onChangeQty: (id: number, delta: number) => void;
    onRemove: (id: number) => void;
    onChangeDiscount: (id: number, discount: number) => void;
}

const getImagenProducto = (producto: InventarioCart) =>
    producto.imagen_producto ? URLS.BASE + producto.imagen_producto : URLS.IMAGE_URL_PLACEHOLDER;

function ProductRow({
    item, onChangeQty, onRemove, onChangeDiscount, onImagePress,
}: {
    item: InventarioCart;
    onChangeQty: (id: number, delta: number) => void;
    onRemove: (id: number) => void;
    onChangeDiscount: (id: number, discount: number) => void;
    onImagePress: (uri: string) => void;
}) {
    const [discountText, setDiscountText] = useState(item.descuento ? String(item.descuento) : '0');
    const subtotal = item.costo_venta * item.cantidad;
    const descuento = parseFloat(discountText) || 0;
    const total = Math.max(0, subtotal - descuento);

    const handleDiscountDelta = (delta: number) => {
        const current = parseFloat(discountText) || 0;
        const maxDiscount = Math.max(0, subtotal - 1);
        const next = Math.max(0, Math.min(maxDiscount, current + delta));
        setDiscountText(next === 0 ? '0' : String(next));
        onChangeDiscount(item.id, next);
    };

    return (
        <View style={pStyles.container}>
            {/* Top: imagen + info + close */}
            <View style={pStyles.topRow}>
                <TouchableOpacity onPress={() => onImagePress(getImagenProducto(item))}>
                    <Image source={{ uri: getImagenProducto(item) }} style={pStyles.image} contentFit="cover" />
                </TouchableOpacity>
                <View style={pStyles.info}>
                    <Text style={pStyles.nombre} numberOfLines={2}>{item.producto_nombre}</Text>
                    {item.producto_sku && (
                        <View style={pStyles.codigoWrap}>
                            <Icon name="barcode" size={12} color={C.textMuted} />
                            <Text style={pStyles.codigo}>{item.producto_sku}</Text>
                        </View>
                    )}
                    <Text style={pStyles.precio}>S/ {item.costo_venta}</Text>
                </View>
                <TouchableOpacity style={pStyles.closeBtn} onPress={() => onRemove(item.id)}>
                    <Icon name="close" size={15} color={C.red} />
                </TouchableOpacity>
            </View>

            {/* Qty + Discount */}
            <View style={pStyles.controlsRow}>
                <View style={pStyles.controlBlock}>
                    <Text style={pStyles.fieldLabel}>Cantidad</Text>
                    <View style={pStyles.stepper}>
                        <TouchableOpacity style={pStyles.stepBtn} onPress={() => onChangeQty(item.id, -1)}>
                            <Icon name="minus" size={14} color={C.textSecondary} />
                        </TouchableOpacity>
                        <Text style={pStyles.stepNum}>{item.cantidad}</Text>
                        <TouchableOpacity style={pStyles.stepBtn} onPress={() => onChangeQty(item.id, 1)}>
                            <Icon name="plus" size={14} color={C.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={pStyles.controlBlock}>
                    <Text style={pStyles.fieldLabel}>Descuento</Text>
                    <View style={pStyles.stepper}>
                        <TouchableOpacity style={pStyles.stepBtn} onPress={() => handleDiscountDelta(-1)}>
                            <Icon name="minus" size={14} color={C.textSecondary} />
                        </TouchableOpacity>
                        <Text style={pStyles.stepNum}>S/ {descuento.toFixed(0)}</Text>
                        <TouchableOpacity style={pStyles.stepBtn} onPress={() => handleDiscountDelta(1)}>
                            <Icon name="plus" size={14} color={C.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Total */}
            <View style={pStyles.totalRow}>
                <Text style={pStyles.totalLabel}>Total</Text>
                <Text style={pStyles.totalValue}>S/ {total.toFixed(2)}</Text>
            </View>
        </View>
    );
}

export function ProductosCard({ cart, onAgregar, onChangeQty, onRemove, onChangeDiscount }: ProductosCardProps) {
    const [imageVisible, setImageVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    return (
        <>
            <View style={prodStyles.card}>
                <View style={prodStyles.cardHead}>
                    <Text style={prodStyles.secLabel}>PRODUCTOS</Text>
                    <TouchableOpacity style={prodStyles.secAction} onPress={onAgregar}>
                        <Icon name="plus" size={12} color={C.bg} />
                        <Text style={prodStyles.secActionText}>Agregar</Text>
                    </TouchableOpacity>
                </View>

                {cart.length === 0 ? (
                    <TouchableOpacity style={prodStyles.ghostRow} onPress={onAgregar} activeOpacity={0.7}>
                        <View style={prodStyles.ghostIcon}>
                            <Icon name="plus" size={16} color={C.textMuted} />
                        </View>
                        <Text style={prodStyles.ghostText}>Toca Agregar para añadir productos</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={prodStyles.list}>
                        {cart.map((item, idx) => (
                            <View key={item.id}>
                                <ProductRow
                                    item={item}
                                    onChangeQty={onChangeQty}
                                    onRemove={onRemove}
                                    onChangeDiscount={onChangeDiscount}
                                    onImagePress={(uri) => { setSelectedImage(uri); setImageVisible(true); }}
                                />
                                {idx < cart.length - 1 && <View style={prodStyles.separator} />}
                            </View>
                        ))}
                    </View>
                )}
            </View>

            <ImageViewing
                images={[{ uri: selectedImage }]}
                imageIndex={0}
                visible={imageVisible}
                onRequestClose={() => setImageVisible(false)}
            />
        </>
    );
}

const prodStyles = StyleSheet.create({
    card: {
        borderRadius: 16, backgroundColor: C.surface,
        borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    },
    cardHead: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 14, paddingHorizontal: 16,
        borderBottomWidth: 1, borderBottomColor: C.border,
    },
    secLabel: { fontSize: 10, fontWeight: '800', color: C.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' },
    secAction: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: C.accent, borderRadius: 20,
        paddingHorizontal: 14, paddingVertical: 7,
    },
    secActionText: { fontSize: 13, fontWeight: '700', color: C.bg },
    ghostRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
    ghostIcon: {
        width: 38, height: 38, borderRadius: 10,
        borderWidth: 1.5, borderColor: C.border, borderStyle: 'dashed',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: C.surfaceAlt,
    },
    ghostText: { fontSize: 14, color: C.textMuted },
    list: { paddingVertical: 4 },
    separator: { height: 1, backgroundColor: C.border, marginHorizontal: 16 },
});

const pStyles = StyleSheet.create({
    container: { padding: 14, gap: 12 },
    topRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    image: { width: 68, height: 68, borderRadius: 12, backgroundColor: C.surfaceAlt },
    info: { flex: 1, gap: 3 },
    nombre: { fontSize: 14, fontWeight: '700', color: C.textPrimary, lineHeight: 19 },
    codigoWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    codigo: { fontSize: 11, color: C.textMuted },
    precio: { fontSize: 13, fontWeight: '700', color: C.accent },
    closeBtn: {
        width: 30, height: 30, borderRadius: 9,
        backgroundColor: C.red + '12',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: C.red + '25',
    },
    controlsRow: { flexDirection: 'row', gap: 10 },
    controlBlock: { flex: 1, gap: 6 },
    fieldLabel: { fontSize: 10, fontWeight: '700', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
    stepper: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: C.surfaceAlt, borderRadius: 12,
        borderWidth: 1, borderColor: C.border,
        paddingHorizontal: 10, paddingVertical: 10,
    },
    stepBtn: {
        width: 28, height: 28, borderRadius: 8,
        backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
        alignItems: 'center', justifyContent: 'center',
    },
    stepNum: { fontSize: 14, fontWeight: '700', color: C.textPrimary },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 2 },
    totalLabel: { fontSize: 12, color: C.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
    totalValue: { fontSize: 22, fontWeight: '900', color: C.accent, letterSpacing: -0.5 },
});

type StockStatus = 'in_stock' | 'low_stock' | 'no_stock';

function getStockStatus(cantidad: number): StockStatus {
    if (cantidad === 0) return 'no_stock';
    if (cantidad <= 8) return 'low_stock';
    return 'in_stock';
}

const STOCK_CONFIG: Record<StockStatus, { label: string; color: string }> = {
    in_stock: { label: 'En stock', color: C.green },
    low_stock: { label: 'Stock bajo', color: C.yellow },
    no_stock: { label: 'Agotado', color: C.red },
};

type FilterKey = 'todos' | 'disponible' | 'poco' | 'agotado';
const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'disponible', label: 'En stock' },
    { key: 'poco', label: 'Stock bajo' },
    { key: 'agotado', label: 'Agotados' },
];

interface ProductosBottomSheetProps {
    bottomSheetRef: RefObject<BottomSheet>;
    productos: InventarioCart[];
    isLoading: boolean;
    hasNextPage?: boolean;
    onSelectProducto: (item: InventarioCart) => void;
    loadMore?: () => void;
}

export function ProductosBottomSheet({
    bottomSheetRef, productos, isLoading, hasNextPage = false, onSelectProducto, loadMore,
}: ProductosBottomSheetProps) {
    const snapPoints = useMemo(() => ['100%'], []);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterKey>('todos');
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return productos.filter((p) => {
            const matchSearch = p.producto_nombre.toLowerCase().includes(q) || p.producto_sku.toLowerCase().includes(q);
            const status = getStockStatus(p.cantidad ?? 0);
            const matchFilter =
                activeFilter === 'todos' ||
                (activeFilter === 'disponible' && status === 'in_stock') ||
                (activeFilter === 'poco' && status === 'low_stock') ||
                (activeFilter === 'agotado' && status === 'no_stock');
            return matchSearch && matchFilter;
        });
    }, [productos, search, activeFilter]);

    const handleEndReached = useCallback(async () => {
        if (isFetchingMore || isLoading || !hasNextPage || !loadMore) return;
        setIsFetchingMore(true);
        try { await loadMore(); } finally { setIsFetchingMore(false); }
    }, [isFetchingMore, isLoading, hasNextPage, loadMore]);

    const renderItem = useCallback(({ item }: { item: InventarioCart }) => {
        const status = getStockStatus(item.cantidad ?? 0);
        const cfg = STOCK_CONFIG[status];
        const venta = item.costo_venta ?? 0;
        const compra = item.costo_compra ?? 0;
        const ganancia = venta - compra;
        const margen = venta > 0 ? Math.round(((venta - compra) / venta) * 100) : 0;

        return (
            <TouchableOpacity
                activeOpacity={0.85}
                style={bsStyles.card}
                onPress={() => { bottomSheetRef.current?.close(); onSelectProducto(item); }}
            >
                <Image source={{ uri: item.imagen_producto ? URLS.BASE + item.imagen_producto : URLS.IMAGE_URL_PLACEHOLDER }}
                    style={bsStyles.cardImage} contentFit="cover" />
                <View style={bsStyles.cardBody}>
                    <View style={bsStyles.row}>
                        <Text style={bsStyles.cardName} numberOfLines={2}>{item.producto_nombre}</Text>
                        <View style={[bsStyles.stockBadge, { backgroundColor: cfg.color + '15', borderColor: cfg.color + '30' }]}>
                            <Text style={[bsStyles.stockText, { color: cfg.color }]}>{cfg.label}</Text>
                        </View>
                    </View>
                    <Text style={bsStyles.cardSku}>SKU: {item.producto_sku}{item.categoria_nombre ? ` · ${item.categoria_nombre}` : ''}</Text>
                    <View style={[bsStyles.row, { marginTop: 6 }]}>
                        <Text style={bsStyles.cardPrice}>S/ {venta}</Text>
                    </View>
                    <View style={bsStyles.divider} />
                    <View style={bsStyles.statsRow}>
                        {[
                            { label: 'Stock', value: String(item.cantidad ?? 0) },
                            { label: 'Compra', value: `S/ ${compra}` },
                            { label: 'Ganancia', value: `S/ ${ganancia}` },
                            { label: 'Margen', value: `${margen}%` },
                        ].map(({ label, value }) => (
                            <View key={label} style={bsStyles.statCell}>
                                <Text style={bsStyles.statLabel}>{label}</Text>
                                <Text style={bsStyles.statValue}>{value}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }, [bottomSheetRef, onSelectProducto]);

    const ListHeader = useMemo(() => (
        <>
            <View style={bsStyles.headerRow}>
                <Text style={bsStyles.title}>Seleccionar producto</Text>
                <View style={bsStyles.countBadge}>
                    <Text style={bsStyles.countText}>{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</Text>
                </View>
            </View>
            <View style={bsStyles.searchWrap}>
                <Icon name="magnify" size={16} color={C.textMuted} style={{ marginRight: 4 }} />
                <TextInput
                    placeholder="Buscar por nombre o SKU..."
                    placeholderTextColor={C.textMuted}
                    value={search}
                    onChangeText={setSearch}
                    style={bsStyles.searchInput}
                />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={bsStyles.filterScroll}>
                {FILTERS.map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        onPress={() => setActiveFilter(f.key)}
                        style={[bsStyles.filterTab, activeFilter === f.key && bsStyles.filterTabActive]}
                    >
                        <Text style={[bsStyles.filterTabText, activeFilter === f.key && bsStyles.filterTabTextActive]}>{f.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Text style={bsStyles.sectionLabel}>{search || activeFilter !== 'todos' ? 'Resultados' : 'Catálogo'}</Text>
        </>
    ), [filtered.length, search, activeFilter]);

    useEffect(() => { bottomSheetRef.current?.snapToIndex(0); }, []);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: C.bg }}
            handleIndicatorStyle={{ backgroundColor: C.border }}
        >
            <BottomSheetFlatList
                data={filtered}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={[bsStyles.sheetContent, { minHeight: '100%' }]}
                showsVerticalScrollIndicator={false}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={ListHeader}
                ListFooterComponent={isFetchingMore ? <ActivityIndicator color={C.accent} style={{ padding: 16 }} /> : null}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                        <Text style={{ color: C.textMuted, fontSize: 14 }}>
                            {isLoading ? 'Cargando...' : 'No se encontraron productos'}
                        </Text>
                    </View>
                }
                removeClippedSubviews
                maxToRenderPerBatch={10}
                windowSize={5}
                initialNumToRender={10}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
        </BottomSheet>
    );
}

const bsStyles = StyleSheet.create({
    sheetContent: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 4 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, marginTop: 8 },
    title: { fontSize: 18, fontWeight: '700', color: C.textPrimary },
    countBadge: {
        backgroundColor: C.surfaceAlt, borderRadius: 20,
        paddingHorizontal: 10, paddingVertical: 4,
        borderWidth: 1, borderColor: C.border,
    },
    countText: { fontSize: 12, color: C.textSecondary },
    searchWrap: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: C.surface, borderRadius: 12,
        paddingHorizontal: 12, paddingVertical: 2,
        marginBottom: 12, borderWidth: 1, borderColor: C.border,
    },
    searchInput: { flex: 1, fontSize: 14, color: C.textPrimary, paddingVertical: 10 },
    filterScroll: { gap: 8, paddingBottom: 12 },
    filterTab: {
        borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
        borderWidth: 1, borderColor: C.border, backgroundColor: C.surface,
    },
    filterTabActive: { backgroundColor: C.accent, borderColor: C.accent },
    filterTabText: { fontSize: 13, fontWeight: '600', color: C.textSecondary },
    filterTabTextActive: { color: C.bg },
    sectionLabel: {
        fontSize: 10, color: C.textMuted, textTransform: 'uppercase',
        letterSpacing: 1, marginBottom: 8, fontWeight: '700',
    },
    card: {
        flexDirection: 'row', backgroundColor: C.surface,
        borderRadius: 14, overflow: 'hidden',
        borderWidth: 1, borderColor: C.border,
    },
    cardImage: { width: 88, height: '100%' as any, minHeight: 90 },
    cardBody: { flex: 1, padding: 10 },
    row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
    cardName: { flex: 1, fontSize: 13, fontWeight: '700', color: C.textPrimary, lineHeight: 18 },
    cardSku: { fontSize: 11, color: C.textMuted, marginTop: 3, letterSpacing: 0.3 },
    cardPrice: { fontSize: 15, fontWeight: '800', color: C.accent },
    stockBadge: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 1 },
    stockText: { fontSize: 10, fontWeight: '700' },
    divider: { height: 1, backgroundColor: C.border, marginVertical: 7 },
    statsRow: { flexDirection: 'row' },
    statCell: { flex: 1 },
    statLabel: { fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
    statValue: { fontSize: 11, fontWeight: '700', color: C.textSecondary, marginTop: 1 },
});

type ClienteFilterKey = 'dni' | 'ruc';

interface ClienteBottomSheetProps {
    bottomSheetRef: RefObject<BottomSheet>;
    onClienteEncontrado: (cliente: Partial<Cliente>) => void;
    tipodoc: string;
}

export function ClienteBottomSheet({ bottomSheetRef, onClienteEncontrado, tipodoc }: ClienteBottomSheetProps) {
    const snapPoints = useMemo(() => ['100%'], []);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState<ClienteFilterKey>(tipodoc === 'ruc' ? 'ruc' : 'dni');
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isSearchingApi, setIsSearchingApi] = useState(false);

    const { clientes, loading, getClienteByDocument } = useClientesHook();

    useEffect(() => {
        if (tipodoc === 'dni' || tipodoc === 'ruc') setActiveFilter(tipodoc);
    }, [tipodoc]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return clientes.filter((c: Cliente) => {
            const nombre = c.fullname || c.firstname || '';
            const matchSearch = c.document?.includes(q) || nombre.toLowerCase().includes(q);
            const matchFilter =
                (activeFilter === 'dni' && c.document?.length === 8) ||
                (activeFilter === 'ruc' && c.document?.length === 11);
            return matchSearch && matchFilter;
        });
    }, [clientes, search, activeFilter]);

    const handleBuscarAPI = useCallback(async () => {
        if (!search || search.length < 8) return;
        try {
            setIsSearchingApi(true);
            const data: any = await getClienteByDocument(search);
            if (data?.nombre_completo || data?.nombre_o_razon_social) {
                const clienteNormalizado: Partial<Cliente> = {
                    fullname: data.nombre_o_razon_social || data.nombre_completo || '',
                    document: data.numero || '',
                };
                onClienteEncontrado(clienteNormalizado);
                bottomSheetRef.current?.close();
                setSearch('');
            }
        } catch { console.log('No encontrado en API'); }
        finally { setIsSearchingApi(false); }
    }, [search, getClienteByDocument, onClienteEncontrado, bottomSheetRef]);

    const renderItem = useCallback(({ item }: { item: Cliente }) => {
        const nombre = item.fullname || item.firstname || '';
        const isRuc = item.document?.length === 11;
        const color = AVATAR_COLORS[(nombre?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

        return (
            <TouchableOpacity
                activeOpacity={0.85}
                style={cbStyles.card}
                onPress={() => {
                    onClienteEncontrado({
                        fullname: item.fullname || `${item.lastname || ''} ${item.firstname || ''}`.trim(),
                        document: item.document,
                    });
                    bottomSheetRef.current?.close();
                }}
            >
                <View style={[cbStyles.avatar, { backgroundColor: color + '18', borderColor: color + '35', borderWidth: 1.5 }]}>
                    <Text style={[cbStyles.avatarText, { color }]}>{getInitials(nombre) || '?'}</Text>
                </View>
                <View style={cbStyles.cardBody}>
                    <View style={cbStyles.row}>
                        <Text style={cbStyles.cardName} numberOfLines={1}>{nombre || 'Sin nombre'}</Text>
                        <View style={[cbStyles.badge, { backgroundColor: isRuc ? C.purple + '15' : C.green + '15', borderColor: isRuc ? C.purple + '30' : C.green + '30' }]}>
                            <Text style={[cbStyles.badgeText, { color: isRuc ? C.purple : C.green }]}>{isRuc ? 'RUC' : 'DNI'}</Text>
                        </View>
                    </View>
                    <Text style={cbStyles.cardDoc}>{isRuc ? 'RUC' : 'DNI'}: {item.document}</Text>
                </View>
                <Icon name="chevron-right" size={16} color={C.textMuted} />
            </TouchableOpacity>
        );
    }, [bottomSheetRef, onClienteEncontrado]);

    const ListHeader = useMemo(() => (
        <>
            <View style={cbStyles.headerRow}>
                <Text style={cbStyles.title}>Buscar cliente</Text>
                <View style={cbStyles.countBadge}>
                    <Text style={cbStyles.countText}>{filtered.length} cliente{filtered.length !== 1 ? 's' : ''}</Text>
                </View>
            </View>
            <View style={cbStyles.filterRow}>
                {[{ key: 'dni' as ClienteFilterKey, label: 'DNI' }, { key: 'ruc' as ClienteFilterKey, label: 'RUC' }].map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        onPress={() => setActiveFilter(f.key)}
                        style={[cbStyles.filterTab, activeFilter === f.key && cbStyles.filterTabActive]}
                    >
                        <Text style={[cbStyles.filterTabText, activeFilter === f.key && cbStyles.filterTabTextActive]}>{f.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={cbStyles.searchWrap}>
                <Icon name="magnify" size={16} color={C.textMuted} />
                <TextInput
                    placeholder={`Buscar por nombre o ${activeFilter.toUpperCase()}...`}
                    placeholderTextColor={C.textMuted}
                    value={search}
                    onChangeText={setSearch}
                    style={cbStyles.searchInput}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Icon name="close-circle" size={16} color={C.textMuted} />
                    </TouchableOpacity>
                )}
            </View>
            {filtered.length === 0 && search.length >= 8 && (
                <TouchableOpacity
                    style={[cbStyles.apiButton, isSearchingApi && { opacity: 0.6 }]}
                    onPress={handleBuscarAPI}
                    disabled={isSearchingApi}
                >
                    {isSearchingApi ? <ActivityIndicator size="small" color={C.bg} /> : <Icon name="magnify" size={16} color={C.bg} />}
                    <Text style={cbStyles.apiButtonText}>{isSearchingApi ? 'Buscando...' : 'Buscar en SUNAT / API'}</Text>
                </TouchableOpacity>
            )}
            <Text style={cbStyles.sectionLabel}>Resultados</Text>
        </>
    ), [filtered.length, search, activeFilter, isSearchingApi]);

    useEffect(() => { bottomSheetRef.current?.snapToIndex(0); }, []);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: C.bg }}
            handleIndicatorStyle={{ backgroundColor: C.border }}
        >
            <BottomSheetFlatList
                data={filtered}
                keyExtractor={(item: any) => item.document}
                renderItem={renderItem}
                contentContainerStyle={[cbStyles.sheetContent, { minHeight: '100%' }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                        <Text style={{ color: C.textMuted, fontSize: 14 }}>
                            {loading ? 'Cargando clientes...' : 'No se encontraron clientes'}
                        </Text>
                    </View>
                }
                removeClippedSubviews
                maxToRenderPerBatch={10}
                windowSize={5}
                initialNumToRender={10}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
                android_keyboardInputMode="adjustResize"
            />
        </BottomSheet>
    );
}

const getInitials = (nombre: string) =>
    nombre.trim().split(' ').slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('');

const cbStyles = StyleSheet.create({
    sheetContent: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 4 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, marginTop: 8 },
    title: { fontSize: 18, fontWeight: '700', color: C.textPrimary },
    countBadge: {
        backgroundColor: C.surfaceAlt, borderRadius: 20,
        paddingHorizontal: 10, paddingVertical: 4,
        borderWidth: 1, borderColor: C.border,
    },
    countText: { fontSize: 12, color: C.textSecondary },
    filterRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    filterTab: {
        borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8,
        borderWidth: 1, borderColor: C.border, backgroundColor: C.surface,
    },
    filterTabActive: { backgroundColor: C.accent, borderColor: C.accent },
    filterTabText: { fontSize: 13, fontWeight: '600', color: C.textSecondary },
    filterTabTextActive: { color: C.bg },
    searchWrap: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: C.surface, borderRadius: 12,
        paddingHorizontal: 12, paddingVertical: 2,
        marginBottom: 12, borderWidth: 1, borderColor: C.border,
    },
    searchInput: { flex: 1, fontSize: 14, color: C.textPrimary, paddingVertical: 10 },
    apiButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: C.accent, borderRadius: 12,
        paddingVertical: 13, marginBottom: 12,
    },
    apiButtonText: { color: C.bg, fontSize: 14, fontWeight: '700' },
    sectionLabel: { fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700', marginBottom: 8 },
    card: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: C.surface, borderRadius: 14,
        padding: 12,
    },
    avatar: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    avatarText: { fontSize: 16, fontWeight: '800' },
    cardBody: { flex: 1 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    cardName: { flex: 1, fontSize: 14, fontWeight: '700', color: C.textPrimary },
    cardDoc: { fontSize: 11, color: C.textSecondary, marginTop: 3 },
    badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
    badgeText: { fontSize: 10, fontWeight: '700' },
});

const screenWidth = Dimensions.get('window').width;

export const VentasUltimos30DiasChart = () => {
    const hoy = new Date();
    const { ventasPorRangoFechasTienda } = useVentas();
    const ventas: any[] = [];

    const dias30 = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date(hoy);
        d.setDate(hoy.getDate() - (29 - i));
        return d;
    });

    const ventasPorDia = dias30.map((dia) => {
        const totalDia = ventas
            ? ventas
                .filter((v: any) => {
                    const fecha = new Date(v.fecha_realizacion);
                    return (
                        fecha.getFullYear() === dia.getFullYear() &&
                        fecha.getMonth() === dia.getMonth() &&
                        fecha.getDate() === dia.getDate()
                    );
                })
                .reduce((acc: any, v: any) => acc + v.comprobante.total, 0)
            : 0;
        return {
            date: dia.toLocaleDateString('es-PE', { month: 'short', day: 'numeric' }),
            total: totalDia,
        };
    });

    const labels = ventasPorDia.map((v) => v.date);
    const values = ventasPorDia.map((v) => v.total);

    return (
        <View style={chartStyles.wrap}>
            <View style={chartStyles.header}>
                <Text style={chartStyles.title}>Ventas · últimos 30 días</Text>
                <View style={chartStyles.badge}>
                    <Text style={chartStyles.badgeText}>S/ {values.reduce((a, b) => a + b, 0).toFixed(0)}</Text>
                </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                    data={{ labels, datasets: [{ data: values.length ? values : [0] }] }}
                    width={Math.max(labels.length * 52, screenWidth - 32)}
                    height={200}
                    yAxisLabel="S/"
                    yAxisSuffix=""
                    chartConfig={{
                        backgroundColor: 'transparent',
                        backgroundGradientFrom: C.surface,
                        backgroundGradientTo: C.surface,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(200, 241, 53, ${opacity})`,
                        labelColor: () => C.textMuted,
                        style: { borderRadius: 12 },
                        barPercentage: 0.55,
                        propsForBackgroundLines: { stroke: C.border, strokeWidth: 1 },
                    }}
                    style={{ borderRadius: 12 }}
                    fromZero
                    showValuesOnTopOfBars
                    withInnerLines
                />
            </ScrollView>
        </View>
    );
};

const chartStyles = StyleSheet.create({
    wrap: {
        backgroundColor: C.surface,
        borderRadius: 16,
        borderWidth: 0,
        borderColor: C.border,
        padding: 16,
        overflow: 'hidden',
    },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
    title: { fontSize: 14, fontWeight: '700', color: C.textPrimary },
    badge: {
        backgroundColor: C.accentDim, borderRadius: 10,
        paddingHorizontal: 10, paddingVertical: 4,
        borderWidth: 1, borderColor: C.accent + '30',
    },
    badgeText: { fontSize: 13, fontWeight: '800', color: C.accent },
});