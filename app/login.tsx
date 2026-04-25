import { useAuthStore } from '@/State/store/useAuthStore';
import T from '@/constants/THEME';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';



// ─── SocialButton ─────────────────────────────────────────────
function SocialBtn({ icon, label }: { icon: string; label: string }) {
    return (
        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
            <Icon name={icon as any} size={18} color={T.textSecondary} />
            <Text style={styles.socialText}>{label}</Text>
        </TouchableOpacity>
    );
}

// ─── InputField ───────────────────────────────────────────────
function InputField({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    right,
    autoCapitalize = 'none',
}: {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    right?: React.ReactNode;
    autoCapitalize?: 'none' | 'sentences';
}) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.fieldRow}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={T.textMuted}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                    style={styles.fieldInput}
                    selectionColor={T.accent}
                />
                {right}
            </View>
            <View style={styles.fieldUnderline} />
        </View>
    );
}

// ─── Screen ───────────────────────────────────────────────────
export default function LoginScreen() {
    const router = useRouter();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const login = useAuthStore((s) => s.login);
    const loading = useAuthStore((s) => s.loading);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);

    useEffect(() => {
        if (isAuthenticated) router.replace('/inicio');
    }, [isAuthenticated]);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
        }
        try {
            await login(username, password);
            router.replace('/inicio');
        } catch (err: any) {
            Alert.alert('Error', err?.message ?? 'Credenciales incorrectas');
        }
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor={T.bg} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.kav}
            >

                {/* Deco */}
                <View style={styles.topDeco}>
                    <View style={styles.decoCircle} />
                    <View style={styles.decoCircleInner} />
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.eyebrow}>BIENVENIDO DE VUELTA</Text>
                    <Text style={styles.title}>Inicia{'\n'}sesión</Text>
                </View>

                {/* Social */}
                <View style={styles.socialRow}>
                    <SocialBtn icon="google" label="Google" />
                    <SocialBtn icon="apple" label="Apple" />
                </View>

                {/* Divider */}
                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>o continúa con correo</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <InputField
                        label="Usuario"
                        value={username}
                        onChangeText={setUsername}
                        placeholder="ejemplo@gmail.com"
                    />
                    <InputField
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••"
                        secureTextEntry={!showPwd}
                        right={
                            <Pressable onPress={() => setShowPwd(!showPwd)}>
                                <Icon
                                    name={showPwd ? 'eye-off-outline' : 'eye-outline'}
                                    size={18}
                                    color={T.textSecondary}
                                />
                            </Pressable>
                        }
                    />
                    <TouchableOpacity style={styles.forgotWrap}>
                        <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                </View>

                {/* CTA */}
                <TouchableOpacity
                    style={[styles.btn, loading && { opacity: 0.6 }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.btnText}>
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </Text>

                    {!loading && (
                        <View style={styles.btnArrow}>
                            <Icon name="arrow-right" size={16} color={T.bg} />
                        </View>
                    )}
                </TouchableOpacity>

                {/* Footer */}
                <Text style={styles.footer}>
                    ¿No tienes cuenta?{' '}
                    <Text
                        style={styles.footerLink}
                        onPress={() => router.push('/welcome')}
                    >
                        Regístrate
                    </Text>
                </Text>

            </KeyboardAvoidingView>
        </View>
    );
}

// ─── STYLES ───────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: T.bg },
    kav: { flex: 1, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 32 },

    topDeco: { position: 'absolute', top: -60, right: -60 },
    decoCircle: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: T.accentDim,
    },
    decoCircleInner: {
        position: 'absolute',
        top: 40,
        left: 40,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: T.accent2 + '15',
    },

    header: { marginBottom: 36 },
    eyebrow: {
        fontSize: 11,
        letterSpacing: 2.5,
        color: T.accent,
        fontWeight: '600',
        marginBottom: 10,
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: T.textPrimary,
        lineHeight: 52,
    },

    socialRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
    socialBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 13,
        borderRadius: T.radiusMd,
        borderWidth: 1,
        borderColor: T.border,
        backgroundColor: T.surface,
    },
    socialText: { fontSize: 14, fontWeight: '600', color: T.textSecondary },

    dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 12 },
    dividerLine: { flex: 1, height: 1, backgroundColor: T.border },
    dividerText: { fontSize: 12, color: T.textSecondary },

    form: { marginBottom: 28, gap: 20 },
    fieldWrap: { gap: 6 },
    fieldLabel: {
        fontSize: 11,
        color: T.textSecondary,
        letterSpacing: 1,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    fieldRow: { flexDirection: 'row', alignItems: 'center' },
    fieldInput: {
        flex: 1,
        fontSize: 16,
        color: T.textPrimary,
        paddingVertical: 10,
    },
    fieldUnderline: { height: 1, backgroundColor: T.border, marginTop: 4 },

    forgotWrap: { alignSelf: 'flex-end', marginTop: 4 },
    forgot: { fontSize: 13, color: T.accent },

    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: T.accent,
        borderRadius: T.radiusLg,
        paddingVertical: 17,
        marginBottom: 24,
        gap: 10,
        ...T.shadowAccent,
    },
    btnText: {
        fontSize: 16,
        fontWeight: '800',
        color: T.bg,
    },
    btnArrow: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: T.bg + '22',
        alignItems: 'center',
        justifyContent: 'center',
    },

    footer: { textAlign: 'center', fontSize: 13, color: T.textSecondary },
    footerLink: { color: T.textPrimary, fontWeight: '700' },
});