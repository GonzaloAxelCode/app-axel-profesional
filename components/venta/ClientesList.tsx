import { useClientes } from '@/State/hooks/useClientes';
import { Cliente } from '@/State/models/cliente.models';
import { C } from '@/State/utils/c';

import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Icon, Text, TouchableRipple } from 'react-native-paper';

// ═══════════════════════════════════════════════════════════════════════════════
// ClientesList.tsx
// ═══════════════════════════════════════════════════════════════════════════════


// 🎨 Colores para avatar
const colors = ['#000', '#1e88e5', '#43a047', '#e53935'];
const getColor = (nombre: string) => {
    if (!nombre || nombre.length === 0) return '#000';
    const index = nombre.charCodeAt(0) % colors.length;
    return colors[index];
};



interface ClientesListProps {
    search: string;
    onSelect: (cliente: Cliente) => void;
    onResultsChange?: (hasResults: boolean) => void;
}

const LIST_AVATAR_COLORS = [C.accent, '#6ee7b7', '#93c5fd', '#f9a8d4', C.yellow];
const getListAvatarColor = (nombre: string) =>
    LIST_AVATAR_COLORS[(nombre?.charCodeAt(0) ?? 0) % LIST_AVATAR_COLORS.length];

export function ClientesList({ search, onSelect, onResultsChange }: ClientesListProps) {
    const { clientes, loading } = useClientes();

    if (loading) {
        return (
            <View style={lStyles.center}>
                <ActivityIndicator color={C.accent} />
                <Text style={lStyles.loadingText}>Cargando clientes...</Text>
            </View>
        );
    }

    const filtered = clientes.filter((c: Cliente) => {
        const text = search.toLowerCase();
        return (
            c.document.includes(text) ||
            c.fullname?.toLowerCase().includes(text) ||
            c.firstname?.toLowerCase().includes(text)
        );
    });

    onResultsChange?.(filtered.length > 0);

    if (filtered.length === 0) {
        return (
            <View style={lStyles.center}>
                <View style={lStyles.emptyIcon}>
                    <Icon source="account-search-outline" size={28} color={C.textMuted} />
                </View>
                <Text style={lStyles.emptyText}>No hay resultados locales</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Cliente }) => {
        const nombre = item.fullname || item.firstname || '';
        const color = getListAvatarColor(nombre);
        const isRuc = item.document?.length === 11;

        return (
            <TouchableRipple
                onPress={() => onSelect(item)}
                style={lStyles.item}
                rippleColor={C.accent + '15'}
            >
                <View style={lStyles.row}>
                    <View style={[lStyles.avatar, { backgroundColor: color + '18', borderColor: color + '35', borderWidth: 1.5 }]}>
                        <Text style={[lStyles.avatarText, { color }]}>{nombre.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={lStyles.info}>
                        <Text style={lStyles.name} numberOfLines={1}>{nombre}</Text>
                        <Text style={lStyles.doc}>{isRuc ? 'RUC' : 'DNI'}: {item.document}</Text>
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
            ItemSeparatorComponent={() => <View style={lStyles.separator} />}
        />
    );
}

const lStyles = StyleSheet.create({
    center: { alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
    loadingText: { fontSize: 14, color: C.textSecondary },
    emptyIcon: {
        width: 60, height: 60, borderRadius: 18,
        backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: C.border,
    },
    emptyText: { fontSize: 14, color: C.textMuted },
    item: { paddingHorizontal: 16, paddingVertical: 12 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 16, fontWeight: '800' },
    info: { flex: 1 },
    name: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
    doc: { fontSize: 12, color: C.textSecondary, marginTop: 2 },
    separator: { height: 1, backgroundColor: C.border, marginLeft: 70 },
});