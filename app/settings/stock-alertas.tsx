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

const alertProducts = [
    { name: 'Audífonos Bluetooth', units: 2, level: 'crítico', color: '#FFB800' },
    { name: 'Funda Silicone Pro', units: 0, level: 'agotado', color: '#707070' },
    { name: 'Cable USB-C 2m', units: 4, level: 'bajo', color: '#FF4444' },
];

export default function StockAlertas() {
    const { T } = useAppTheme();
    const router = useRouter();
    const s = makeStyles(T);

    const [alertasOn, setAlertasOn] = useState(true);
    const [pushOn, setPushOn] = useState(true);
    const [emailOn, setEmailOn] = useState(true);

    return (
        <View style={s.screen}>
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
                    <Icon name="arrow-left" size={22} color={T.textPrimary} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Alertas de stock</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[s.mainToggle, { backgroundColor: T.surface, borderColor: T.border }]}>
                    <View style={s.mainToggleLeft}>
                        <Icon name="bell-ring-outline" size={22} color={T.accent} />
                        <View>
                            <Text style={[s.mainToggleTitle, { color: T.textPrimary }]}>Alertas activas</Text>
                            <Text style={[s.mainToggleSub, { color: T.textMuted }]}>
                                Recibe notificaciones cuando el stock sea bajo
                            </Text>
                        </View>
                    </View>
                    <Switch
                        value={alertasOn}
                        onValueChange={setAlertasOn}
                        trackColor={{ false: T.surfaceAlt, true: T.accent + '40' }}
                        thumbColor={alertasOn ? T.accent : T.textMuted}
                    />
                </View>

                <SectionLabel label="Niveles de alerta" T={T} />
                <View style={s.group}>
                    <View style={s.row}>
                        <View style={s.rowLeft}>
                            <View style={[s.levelDot, { backgroundColor: '#FF4444' }]} />
                            <View>
                                <Text style={[s.rowTitle, { color: T.textPrimary }]}>Stock bajo</Text>
                                <Text style={[s.rowSub, { color: T.textMuted }]}>≤ 5 unidades</Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={18} color={T.textMuted} />
                    </View>
                    <View style={[s.row, { borderTopWidth: 1, borderTopColor: T.border }]}>
                        <View style={s.rowLeft}>
                            <View style={[s.levelDot, { backgroundColor: '#FFB800' }]} />
                            <View>
                                <Text style={[s.rowTitle, { color: T.textPrimary }]}>Stock crítico</Text>
                                <Text style={[s.rowSub, { color: T.textMuted }]}>≤ 2 unidades</Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={18} color={T.textMuted} />
                    </View>
                    <View style={[s.row, { borderTopWidth: 1, borderTopColor: T.border }]}>
                        <View style={s.rowLeft}>
                            <View style={[s.levelDot, { backgroundColor: '#707070' }]} />
                            <View>
                                <Text style={[s.rowTitle, { color: T.textPrimary }]}>Agotado</Text>
                                <Text style={[s.rowSub, { color: T.textMuted }]}>0 unidades</Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={18} color={T.textMuted} />
                    </View>
                </View>

                <SectionLabel label="Notificaciones" T={T} />
                <View style={s.group}>
                    <View style={s.row}>
                        <View style={s.rowLeft}>
                            <Icon name="bell-outline" size={18} color={T.blue} />
                            <Text style={[s.rowTitle, { color: T.textPrimary }]}>Notificación push</Text>
                        </View>
                        <Switch
                            value={pushOn}
                            onValueChange={setPushOn}
                            trackColor={{ false: T.surfaceAlt, true: T.accent + '40' }}
                            thumbColor={pushOn ? T.accent : T.textMuted}
                        />
                    </View>
                    <View style={[s.row, { borderTopWidth: 1, borderTopColor: T.border }]}>
                        <View style={s.rowLeft}>
                            <Icon name="email-outline" size={18} color={T.purple} />
                            <Text style={[s.rowTitle, { color: T.textPrimary }]}>Email de alerta</Text>
                        </View>
                        <Switch
                            value={emailOn}
                            onValueChange={setEmailOn}
                            trackColor={{ false: T.surfaceAlt, true: T.accent + '40' }}
                            thumbColor={emailOn ? T.accent : T.textMuted}
                        />
                    </View>
                    <View style={[s.row, { borderTopWidth: 1, borderTopColor: T.border }]}>
                        <View style={s.rowLeft}>
                            <Icon name="clock-outline" size={18} color={T.textMuted} />
                            <Text style={[s.rowTitle, { color: T.textPrimary }]}>Frecuencia</Text>
                        </View>
                        <View style={s.rowRight}>
                            <Text style={[s.rowValue, { color: T.textSecondary }]}>Diaria</Text>
                            <Icon name="chevron-right" size={18} color={T.textMuted} />
                        </View>
                    </View>
                </View>

                <SectionLabel label="Productos en alerta" T={T} />
                <View style={s.group}>
                    {alertProducts.map((p, i) => (
                        <View
                            key={p.name}
                            style={[
                                s.row,
                                i < alertProducts.length - 1 && { borderBottomWidth: 1, borderBottomColor: T.border }
                            ]}
                        >
                            <View style={s.rowLeft}>
                                <Icon name="alert-circle-outline" size={18} color={p.color} />
                                <View>
                                    <Text style={[s.rowTitle, { color: T.textPrimary }]}>{p.name}</Text>
                                    <Text style={[s.rowSub, { color: p.color, fontWeight: '700' }]}>
                                        {p.units} unidades · {p.level}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

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
        mainToggle: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 20,
            marginTop: 20,
            borderRadius: T.radiusXl,
            padding: 16,
            borderWidth: 1,
        },
        mainToggleLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            flex: 1,
        },
        mainToggleTitle: {
            fontSize: 15,
            fontWeight: '700',
        },
        mainToggleSub: {
            fontSize: 11,
            marginTop: 2,
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
            flex: 1,
        },
        rowTitle: {
            fontSize: 14,
            fontWeight: '600',
        },
        rowSub: {
            fontSize: 11,
            marginTop: 2,
        },
        rowValue: {
            fontSize: 13,
            fontWeight: '600',
        },
        rowRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        levelDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
        },
    });
}
