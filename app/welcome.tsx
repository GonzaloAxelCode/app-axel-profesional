import { useAuthStore } from "@/State/store/useAuthStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function BienvenidaScreen() {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Redirige automáticamente si el usuario ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/inicio"); // evita que vea Bienvenida
        }
    }, [isAuthenticated]);

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>
                Bienvenido
            </Text>

            <Button
                mode="contained"
                onPress={() => router.replace("/login")}
                style={styles.button}
            >
                Iniciar sesión
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },
    title: {
        textAlign: "center",
        marginBottom: 30,
    },
    button: {
        marginTop: 10,
    },
});