import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

interface CategoriaData {
    nombre: string;
    total_unidades: number;
    total_ingresos: number;
}

const CATEGORY_COLORS = ['#C6FF00', '#6DFF7A', '#3BA7FF', '#FFB020', '#9B6DFF', '#FF5A5A', '#f9a8d4', '#00C9A7'];
const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

interface TopCategoriesChartProps {
    categories: CategoriaData[];
    selectedMonth?: number;
    selectedYear?: number;
    onMonthChange?: (month: number, year: number) => void;
    loading?: boolean;
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

export default function TopCategoriesChart({ categories, selectedMonth, selectedYear, onMonthChange, loading }: TopCategoriesChartProps) {
    const { T } = useAppTheme();
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    const currentMonth = selectedMonth ?? new Date().getMonth();
    const currentYear = selectedYear ?? new Date().getFullYear();

    if (loading) {
        return (
            <View style={{
                backgroundColor: T.surface, borderRadius: 16, padding: 20,
                borderWidth: 1, borderColor: T.border, alignItems: 'center',
            }}>
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Cargando categorías...</Text>
            </View>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <View style={{
                backgroundColor: T.surface, borderRadius: 16, padding: 20,
                borderWidth: 1, borderColor: T.border, alignItems: 'center',
            }}>
                <Icon name="chart-box-outline" size={32} color={T.textMuted} />
                <Text style={{ fontSize: 14, color: T.textSecondary, marginTop: 8 }}>Sin datos de categorías</Text>
                <Text style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>No hay ventas registradas este mes</Text>
            </View>
        );
    }

    const maxIngresos = Math.max(...categories.map(c => c.total_ingresos));

    return (
        <View style={{
            backgroundColor: T.surface, borderRadius: 16, padding: 18,
            borderWidth: 1, borderColor: T.border,
        }}>
            {/* Header con selectores */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary }}>Categorías Más Vendidas</Text>
                    <Text style={{ fontSize: 12, color: T.textMuted }}>Ingresos por categoría</Text>
                </View>
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

            {/* Grid de categorías */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {categories.slice(0, 6).map((cat, i) => {
                    const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                    const pct = maxIngresos > 0 ? (cat.total_ingresos / maxIngresos) * 100 : 0;

                    return (
                        <View
                            key={i}
                            style={{
                                width: '48%',
                                backgroundColor: T.surfaceAlt,
                                borderRadius: 12,
                                padding: 14,
                                borderWidth: 1,
                                borderColor: T.border,
                            }}
                        >
                            {/* Barra de progreso superior */}
                            <View style={{ height: 4, borderRadius: 2, backgroundColor: T.border, marginBottom: 10, overflow: 'hidden' }}>
                                <View style={{ height: 4, borderRadius: 2, backgroundColor: color, width: `${pct}%` }} />
                            </View>

                            <Text style={{ fontSize: 13, fontWeight: '700', color: T.textPrimary, marginBottom: 8 }} numberOfLines={1}>
                                {cat.nombre}
                            </Text>

                            <View style={{ gap: 4 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 11, color: T.textMuted }}>Ingresos</Text>
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: T.textPrimary }}>
                                        S/ {cat.total_ingresos.toLocaleString('es-PE', { minimumFractionDigits: 0 })}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 11, color: T.textMuted }}>Unidades</Text>
                                    <Text style={{ fontSize: 12, fontWeight: '600', color: T.textSecondary }}>
                                        {cat.total_unidades} u.
                                    </Text>
                                </View>
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
