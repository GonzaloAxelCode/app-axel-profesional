import { useVentas } from "@/State/hooks/useVentas";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";



import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useTheme } from "react-native-paper";

export default function VentasScreen() {
    const { ventasHoy, loadingVentasHoy } = useVentas();
    const theme = useTheme();
    const router = useRouter();

    if (loadingVentasHoy) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
                <Text>Cargando ventas...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, paddingTop: 30 }}>
            <Text style={{ fontSize: 20, marginBottom: 16 }}>Ventas de Hoy</Text>

            {ventasHoy?.results?.length === 0 ? (
                <Text>No hay ventas por mostrar.</Text>
            ) : (
                <FlatList
                    data={ventasHoy?.results}
                    keyExtractor={(item) => item.id.toString()} // asegúrate que tus ventas tengan id
                    renderItem={({ item }) => (
                        <View
                            style={{
                                padding: 12,
                                borderBottomWidth: 1,
                                borderBottomColor: "#ddd",
                            }}
                        >
                            <Text>Cliente: {item.nombre_cliente || "Anonimo"}</Text>
                            <Text>Total: S/ {item.total}</Text>
                            <Text>Estado: {item.estado}</Text>
                        </View>
                    )}
                />
            )}

            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: theme.colors.scrim }]}
                    onPress={() => router.push('/hacerventa')} // pantalla de crear venta
                >
                    <Icon name="plus" size={20} color="#fff" />
                    <Text style={styles.fabText}>Hacer Venta</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        right: 10,
        zIndex: 10,
    },
    fab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    fabText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 6,
    },
}); 