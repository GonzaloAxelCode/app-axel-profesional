import { useAuthStore } from '@/State/store/useAuthStore';
import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import {
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Easing,
} from 'react-native';
import CustomAlert from '@/components/CustomAlert';

type Role = 'vendedor';

const ROLE_THEMES: Record<Role, { accent: string; accentDim: string; accentLight: string; accentLightDim: string; label: string; icon: string; subtitle: string }> = {
    vendedor: {
        accent: '#C6FF00',
        accentDim: '#C6FF0018',
        accentLight: '#4CAF50',
        accentLightDim: '#4CAF5018',
        label: 'Vendedor',
        icon: 'account-outline',
        subtitle: 'Punto de venta y atención al cliente',
    },
};

function InputField({ label, value, onChangeText, placeholder, secureTextEntry, right, autoCapitalize = 'none', returnKeyType, onSubmitEditing, accentColor, T }: any) {
    return (
        <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, color: T.textSecondary, letterSpacing: 1, fontWeight: '600', textTransform: 'uppercase' }}>{label}</Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: T.surface,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: T.border,
                paddingHorizontal: 16,
                paddingVertical: 4,
            }}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={T.textMuted}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    style={{ flex: 1, fontSize: 15, color: T.textPrimary, paddingVertical: 12 }}
                    selectionColor={accentColor}
                />
                {right}
            </View>
        </View>
    );
}

function SpinnerLoader({ size = 20, color }: { size?: number; color: string }) {
    const spinValue = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true })
        ).start();
    }, []);
    const rotate = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    return (
        <Animated.View style={{ width: size, height: size, transform: [{ rotate }] }}>
            <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2.5, borderColor: color + '30', borderTopColor: color }} />
        </Animated.View>
    );
}

const FEATURES = [
    { icon: 'package-variant-closed', label: 'Inventario de productos', desc: 'Modelos, precios, características e imágenes' },
    { icon: 'chart-bar', label: 'Control de stock', desc: 'Entradas, salidas y alertas' },
    { icon: 'credit-card-outline', label: 'Ventas rápidas', desc: 'Flujo optimizado para tienda' },
    { icon: 'chart-line', label: 'Reportes de ventas', desc: 'Diario, semanal y mensual' },
    { icon: 'account-search-outline', label: 'Gestión de clientes', desc: 'Consulta por DNI en tiempo real' },
    { icon: 'file-document-outline', label: 'Facturación electrónica', desc: 'Boleta y factura SUNAT' },
    { icon: 'cloud-outline', label: 'Comprobantes en la nube', desc: 'Acceso seguro y centralizado' },
    { icon: 'barcode-scan', label: 'Lector de códigos de barras', desc: 'Ideal para ventas rápidas' },
];

const UPCOMING_FEATURES = [
    { icon: 'chart-areaspline', label: 'Reportes avanzados', desc: 'Métricas, ganancias y proyecciones' },
    { icon: 'wrench-outline', label: 'Servicio técnico Avanzado', desc: 'Registro independiente de stock y ventas por servicio' },
];

export default function LoginScreen() {
    const router = useRouter();
    const { T, mode } = useAppTheme();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const login = useAuthStore((s) => s.login);
    const loading = useAuthStore((s) => s.loading);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [role, setRole] = useState<Role>('vendedor');
    const scrollRef = useRef<ScrollView>(null);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const showAlert = (title: string, message?: string) => {
        setAlertTitle(title);
        setAlertMessage(message || '');
        setAlertVisible(true);
    };

    const roleTheme = ROLE_THEMES[role];
    const isLight = mode === 'light';
    const accent = isLight ? roleTheme.accentLight : roleTheme.accent;
    const accentDim = isLight ? roleTheme.accentLightDim : roleTheme.accentDim;

    useEffect(() => {
        if (isAuthenticated) router.replace('/inicio');
    }, [isAuthenticated]);

    const handleLogin = async () => {
        Keyboard.dismiss();
        if (!username || !password) {
            showAlert('Campos requeridos', 'Completa todos los campos para iniciar sesión.');
            return;
        }
        try {
            await login(username, password);
            router.replace('/inicio');
        } catch (err: any) {
            showAlert('Error de autenticación', err?.message ?? 'Credenciales incorrectas. Verifica tu usuario y contraseña.');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: T.bg }}>
            <StatusBar barStyle={T.bg === '#050505' ? 'light-content' : 'dark-content'} backgroundColor={T.bg} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                style={{ flex: 1 }}
            >
                <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 50, paddingBottom: 40 }}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View style={{ position: 'absolute', top: -60, right: -60, opacity: 0.5 }}>
                        <View style={{ width: 200, height: 200, borderRadius: 100, backgroundColor: accentDim }} />
                        <View style={{ position: 'absolute', top: 40, left: 40, width: 120, height: 120, borderRadius: 60, backgroundColor: accent + '15' }} />
                    </View>

                    <View style={{ marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <View style={{
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                backgroundColor: accent,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Icon name="storefront-outline" size={24} color={T.bg} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: '800', color: T.textPrimary, letterSpacing: 0.5 }}>GV Software Plus</Text>
                                <Text style={{ fontSize: 11, color: accent, fontWeight: '600', letterSpacing: 0.5 }}>Para tiendas de celulares</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 12, color: T.textSecondary, lineHeight: 18, marginTop: 4 }}>
                            Sistema especializado para venta de celulares, accesorios y control de inventario.
                        </Text>
                    </View>



                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 11, letterSpacing: 2.5, color: accent, fontWeight: '600', marginBottom: 8 }}>BIENVENIDO DE VUELTA</Text>
                        <Text style={{ fontSize: 36, fontWeight: '800', color: T.textPrimary, lineHeight: 42 }}>Inicia sesión</Text>
                    </View>

                    <View style={{ gap: 16, marginBottom: 20 }}>
                        <InputField
                            label="Usuario"
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Tu usuario o email"
                            T={T}
                            accentColor={accent}
                            returnKeyType="next"
                        />
                        <InputField
                            label="Contraseña"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            secureTextEntry={!showPwd}
                            returnKeyType="done"
                            onSubmitEditing={handleLogin}
                            T={T}
                            accentColor={accent}
                            right={
                                <Pressable onPress={() => setShowPwd(!showPwd)} hitSlop={12}>
                                    <Icon name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={20} color={T.textSecondary} />
                                </Pressable>
                            }
                        />
                    </View>

                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: accent,
                            borderRadius: 14,
                            paddingVertical: 16,
                            marginBottom: 20,
                            shadowColor: accent,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.22,
                            shadowRadius: 22,
                            elevation: 8,
                            opacity: loading ? 0.7 : 1,
                        }}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                <SpinnerLoader size={20} color={T.bg} />
                                <Text style={{ fontSize: 16, fontWeight: '800', color: T.bg }}>Ingresando...</Text>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: T.bg }}>Ingresar</Text>
                                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: T.bg + '22', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name="arrow-right" size={16} color={T.bg} />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            backgroundColor: '#25D366',
                            borderRadius: 14,
                            paddingVertical: 14,
                            marginBottom: 32,
                        }}
                        activeOpacity={0.85}
                        onPress={() => {
                            // Aquí puedes poner el número de WhatsApp del desarrollador
                            // Linking.openURL('https://wa.me/51999999999?text=Hola, quiero información sobre GV Software Plus');
                        }}
                    >
                        <Icon name="whatsapp" size={20} color="#fff" />
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Contactar para acceso</Text>
                    </TouchableOpacity>

                    <View style={{ borderTopWidth: 1, borderTopColor: T.border, paddingTop: 28 }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            {FEATURES.map((f, i) => (
                                <View key={i} style={{
                                    width: '47%',
                                    backgroundColor: T.surface,
                                    borderRadius: 12,
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: T.border,
                                }}>
                                    <Icon name={f.icon as any} size={22} color={accent} style={{ marginBottom: 6 }} />
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: T.textPrimary, marginBottom: 2 }}>{f.label}</Text>
                                    <Text style={{ fontSize: 10, color: T.textSecondary, lineHeight: 14 }}>{f.desc}</Text>
                                </View>
                            ))}
                        </View>

                        <Text style={{ fontSize: 11, fontWeight: '700', color: accent, letterSpacing: 1, marginTop: 24, marginBottom: 10 }}>PRÓXIMAMENTE</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            {UPCOMING_FEATURES.map((f, i) => (
                                <View key={i} style={{
                                    width: '47%',
                                    backgroundColor: T.surface,
                                    borderRadius: 12,
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: T.border,
                                    opacity: 0.7,
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                        <Icon name={f.icon as any} size={18} color={T.textSecondary} />
                                        <View style={{
                                            backgroundColor: accent + '20',
                                            paddingHorizontal: 6,
                                            paddingVertical: 2,
                                            borderRadius: 6,
                                        }}>
                                            <Text style={{ fontSize: 8, fontWeight: '700', color: accent }}>PRONTO</Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: T.textPrimary, marginBottom: 2 }}>{f.label}</Text>
                                    <Text style={{ fontSize: 10, color: T.textSecondary, lineHeight: 14 }}>{f.desc}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <CustomAlert
                visible={alertVisible}
                type="error"
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
        </View>
    );
}
