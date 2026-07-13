import { useAuthStore } from '@/State/store/useAuthStore';
import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Easing,
} from 'react-native';

function SocialBtn({ icon, label, T }: { icon: string; label: string; T: any }) {
    return (
        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13, borderRadius: T.radiusMd, borderWidth: 1, borderColor: T.border, backgroundColor: T.surface }} activeOpacity={0.7}>
            <Icon name={icon as any} size={18} color={T.textSecondary} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: T.textSecondary }}>{label}</Text>
        </TouchableOpacity>
    );
}

function InputField({ label, value, onChangeText, placeholder, secureTextEntry, right, autoCapitalize = 'none', returnKeyType, onSubmitEditing, T }: any) {
    return (
        <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, color: T.textSecondary, letterSpacing: 1, fontWeight: '600', textTransform: 'uppercase' }}>{label}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={T.textMuted}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    style={{ flex: 1, fontSize: 16, color: T.textPrimary, paddingVertical: 10 }}
                    selectionColor={T.accent}
                />
                {right}
            </View>
            <View style={{ height: 1, backgroundColor: T.border, marginTop: 4 }} />
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

export default function LoginScreen() {
    const router = useRouter();
    const { T } = useAppTheme();
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
        <View style={{ flex: 1, backgroundColor: T.bg }}>
            <StatusBar barStyle={T.bg === '#050505' ? 'light-content' : 'dark-content'} backgroundColor={T.bg} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 32 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View style={{ position: 'absolute', top: -60, right: -60 }}>
                        <View style={{ width: 220, height: 220, borderRadius: 110, backgroundColor: T.accentDim }} />
                        <View style={{ position: 'absolute', top: 40, left: 40, width: 140, height: 140, borderRadius: 70, backgroundColor: T.accent2 + '15' }} />
                    </View>

                    <View style={{ marginBottom: 36 }}>
                        <Text style={{ fontSize: 11, letterSpacing: 2.5, color: T.accent, fontWeight: '600', marginBottom: 10 }}>BIENVENIDO DE VUELTA</Text>
                        <Text style={{ fontSize: 48, fontWeight: '800', color: T.textPrimary, lineHeight: 52 }}>Inicia{'\n'}sesión</Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
                        <SocialBtn icon="google" label="Google" T={T} />
                        <SocialBtn icon="apple" label="Apple" T={T} />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 12 }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: T.border }} />
                        <Text style={{ fontSize: 12, color: T.textSecondary }}>o continúa con correo</Text>
                        <View style={{ flex: 1, height: 1, backgroundColor: T.border }} />
                    </View>

                    <View style={{ marginBottom: 28, gap: 20 }}>
                        <InputField label="Usuario" value={username} onChangeText={setUsername} placeholder="ejemplo@gmail.com" T={T} />
                        <InputField
                            label="Contraseña" value={password} onChangeText={setPassword} placeholder="••••••••"
                            secureTextEntry={!showPwd} returnKeyType="done" onSubmitEditing={handleLogin} T={T}
                            right={
                                <Pressable onPress={() => setShowPwd(!showPwd)}>
                                    <Icon name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={18} color={T.textSecondary} />
                                </Pressable>
                            }
                        />
                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 4 }}>
                            <Text style={{ fontSize: 13, color: T.accent }}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: T.accent, borderRadius: 100, paddingVertical: 17, marginBottom: 24, ...T.shadowAccent, opacity: loading ? 0.7 : 1 }}
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

                    <Text style={{ textAlign: 'center', fontSize: 13, color: T.textSecondary }}>
                        ¿No tienes cuenta?{' '}
                        <Text style={{ color: T.textPrimary, fontWeight: '700' }} onPress={() => router.push('/welcome')}>Regístrate</Text>
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
