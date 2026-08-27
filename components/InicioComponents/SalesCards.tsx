import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, TouchableOpacity, View, FlatList } from 'react-native';
import { Text } from 'react-native-paper';

interface SalesCardsProps {
    hoy: string;
    semana: string;
    mes: string;
    selectedDate?: Date;
    selectedMonth?: number;
    selectedYear?: number;
    onDateChange?: (date: Date) => void;
    onMonthChange?: (month: number, year: number) => void;
}

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

interface PickerModalProps {
    visible: boolean;
    title: string;
    items: { label: string; value: number }[];
    selected: number;
    onSelect: (value: number) => void;
    onClose: () => void;
    T: any;
}

function PickerModal({ visible, title, items, selected, onSelect, onClose, T }: PickerModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <TouchableOpacity
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={{
                    width: '100%',
                    maxWidth: 300,
                    backgroundColor: T.surface,
                    borderRadius: 20,
                    padding: 20,
                }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 16, textAlign: 'center' }}>
                        {title}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                        {items.map((item) => {
                            const isActive = selected === item.value;
                            return (
                                <TouchableOpacity
                                    key={item.value}
                                    onPress={() => { onSelect(item.value); onClose(); }}
                                    style={{
                                        paddingHorizontal: 14,
                                        paddingVertical: 10,
                                        borderRadius: 12,
                                        backgroundColor: isActive ? T.accent : T.surfaceAlt,
                                        borderWidth: 1,
                                        borderColor: isActive ? T.accent : T.border,
                                        minWidth: 60,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 13,
                                        fontWeight: isActive ? '700' : '500',
                                        color: isActive ? T.bg : T.textPrimary,
                                    }}>
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

export default function SalesCards({
    hoy,
    semana,
    mes,
    selectedDate = new Date(),
    selectedMonth,
    selectedYear,
    onDateChange,
    onMonthChange,
}: SalesCardsProps) {
    const { T } = useAppTheme();

    const currentMonth = selectedMonth ?? new Date().getMonth();
    const currentYear = selectedYear ?? new Date().getFullYear();
    const currentDay = selectedDate.getDate();

    const [showDayPicker, setShowDayPicker] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    const handleDaySelect = (day: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(day);
        onDateChange?.(newDate);
    };

    const handleMonthSelect = (month: number) => {
        onMonthChange?.(month, currentYear);
    };

    const handleYearSelect = (year: number) => {
        onMonthChange?.(currentMonth, year);
    };

    return (
        <View style={{ gap: 12 }}>
            {/* Card Día */}
            <View style={{
                backgroundColor: T.surface,
                borderRadius: 16,
                padding: 18,
                borderWidth: 1,
                borderColor: T.border,
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={{
                            width: 40, height: 40, borderRadius: 12,
                            backgroundColor: T.accent + '18',
                            alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Icon name="calendar-today" size={20} color={T.accent} />
                        </View>
                        <Text style={{ fontSize: 14, color: T.textSecondary, fontWeight: '500' }}>
                            Ventas del día
                        </Text>
                    </View>
                    {/* Selector de día */}
                    <TouchableOpacity
                        onPress={() => setShowDayPicker(true)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            backgroundColor: T.surfaceAlt,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: T.border,
                        }}
                    >
                        <Text style={{ fontSize: 13, color: T.textPrimary, fontWeight: '600' }}>
                            {currentDay} {MONTHS_SHORT[currentMonth]}
                        </Text>
                        <Icon name="chevron-down" size={16} color={T.textMuted} />
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 28, fontWeight: '900', color: T.textPrimary, letterSpacing: -1 }}>
                    {hoy}
                </Text>
            </View>

            {/* Card Semana */}
            <View style={{
                backgroundColor: T.surface,
                borderRadius: 16,
                padding: 18,
                borderWidth: 1,
                borderColor: T.border,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <View style={{
                        width: 40, height: 40, borderRadius: 12,
                        backgroundColor: T.accent + '18',
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Icon name="calendar-week" size={20} color={T.accent} />
                    </View>
                    <Text style={{ fontSize: 14, color: T.textSecondary, fontWeight: '500' }}>
                        Ventas de la semana
                    </Text>
                </View>
                <Text style={{ fontSize: 28, fontWeight: '900', color: T.textPrimary, letterSpacing: -1 }}>
                    {semana}
                </Text>
            </View>

            {/* Card Mes */}
            <View style={{
                backgroundColor: T.surface,
                borderRadius: 16,
                padding: 18,
                borderWidth: 1,
                borderColor: T.border,
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={{
                            width: 40, height: 40, borderRadius: 12,
                            backgroundColor: T.accent + '18',
                            alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Icon name="calendar-month" size={20} color={T.accent} />
                        </View>
                        <Text style={{ fontSize: 14, color: T.textSecondary, fontWeight: '500' }}>
                            Ventas mensuales
                        </Text>
                    </View>
                    {/* Selectores de mes y año */}
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                        <TouchableOpacity
                            onPress={() => setShowMonthPicker(true)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                                backgroundColor: T.surfaceAlt,
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: T.border,
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
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                                backgroundColor: T.surfaceAlt,
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: T.border,
                            }}
                        >
                            <Text style={{ fontSize: 13, color: T.textPrimary, fontWeight: '600' }}>
                                {currentYear}
                            </Text>
                            <Icon name="chevron-down" size={14} color={T.textMuted} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ fontSize: 28, fontWeight: '900', color: T.textPrimary, letterSpacing: -1 }}>
                    {mes}
                </Text>
            </View>

            {/* Modals de selección */}
            <PickerModal
                visible={showDayPicker}
                title="Seleccionar día"
                items={DAYS.map(d => ({ label: String(d), value: d }))}
                selected={currentDay}
                onSelect={handleDaySelect}
                onClose={() => setShowDayPicker(false)}
                T={T}
            />
            <PickerModal
                visible={showMonthPicker}
                title="Seleccionar mes"
                items={MONTHS.map((m, i) => ({ label: m, value: i }))}
                selected={currentMonth}
                onSelect={handleMonthSelect}
                onClose={() => setShowMonthPicker(false)}
                T={T}
            />
            <PickerModal
                visible={showYearPicker}
                title="Seleccionar año"
                items={YEARS.map(y => ({ label: String(y), value: y }))}
                selected={currentYear}
                onSelect={handleYearSelect}
                onClose={() => setShowYearPicker(false)}
                T={T}
            />
        </View>
    );
}
