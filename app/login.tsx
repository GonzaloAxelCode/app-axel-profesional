import { useAuthStore } from '@/State/store/useAuthStore';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react'; // <-- useEffect
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function LoginScreen() {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // <-- obtener estado auth

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);

    // <-- redirigir automáticamente si ya está logueado
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/inicio'); // evita que vuelva al login
        }
    }, [isAuthenticated]);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        try {
            await login(username, password);
            Alert.alert('Éxito', 'Login exitoso');
            router.replace('/inicio'); // reemplaza la pantalla de login
        } catch (err) {
            Alert.alert('Error', 'Usuario o contraseña incorrectos');
            console.log(err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <TextInput
                label="Usuario"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <Button
                mode="contained"
                loading={loading}
                onPress={handleLogin}
                style={styles.button}
            >
                Entrar
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 100,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
        paddingVertical: 5,
    },
});