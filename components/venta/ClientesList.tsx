import { useClientes } from '@/State/hooks/useClientes';
import { Cliente } from '@/State/models/cliente.models';

import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Avatar, Text, TouchableRipple } from 'react-native-paper';



interface Props {
    search: string;
    onSelect: (cliente: Cliente) => void;
    onResultsChange?: (hasResults: boolean) => void;
}

// 🎨 Colores para avatar
const colors = ['#000', '#1e88e5', '#43a047', '#e53935'];
const getColor = (nombre: string) => {
    if (!nombre || nombre.length === 0) return '#000';
    const index = nombre.charCodeAt(0) % colors.length;
    return colors[index];
};

export function ClientesList({ search, onSelect, onResultsChange }: Props) {
    const { clientes, loading } = useClientes();

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
                <Text>Cargando clientes...</Text>
            </View>
        );
    }

    // 🔎 Filtrado en tiempo real
    const filtered = clientes.filter((c: Cliente) => {
        const text = search.toLowerCase();
        return (
            c.document.includes(text) ||
            c.fullname?.toLowerCase().includes(text) ||
            c.firstname?.toLowerCase().includes(text)
        );
    });

    // Avisamos si hay resultados
    onResultsChange?.(filtered.length > 0);

    if (filtered.length === 0) {
        return (
            <View style={styles.center}>
                <Text>No hay resultados locales</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Cliente }) => {
        const nombre = item.fullname || item.firstname || '';
        const color = getColor(nombre);

        return (
            <TouchableRipple
                onPress={() => onSelect(item)}
                style={styles.item}
                rippleColor="rgba(0,0,0,0.1)"
            >
                <View style={styles.row}>
                    <Avatar.Text
                        size={40}
                        label={nombre.charAt(0).toUpperCase()}
                        style={[styles.avatar, { backgroundColor: color }]}
                        color="#fff"
                    />
                    <View style={styles.info}>
                        <Text style={styles.name}>{nombre}</Text>
                        <Text style={styles.doc}>DNI: {item.document}</Text>
                    </View>
                </View>
            </TouchableRipple>
        );
    };

    return (
        <FlatList
            data={filtered}
            keyExtractor={(item) => item.document}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
        />
    );
}

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    doc: {
        fontSize: 13,
        color: '#666',
    },
});