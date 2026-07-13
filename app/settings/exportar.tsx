import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useState } from 'react';

function SectionLabel({ label, T }: { label: string; T: any }) {
    return (
        <Text style={{
            fontSize: 10,
            color: T.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            fontWeight: '700',
            marginTop: 24,
            marginBottom: 10,
            paddingHorizontal: 20,
        }}>{label}</Text>
    );
}

const formats = [
    { key: 'xlsx', label: 'Excel', ext: '.xlsx', icon: 'file-delimited', color: '#00C9A7' },
    { key: 'pdf', label: 'PDF', ext: '.pdf', icon: 'file-pdf-box', color: '#FF4444' },
    { key: 'csv', label: 'CSV', ext: '.csv', icon: 'file-document-outline', color: '#5B5FEF' },
];

const dataOptions = [
    { key: 'productos', label: 'Productos', initial: true },
    { key: 'ventas', label: 'Ventas', initial: true },
    { key: 'clientes', label: 'Clientes', initial: false },
    { key: 'inventario', label: 'Inventario', initial: true },
];

const periods = [
    { key: 'week', label: 'Última semana' },
    { key: 'month', label: 'Último mes' },
    { key: 'quarter', label: 'Último trimestre' },
    { key: 'all', label: 'Todo' },
];

export default function Exportar() {
    const { T } = useAppTheme();
    const router = useRouter();
    const s = makeStyles(T);

    const [selectedFormat, setSelectedFormat] = useState('xlsx');
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [toggles, setToggles] = useState<Record<string, boolean>>(
        Object.fromEntries(dataOptions.map(d => [d.key, d.initial]))
    );

    const toggleData = (key: string) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <View style={s.screen}>
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
                    <Icon name="arrow-left" size={22} color={T.textPrimary} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Exportar datos</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <SectionLabel label="Formato de exportación" T={T} />
                <View style={s.formatRow}>
                    {formats.map(f => (
                        <TouchableOpacity
                            key={f.key}
                            style={[
                                s.formatCard,
                                {
                                    backgroundColor: T.surface,
                                    borderColor: selectedFormat === f.key ? f.color : T.border,
                                    borderWidth: selectedFormat === f.key ? 2 : 1,
                                }
                            ]}
                            onPress={() => setSelectedFormat(f.key)}
                        >
                            <View style={[s.formatIcon, { backgroundColor: f.color + '18' }]}>
                                <Icon name={f.icon as any} size={28} color={f.color} />
                            </View>
                            <Text style={[s.formatLabel, { color: T.textPrimary }]}>{f.label}</Text>
                            <Text style={[s.formatExt, { color: T.textMuted }]}>{f.ext}</Text>
                            {selectedFormat === f.key && (
                                <View style={[s.formatCheck, { backgroundColor: f.color }]}>
                                    <Icon name="check" size={14} color="#000" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <SectionLabel label="Datos a exportar" T={T} />
                <View style={s.group}>
                    {dataOptions.map((opt, i) => (
                        <View
                            key={opt.key}
                            style={[
                                s.row,
                                i < dataOptions.length - 1 && { borderBottomWidth: 1, borderBottomColor: T.border }
                            ]}
                        >
                            <View style={s.rowLeft}>
                                <Icon
                                    name={
                                        opt.key === 'productos' ? 'package-variant' :
                                        opt.key === 'ventas' ? 'cart-outline' :
                                        opt.key === 'clientes' ? 'account-group' : 'warehouse'
                                    }
                                    size={18}
                                    color={T.textSecondary}
                                />
                                <Text style={[s.rowTitle, { color: T.textPrimary }]}>{opt.label}</Text>
                            </View>
                            <Switch
                                value={toggles[opt.key]}
                                onValueChange={() => toggleData(opt.key)}
                                trackColor={{ false: T.surfaceAlt, true: T.accent + '40' }}
                                thumbColor={toggles[opt.key] ? T.accent : T.textMuted}
                            />
                        </View>
                    ))}
                </View>

                <SectionLabel label="Período" T={T} />
                <View style={s.periodRow}>
                    {periods.map(p => (
                        <TouchableOpacity
                            key={p.key}
                            style={[
                                s.periodChip,
                                {
                                    backgroundColor: selectedPeriod === p.key ? T.accent : T.surfaceAlt,
                                    borderColor: selectedPeriod === p.key ? T.accent : T.border,
                                }
                            ]}
                            onPress={() => setSelectedPeriod(p.key)}
                        >
                            <Text
                                style={[
                                    s.periodText,
                                    { color: selectedPeriod === p.key ? '#000' : T.textSecondary }
                                ]}
                            >
                                {p.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={[s.exportBtn, { backgroundColor: T.accent }]}>
                    <Icon name="export-variant" size={18} color="#000" />
                    <Text style={s.exportBtnText}>Exportar</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

function makeStyles(T: any) {
    return StyleSheet.create({
        screen: { flex: 1, backgroundColor: T.bg },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 20,
            paddingTop: 56,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: T.border,
        },
        backBtn: {
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: T.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: '900',
            color: T.textPrimary,
        },
        formatRow: {
            flexDirection: 'row',
            gap: 10,
            paddingHorizontal: 20,
        },
        formatCard: {
            flex: 1,
            borderRadius: T.radiusLg,
            padding: 14,
            alignItems: 'center',
            position: 'relative',
        },
        formatIcon: {
            width: 52,
            height: 52,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
        },
        formatLabel: {
            fontSize: 13,
            fontWeight: '700',
        },
        formatExt: {
            fontSize: 11,
            marginTop: 2,
        },
        formatCheck: {
            position: 'absolute',
            top: 8,
            right: 8,
            width: 20,
            height: 20,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },
        group: {
            marginHorizontal: 20,
            backgroundColor: T.surface,
            borderRadius: T.radiusXl,
            borderWidth: 1,
            borderColor: T.border,
            overflow: 'hidden',
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 14,
        },
        rowLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        rowTitle: {
            fontSize: 14,
            fontWeight: '600',
        },
        periodRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            paddingHorizontal: 20,
        },
        periodChip: {
            borderRadius: T.radiusFull,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderWidth: 1,
        },
        periodText: {
            fontSize: 13,
            fontWeight: '600',
        },
        exportBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginHorizontal: 20,
            marginTop: 28,
            borderRadius: T.radiusLg,
            padding: 16,
        },
        exportBtnText: {
            fontSize: 15,
            fontWeight: '800',
            color: '#000',
        },
    });
}
