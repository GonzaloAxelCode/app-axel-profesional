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

export default function Seguridad() {
    const { T } = useAppTheme();
    const router = useRouter();
    const s = makeStyles(T);

    const [biometria, setBiometria] = useState(false);
    const [alertaLogin, setAlertaLogin] = useState(true);
    const [alertaPass, setAlertaPass] = useState(true);

    return (
        <View style={s.screen}>
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
                    <Icon name="arrow-left" size={22} color={T.textPrimary} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Seguridad</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <SectionLabel label="Autenticación" T={T} />
                <View style={s.group}>
                    <TouchableOpacity style={s.row}>
                        <View style={s.rowLeft}>
                            <Icon name="lock-outline" size={18} color={T.blue} />
                            <Text style={[s.rowTitle, { color: T.textPrimary }]}>Cambiar contraseña</Text>
                        </View>
                        <Icon name="chevron-right" size={18} color={T.textMuted} />
                    </TouchableOpacity>
                    <View style={[s.row, { borderTopWidth: 1, borderTopColor: T.border }]}>
                        <View style={s.rowLeft}>
                            <Icon name="key-outline" size={18} color={T.amber} />
                            <Text style={[s.rowTitle, { color: T.textPrimary }]}>PIN de acceso</Text>
                        </View>
                        <View style={[s.badgeGreen, { backgroundColor: T.green + '18', borderColor: T.green + '30' }]}>
                            <Text style={[s.badgeGreenText, { color: T.green }]}>Configurado</Text>
                        </View>
                    </View>
                    <View style={[s.row, { borderTopWidth: 1, borderTopColor: T.border }]}>
                        <View style={s.rowLeft}>
                            <Icon name="fingerprint" size={18} color={T.purple} />
                            <Text style={[s.rowTitle, { color: T.textPrimary }]}>Biometría</Text>
                        </View>
                        <Switch
                            value={biometria}
                            onValueChange={setBiometria}
                            trackColor={{ false: T.surfaceAlt, true: T.accent + '40' }}
                            thumbColor={biometria ? T.accent : T.textMuted}
                        />
                    </View>
                </View>

                <SectionLabel label="Sesiones" T={T} />
                <View style={s.group}>
                    <View style={s.row}>
                        <View style={s.rowLeft}>
                            <Icon name="cellphone" size={18} color={T.green} />
                            <View>
                                <Text style={[s.rowTitle, { color: T.textPrimary }]}>Sesión actual</Text>
                                <Text style={[s.rowSub, { color: T.textMuted }]}>Este dispositivo</Text>
                            </View>
                        </View>
                        <View style={[s.activeDot, { backgroundColor: T.green }]}>
                            <Text style={[s.activeText, { color: T.green }]}>Activa ahora</Text>
                        </View>
                    </View>
                    <View style={[s.row, { borderTopWidth: 1, borderTopColor: T.border }]}>
                        <View style={s.rowLeft}>
                            <Icon name="cellphone-link" size={18} color={T.textMuted} />
                            <View>
                                <Text style={[s.rowTitle, { color: T.textPrimary }]}>Última sesión</Text>
                                <Text style={[s.rowSub, { color: T.textMuted }]}>iPhone 14 Pro</Text>
                            </View>
                        </View>
                        <Text style={[s.rowValue, { color: T.textMuted }]}>Hace 2 días</Text>
                    </View>
                </View>

                <SectionLabel label="Notificaciones de seguridad" T={T} />
                <View style={s.group}>
                    <View style={s.row}>
                        <View style={s.rowLeft}>
                            <Icon name="bell-alert-outline" size={18} color={T.amber} />
                            <Text style={[s.rowTitle, { color: T.textPrimary }]}>Alerta de inicio de sesión nuevo</Text>
                        </View>
                        <Switch
                            value={alertaLogin}
                            onValueChange={setAlertaLogin}
                            trackColor={{ false: T.surfaceAlt, true: T.accent + '40' }}
                            thumbColor={alertaLogin ? T.accent : T.textMuted}
                        />
                    </View>
                    <View style={[s.row, { borderTopWidth: 1, borderTopColor: T.border }]}>
                        <View style={s.rowLeft}>
                            <Icon name="shield-lock-outline" size={18} color={T.blue} />
                            <Text style={[s.rowTitle, { color: T.textPrimary }]}>Cambio de contraseña</Text>
                        </View>
                        <Switch
                            value={alertaPass}
                            onValueChange={setAlertaPass}
                            trackColor={{ false: T.surfaceAlt, true: T.accent + '40' }}
                            thumbColor={alertaPass ? T.accent : T.textMuted}
                        />
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
            fontSize: 12,
            fontWeight: '600',
        },
        badgeGreen: {
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderWidth: 1,
        },
        badgeGreenText: {
            fontSize: 11,
            fontWeight: '700',
        },
        activeDot: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        activeText: {
            fontSize: 12,
            fontWeight: '700',
        },
    });
}
