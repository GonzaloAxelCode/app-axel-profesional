import { useClientes } from '@/State/hooks/useClientes';
import { Cliente } from '@/State/models/cliente.models';
import { useClienteStore } from '@/State/store/useClienteStore';
import { C } from '@/State/utils/c';

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Text } from 'react-native-paper';



// ─── helpers ──────────────────────────────────────────────────────────────────
const getInitial = (name: string) =>
    name?.trim()?.charAt(0)?.toUpperCase() ?? '?';

const AVATAR_COLORS = ['#c8f135', '#6ee7b7', '#93c5fd', '#f9a8d4', '#fcd34d', '#a78bfa'];
const getAvatarColor = (n: string) => AVATAR_COLORS[(n?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

const isRuc = (doc: string) => doc?.length === 11;
const docLabel = (doc: string) => isRuc(doc) ? 'RUC' : 'DNI';

const PAGE_SIZE = 20;

// ─── ClienteCard ──────────────────────────────────────────────────────────────
function ClienteCard({ cliente, onPress }: { cliente: Cliente; onPress: () => void }) {
    const color = getAvatarColor(cliente.fullname ?? '');

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.avatar, { backgroundColor: color + '18', borderColor: color + '35', borderWidth: 1 }]}>
                <Text style={[styles.avatarText, { color }]}>
                    {getInitial(cliente.fullname)}
                </Text>
            </View>

            <View style={styles.cardInfo}>
                <Text style={styles.cardNombre} numberOfLines={1}>
                    {cliente.fullname || 'Sin nombre'}
                </Text>
                <Text style={styles.cardDoc}>
                    {docLabel(cliente.document)} · {cliente.document}
                </Text>
            </View>

            <View style={styles.cardRight}>
                {cliente.phone ? (
                    <View style={styles.phoneBadge}>
                        <Icon name="phone-outline" size={11} color={C.textSecondary} />
                        <Text style={styles.phoneBadgeText}>{cliente.phone}</Text>
                    </View>
                ) : null}
                <Icon name="chevron-right" size={18} color={C.border} style={{ marginTop: 4 }} />
            </View>
        </TouchableOpacity>
    );
}

// ─── ClientesScreen ───────────────────────────────────────────────────────────
export default function ClientesScreen() {
    const router = useRouter();
    const { clientes, loading } = useClientes();
    const { search, setSearch, filtrar, clientesFiltrados } = useClienteStore();

    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        filtrar(clientes);
        setVisibleCount(PAGE_SIZE);
    }, [search, clientes]);

    const visibleClientes = clientesFiltrados.slice(0, visibleCount);
    const hasMore = visibleCount < clientesFiltrados.length;

    const loadMore = () => {
        if (hasMore) setVisibleCount(prev => prev + PAGE_SIZE);
    };

    const clearSearch = () => {
        setSearch('');
        inputRef.current?.blur();
    };

    if (loading) {
        return (
            <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color={C.accent} />
                <Text style={styles.loadingText}>Cargando clientes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>

            {/* ── HEADER ── */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Clientes</Text>
                    <Text style={styles.headerSub}>
                        {clientesFiltrados.length} registro{clientesFiltrados.length !== 1 ? 's' : ''}
                    </Text>
                </View>
                <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
                    <Icon name="plus" size={16} color={C.bg} />
                    <Text style={styles.fabText}>Nuevo</Text>
                </TouchableOpacity>
            </View>

            {/* ── SEARCH ── */}
            <View style={styles.searchWrap}>
                <View style={styles.searchBox}>
                    <Icon name="magnify" size={18} color={C.textMuted} />
                    <TextInput
                        ref={inputRef}
                        style={styles.searchInput}
                        placeholder="Buscar por nombre o documento..."
                        placeholderTextColor={C.textMuted}
                        value={search}
                        onChangeText={setSearch}
                        returnKeyType="search"
                        autoCorrect={false}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                            <Icon name="close-circle" size={17} color={C.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* ── LIST ── */}
            <FlatList
                data={visibleClientes}
                keyExtractor={(item) => item.document}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                onEndReached={loadMore}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                    hasMore ? (
                        <View style={styles.footerLoader}>
                            <ActivityIndicator size="small" color={C.textMuted} />
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <View style={styles.emptyIcon}>
                            <Icon name="account-search-outline" size={32} color={C.textMuted} />
                        </View>
                        <Text style={styles.emptyTitle}>
                            {search ? 'Sin resultados' : 'Sin clientes'}
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            {search
                                ? `No se encontró "${search}"`
                                : 'Agrega tu primer cliente'}
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <ClienteCard
                        cliente={item}
                        onPress={console.log}
                    />
                )}
            />
        </View>
    );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.bg },

    loadingWrap: { flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' },
    loadingText: { fontSize: 15, color: C.textSecondary, marginTop: 14 },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16,
        backgroundColor: C.bg,
        borderBottomWidth: 1, borderBottomColor: C.border,
    },
    headerTitle: { fontSize: 28, fontWeight: '700', color: C.textPrimary, letterSpacing: -0.8 },
    headerSub: { fontSize: 13, color: C.textSecondary, marginTop: 2 },
    fab: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: C.accent, borderRadius: 100,
        paddingHorizontal: 18, paddingVertical: 10,
    },
    fabText: { color: C.bg, fontWeight: '700', fontSize: 14, marginLeft: 6 },

    searchWrap: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: C.bg },
    searchBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: C.surface, borderRadius: 14,
        paddingHorizontal: 14, paddingVertical: 12,
        borderWidth: 1, borderColor: C.border,
    },
    searchInput: {
        flex: 1, fontSize: 15, color: C.textPrimary,
        marginLeft: 10, marginRight: 6, padding: 0,
    },

    listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },
    separator: { height: 1, backgroundColor: C.border, marginLeft: 66 },

    card: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 14,
    },
    avatar: {
        width: 46, height: 46, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    },
    avatarText: { fontSize: 18, fontWeight: '800' },
    cardInfo: { flex: 1, marginLeft: 14 },
    cardNombre: { fontSize: 15, fontWeight: '700', color: C.textPrimary, letterSpacing: -0.3 },
    cardDoc: { fontSize: 12, color: C.textSecondary, marginTop: 2 },
    cardRight: { alignItems: 'flex-end', marginLeft: 8 },
    phoneBadge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: C.surface, borderRadius: 100,
        paddingHorizontal: 8, paddingVertical: 4,
        borderWidth: 1, borderColor: C.border,
    },
    phoneBadgeText: { fontSize: 11, color: C.textSecondary, fontWeight: '600', marginLeft: 4 },

    footerLoader: { paddingVertical: 20, alignItems: 'center' },

    emptyWrap: { alignItems: 'center', paddingTop: 72 },
    emptyIcon: {
        width: 64, height: 64, borderRadius: 20,
        backgroundColor: C.surface,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1, borderColor: C.border,
    },
    emptyTitle: { fontSize: 17, fontWeight: '700', color: C.textPrimary, marginBottom: 6 },
    emptySubtitle: { fontSize: 14, color: C.textSecondary },
});