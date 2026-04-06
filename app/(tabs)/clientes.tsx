import { useClientes } from '@/State/hooks/useClientes';
import { Cliente } from '@/State/models/cliente.models';
import { useClienteStore } from '@/State/store/useClienteStore';

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

// ─── helpers ─────────────────────────────────────────────────────────────────

const getInitial = (name: string) =>
    name?.trim()?.charAt(0)?.toUpperCase() ?? '?';

const AVATAR_BG = ['#f0f0ff', '#fff0f5', '#f0fff5', '#fffbeb', '#f0f9ff', '#fdf4ff'];
const AVATAR_FG = ['#3b30c4', '#be185d', '#065f46', '#d97706', '#0369a1', '#7e22ce'];
const getAvatarBg = (n: string) => AVATAR_BG[(n?.charCodeAt(0) ?? 0) % AVATAR_BG.length];
const getAvatarFg = (n: string) => AVATAR_FG[(n?.charCodeAt(0) ?? 0) % AVATAR_FG.length];

const isRuc = (doc: string) => doc?.length === 11;
const docLabel = (doc: string) => isRuc(doc) ? 'RUC' : 'DNI';

const PAGE_SIZE = 20;

// ─── ClienteCard ─────────────────────────────────────────────────────────────

function ClienteCard({ cliente, onPress }: { cliente: Cliente; onPress: () => void }) {
    const bg = getAvatarBg(cliente.fullname ?? '');
    const fg = getAvatarFg(cliente.fullname ?? '');

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
            <View style={[styles.avatar, { backgroundColor: bg }]}>
                <Text style={[styles.avatarText, { color: fg }]}>
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
                        <Icon name="phone-outline" size={11} color="#6b7280" />
                        <Text style={styles.phoneBadgeText}>{cliente.phone}</Text>
                    </View>
                ) : null}
                <Icon name="chevron-right" size={18} color="#d1d5db" style={{ marginTop: 4 }} />
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

    // Filtrar cada vez que cambia búsqueda o lista base
    useEffect(() => {
        filtrar(clientes);
        setVisibleCount(PAGE_SIZE); // reset paginación al buscar
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

    // ── Loading ──
    if (loading) {
        return (
            <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color="#0a0a0a" />
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
                <TouchableOpacity
                    style={styles.fab}

                    activeOpacity={0.85}
                >
                    <Icon name="plus" size={16} color="#fff" />
                    <Text style={styles.fabText}>Nuevo</Text>
                </TouchableOpacity>
            </View>

            {/* ── SEARCH ── */}
            <View style={styles.searchWrap}>
                <View style={styles.searchBox}>
                    <Icon name="magnify" size={18} color="#9ca3af" />
                    <TextInput
                        ref={inputRef}
                        style={styles.searchInput}
                        placeholder="Buscar por nombre o documento..."
                        placeholderTextColor="#9ca3af"
                        value={search}
                        onChangeText={setSearch}
                        returnKeyType="search"
                        autoCorrect={false}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                            <Icon name="close-circle" size={17} color="#d1d5db" />
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
                            <ActivityIndicator size="small" color="#9ca3af" />
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <View style={styles.emptyIcon}>
                            <Icon name="account-search-outline" size={32} color="#d1d5db" />
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
    screen: { flex: 1, backgroundColor: '#fff' },

    loadingWrap: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    loadingText: { fontSize: 15, color: '#9ca3af', marginTop: 14 },

    // header
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5, borderBottomColor: '#ebebeb',
    },
    headerTitle: { fontSize: 28, fontWeight: '700', color: '#0a0a0a', letterSpacing: -0.8 },
    headerSub: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
    fab: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#0a0a0a', borderRadius: 100,
        paddingHorizontal: 18, paddingVertical: 10,
    },
    fabText: { color: '#fff', fontWeight: '600', fontSize: 14, marginLeft: 6 },

    // search
    searchWrap: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff' },
    searchBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#f5f5f5', borderRadius: 14,
        paddingHorizontal: 14, paddingVertical: 12,
        borderWidth: 0.5, borderColor: '#ebebeb',
    },
    searchInput: {
        flex: 1, fontSize: 15, color: '#0a0a0a',
        marginLeft: 10, marginRight: 6, padding: 0,
    },

    // list
    listContent: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 100 },
    separator: { height: 0.5, backgroundColor: '#f5f5f5', marginLeft: 70 },

    // card
    card: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 14,
    },
    avatar: {
        width: 46, height: 46, borderRadius: 23,
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    },
    avatarText: { fontSize: 18, fontWeight: '800' },
    cardInfo: { flex: 1, marginLeft: 14 },
    cardNombre: { fontSize: 15, fontWeight: '700', color: '#0a0a0a', letterSpacing: -0.3 },
    cardDoc: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
    cardRight: { alignItems: 'flex-end', marginLeft: 8 },
    phoneBadge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#f5f5f5', borderRadius: 100,
        paddingHorizontal: 8, paddingVertical: 4,
    },
    phoneBadgeText: { fontSize: 11, color: '#6b7280', fontWeight: '600', marginLeft: 4 },

    // footer
    footerLoader: { paddingVertical: 20, alignItems: 'center' },

    // empty
    emptyWrap: { alignItems: 'center', paddingTop: 72 },
    emptyIcon: {
        width: 64, height: 64, borderRadius: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: { fontSize: 17, fontWeight: '700', color: '#0a0a0a', marginBottom: 6 },
    emptySubtitle: { fontSize: 14, color: '#9ca3af' },
});