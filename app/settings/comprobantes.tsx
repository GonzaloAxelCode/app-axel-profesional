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

export default function Comprobantes() {
    const { T } = useAppTheme();
    const router = useRouter();
    const s = makeStyles(T);

    const [igvEnabled, setIgvEnabled] = useState(true);
    const [igvIncluido, setIgvIncluido] = useState(true);
    const [sunatAuto, setSunatAuto] = useState(true);
    const [ticketDefault, setTicketDefault] = useState(true);

    return (
        <View style={s.screen}>
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
                    <Icon name="arrow-left" size={22} color={T.textPrimary} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Comprobantes</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <SectionLabel label="Serie y correlativo" T={T} />
                <View style={s.group}>
                    <View style={s.row}>
                        <View style={s.rowLeft}>
                            <Icon name="receipt" size={18} color={T.blue} />
                            <View>
                                <Text style={[s.rowTitle, { color: T.textPrimary }]}>Boleta</Text>
                                <Text style={[s.rowSub, { color: T.textMuted }]}>Serie B001</Text>
                            </View>
                        </View>
                        <Text style={[s.rowValue, { color: T.textSecondary }]}>#1248</Text>
                    </View>
                    <View style={[s.row, { borderTopWidth: 1, borderTopColor: T.border }]}>
                        <View style={s.rowLeft}>
                            <Icon name="file-document" size={18} color={T.green} />
                            <View>
                                <Text style={[s.rowTitle, { color: T.textPrimary }]}>Factura</Text>
                                <Text style={[s.rowSub, { color: T.textMuted }]}>Serie F001</Text>
                            </View>
                        </View>
                        <Text style={[s.rowValue, { color: T.textSecondary }]}>#567</Text>
                    </View>
                    <View style={[s.row, { borderTopWidth: 1, borderTopColor: T.border }]}>
                        <View style={s.rowLeft}>
                            <Icon name="note-text" size={18} color={T.amber} />
                            <View>
                                <Text style={[s.rowTitle, { color: T.textPrimary }]}>Nota de venta</Text>
                                <Text style={[s.rowSub, { color: T.textMuted }]}>Serie NV001</Text>
                            </View>
                        </View>
                        <Text style={[s.rowValue, { color: T.textSecondary }]}>#89</Text>
                    </View>
                </View>

                <SectionLabel label="Configuración" T={T} />
                <View style={s.group}>
                    <View style={s.row}>
                        <View style={s.rowLeft}>
                            <Icon name="percent" size={18} color={T.accent} />
                            <View>
                                <Text style={[s.rowTitle, { color: T.textPrimary }]}>IGV</Text>
                                <Text style={[s.rowSub, { color: T.textMuted }]}>Impuesto general: 18%</Text>
                            </View>
                        </View>
                        <Switch
                            value={igvEnabled}
                            onValueChange={setIgvEnabled}
                            trackColor={{ false: T.surfaceAlt, true: T.accent + '40' }}
                            thumbColor={igvEnabled ? T.accent : T.textMuted}
                        />
                    </View>
                    <View style={[s.row, { borderTopWidth: 1, borderTopColor: T.border }]}>
                        <View style={s.rowLeft}>
                            <Icon name="tag-outline" size={18} color={T.blue} />
                            <View>
                                <Text style={[s.rowTitle, { color: T.textPrimary }]}>Precios con IGV incluido</Text>
                            </View>
                        </View>
                        <Switch
                            value={igvIncluido}
                            onValueChange={setIgvIncluido}
                            trackColor={{ false: T.surfaceAlt, true: T.accent + '40' }}
                            thumbColor={igvIncluido ? T.accent : T.textMuted}
                        />
                    </View>
                    <View style={[s.row, { borderTopWidth: 1, borderTopColor: T.border }]}>
                        <View style={s.rowLeft}>
                            <Icon name="cloud-upload-outline" size={18} color={T.green} />
                            <View>
                                <Text style={[s.rowTitle, { color: T.textPrimary }]}>Envío automático a SUNAT</Text>
                            </View>
                        </View>
                        <Switch
                            value={sunatAuto}
                            onValueChange={setSunatAuto}
                            trackColor={{ false: T.surfaceAlt, true: T.accent + '40' }}
                            thumbColor={sunatAuto ? T.accent : T.textMuted}
                        />
                    </View>
                </View>

                <SectionLabel label="Impresión" T={T} />
                <View style={s.group}>
                    <View style={s.row}>
                        <View style={s.rowLeft}>
                            <Icon name="printer" size={18} color={T.purple} />
                            <View>
                                <Text style={[s.rowTitle, { color: T.textPrimary }]}>Ticket por defecto</Text>
                            </View>
                        </View>
                        <Switch
                            value={ticketDefault}
                            onValueChange={setTicketDefault}
                            trackColor={{ false: T.surfaceAlt, true: T.accent + '40' }}
                            thumbColor={ticketDefault ? T.accent : T.textMuted}
                        />
                    </View>
                    <View style={[s.row, { borderTopWidth: 1, borderTopColor: T.border }]}>
                        <View style={s.rowLeft}>
                            <Icon name="resize" size={18} color={T.textMuted} />
                            <View>
                                <Text style={[s.rowTitle, { color: T.textPrimary }]}>Tamaño papel</Text>
                            </View>
                        </View>
                        <View style={s.rowRight}>
                            <Text style={[s.rowValue, { color: T.textSecondary }]}>80mm</Text>
                            <Icon name="chevron-right" size={18} color={T.textMuted} />
                        </View>
                    </View>
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
            fontWeight: '700',
        },
        rowRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
    });
}
