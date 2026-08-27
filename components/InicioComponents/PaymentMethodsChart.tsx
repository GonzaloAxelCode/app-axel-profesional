import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle, G } from 'react-native-svg';

interface MetodoPago {
    metodo: string;
    cantidad: number;
    total: number;
}

const COLORS = ['#10B981', '#8B5CF6', '#3B82F6', '#F59E0B', '#EF4444', '#EC4899'];
const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

interface PaymentMethodsChartProps {
    methods: MetodoPago[];
    selectedMonth?: number;
    selectedYear?: number;
    onMonthChange?: (month: number, year: number) => void;
}

function PickerModal({ visible, title, items, selected, onSelect, onClose, T }: any) {
    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <TouchableOpacity
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={{
                    width: '100%', maxWidth: 300,
                    backgroundColor: T.surface, borderRadius: 20, padding: 20,
                }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 16, textAlign: 'center' }}>
                        {title}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                        {items.map((item: any) => {
                            const isActive = selected === item.value;
                            return (
                                <TouchableOpacity
                                    key={item.value}
                                    onPress={() => { onSelect(item.value); onClose(); }}
                                    style={{
                                        paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
                                        backgroundColor: isActive ? T.accent : T.surfaceAlt,
                                        borderWidth: 1, borderColor: isActive ? T.accent : T.border,
                                        minWidth: 60, alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 13, fontWeight: isActive ? '700' : '500', color: isActive ? T.bg : T.textPrimary }}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

export default function PaymentMethodsChart({ methods, selectedMonth, selectedYear, onMonthChange }: PaymentMethodsChartProps) {
    const { T } = useAppTheme();
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    const currentMonth = selectedMonth ?? new Date().getMonth();
    const currentYear = selectedYear ?? new Date().getFullYear();

    if (!methods || methods.length === 0) {
        return (
            <View style={{
                backgroundColor: T.surface, borderRadius: 16, padding: 20,
                borderWidth: 1, borderColor: T.border, alignItems: 'center',
            }}>
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Sin datos de métodos de pago</Text>
            </View>
        );
    }

    // Usar cantidad de transacciones (igual que la web)
    const totalTransacciones = methods.reduce((sum, m) => sum + m.cantidad, 0);
    const totalSoles = methods.reduce((sum, m) => sum + m.total, 0);
    const size = 180;
    const strokeWidth = 32;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Calcular segmentos correctamente
    const segments: { color: string; dasharray: string; dashoffset: number }[] = [];
    let currentOffset = 0;

    methods.forEach((m, i) => {
        const pct = totalTransacciones > 0 ? (m.cantidad / totalTransacciones) : 0;
        const segmentLength = pct * circumference;
        const gap = 2; // Pequeño gap entre segmentos
        const adjustedLength = Math.max(0, segmentLength - gap);

        segments.push({
            color: COLORS[i % COLORS.length],
            dasharray: `${adjustedLength} ${circumference - adjustedLength}`,
            dashoffset: -currentOffset,
        });

        currentOffset += segmentLength;
    });

    return (
        <View style={{
            backgroundColor: T.surface, borderRadius: 16, padding: 18,
            borderWidth: 1, borderColor: T.border,
        }}>
            {/* Header con selectores */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary }}>
                    Métodos de Pago
                </Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity
                        onPress={() => setShowMonthPicker(true)}
                        style={{
                            flexDirection: 'row', alignItems: 'center', gap: 4,
                            backgroundColor: T.surfaceAlt, paddingHorizontal: 10, paddingVertical: 6,
                            borderRadius: 10, borderWidth: 1, borderColor: T.border,
                        }}
                    >
                        <Text style={{ fontSize: 13, color: T.textPrimary, fontWeight: '600' }}>
                            {MONTHS_SHORT[currentMonth]}
                        </Text>
                        <Icon name="chevron-down" size={14} color={T.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setShowYearPicker(true)}
                        style={{
                            flexDirection: 'row', alignItems: 'center', gap: 4,
                            backgroundColor: T.surfaceAlt, paddingHorizontal: 10, paddingVertical: 6,
                            borderRadius: 10, borderWidth: 1, borderColor: T.border,
                        }}
                    >
                        <Text style={{ fontSize: 13, color: T.textPrimary, fontWeight: '600' }}>
                            {currentYear}
                        </Text>
                        <Icon name="chevron-down" size={14} color={T.textMuted} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Dona SVG */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <View style={{ width: size, height: size, position: 'relative' }}>
                    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                            {segments.map((seg, i) => (
                                <Circle
                                    key={i}
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    stroke={seg.color}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={seg.dasharray}
                                    strokeDashoffset={seg.dashoffset}
                                    fill="transparent"
                                    strokeLinecap="butt"
                                />
                            ))}
                        </G>
                    </Svg>
                    {/* Centro con total */}
                    <View style={{
                        position: 'absolute',
                        top: strokeWidth + 4,
                        left: strokeWidth + 4,
                        right: strokeWidth + 4,
                        bottom: strokeWidth + 4,
                        borderRadius: radius,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={{ fontSize: 22, fontWeight: '900', color: T.textPrimary }}>
                            {totalTransacciones}
                        </Text>
                        <Text style={{ fontSize: 10, color: T.textMuted }}>ventas</Text>
                    </View>
                </View>
            </View>

            {/* Leyenda */}
            <View style={{ gap: 10 }}>
                {methods.map((m, i) => {
                    const pct = totalTransacciones > 0 ? ((m.cantidad / totalTransacciones) * 100).toFixed(0) : '0';
                    return (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                                <View style={{
                                    width: 10, height: 10, borderRadius: 3,
                                    backgroundColor: COLORS[i % COLORS.length],
                                }} />
                                <Text style={{ fontSize: 13, color: T.textPrimary, fontWeight: '500' }} numberOfLines={1}>
                                    {m.metodo}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Text style={{ fontSize: 13, color: T.textSecondary }}>{m.cantidad}</Text>
                                <Text style={{ fontSize: 13, color: T.textPrimary, fontWeight: '700' }}>
                                    S/ {m.total.toFixed(0)}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Modals */}
            <PickerModal
                visible={showMonthPicker}
                title="Seleccionar mes"
                items={MONTHS.map((m, i) => ({ label: m, value: i }))}
                selected={currentMonth}
                onSelect={(m: number) => onMonthChange?.(m, currentYear)}
                onClose={() => setShowMonthPicker(false)}
                T={T}
            />
            <PickerModal
                visible={showYearPicker}
                title="Seleccionar año"
                items={YEARS.map(y => ({ label: String(y), value: y }))}
                selected={currentYear}
                onSelect={(y: number) => onMonthChange?.(currentMonth, y)}
                onClose={() => setShowYearPicker(false)}
                T={T}
            />
        </View>
    );
}
