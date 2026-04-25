import T from '@/constants/THEME';
import { useClientes } from '@/State/hooks/useClientes';
import { Cliente } from '@/State/models/cliente.models';
import { useClienteStore } from '@/State/store/useClienteStore';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Text } from 'react-native-paper';

// ─── helpers ─────────────────────────────
const getInitial = (name: string) =>
    name?.trim()?.charAt(0)?.toUpperCase() ?? '?';

const AVATAR_COLORS = [T.accent, T.green, T.blue, '#f9a8d4', T.yellow, T.purple];
const getAvatarColor = (n: string) =>
    AVATAR_COLORS[(n?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

const isRuc = (doc: string) => doc?.length === 11;
const docLabel = (doc: string) => (isRuc(doc) ? 'RUC' : 'DNI');

// ─── CARD PREMIUM ───────────────────────
function ClienteCard({ cliente, index }: { cliente: Cliente; index: number }) {
    const color = getAvatarColor(cliente.fullname ?? '');
    const scale = useRef(new Animated.Value(0.95)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
                delay: index * 30,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
                delay: index * 30,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View style={{ transform: [{ scale }], opacity }}>
            <TouchableOpacity style={styles.card} activeOpacity={0.9}>

                {/* Avatar */}
                <View style={[styles.avatar, { backgroundColor: color + '22' }]}>
                    <Text style={[styles.avatarText, { color }]}>
                        {getInitial(cliente.fullname)}
                    </Text>
                </View>

                {/* Info */}
                <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>
                        {cliente.fullname || 'Sin nombre'}
                    </Text>

                    <Text style={styles.doc}>
                        {docLabel(cliente.document)} · {cliente.document}
                    </Text>

                    {cliente.phone && (
                        <Text style={styles.phone}>
                            {cliente.phone}
                        </Text>
                    )}
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    {cliente.phone && (
                        <TouchableOpacity style={styles.iconBtn}>
                            <Icon name="phone-outline" size={16} color={T.green} />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.iconBtn}>
                        <Icon name="chevron-right" size={18} color={T.textMuted} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

// ─── SCREEN ─────────────────────────────
export default function ClientesScreenPremium() {
    const { clientes, loading, } = useClientes();
    const { search, setSearch, filtrar, clientesFiltrados } = useClienteStore();

    const inputRef = useRef<TextInput>(null);
    const [focus, setFocus] = useState(false);

    useEffect(() => {

        filtrar(clientes);
    }, [search, clientes]);

    const clearSearch = () => {
        setSearch('');
        inputRef.current?.blur();
    };

    if (loading) {
        return (
            <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color={T.accent} />
                <Text style={styles.loadingText}>Cargando clientes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>

            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Clientes</Text>
                    <Text style={styles.subtitle}>
                        {clientesFiltrados.length} registros
                    </Text>
                </View>

                <TouchableOpacity style={styles.addBtn}>
                    <Icon name="plus" size={18} color={T.bg} />
                </TouchableOpacity>
            </View>

            {/* SEARCH */}
            <View style={[
                styles.search,
                focus && { borderColor: T.accent }
            ]}>
                <Icon name="magnify" size={18} color={T.textMuted} />

                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder="Buscar cliente..."
                    placeholderTextColor={T.textMuted}
                    value={search}
                    onChangeText={setSearch}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                />

                {search.length > 0 && (
                    <TouchableOpacity onPress={clearSearch}>
                        <Icon name="close-circle" size={18} color={T.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            {/* LIST */}
            <FlatList
                data={clientesFiltrados}
                keyExtractor={(item) => item.document}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <ClienteCard cliente={item} index={index} />
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Icon name="account-off-outline" size={42} color={T.accent} />
                        <Text style={styles.emptyTitle}>
                            {search ? 'Sin resultados' : 'Sin clientes'}
                        </Text>
                        <Text style={styles.emptySub}>
                            {search
                                ? `No se encontró "${search}"`
                                : 'Empieza agregando clientes'}
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

// ─── STYLES ─────────────────────────────
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: T.bg,
    },

    // HEADER
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: '900',
        color: T.textPrimary,
    },
    subtitle: {
        fontSize: 12,
        color: T.textSecondary,
    },
    addBtn: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: T.accent,
        alignItems: 'center',
        justifyContent: 'center',
        ...T.shadowAccent,
    },

    // SEARCH
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 12,
        paddingHorizontal: 14,
        height: 48,
        borderRadius: 999,
        backgroundColor: T.surfaceAlt,
        borderWidth: 1,
        borderColor: T.border,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        color: T.textPrimary,
        fontSize: 14,
    },

    // CARD
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: T.radiusLg,
        backgroundColor: T.surface,
        borderWidth: 1,
        borderColor: T.border,
        ...T.shadowCard,
    },

    avatar: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '900',
    },

    info: {
        flex: 1,
        marginLeft: 14,
    },
    name: {
        fontSize: 12,
        fontWeight: '800',
        color: T.textPrimary,
    },
    doc: {
        fontSize: 12,
        color: T.textSecondary,
        marginTop: 2,
    },
    phone: {
        fontSize: 12,
        color: T.green,
        marginTop: 4,
    },

    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: T.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: T.border,
    },

    // EMPTY
    empty: {
        alignItems: 'center',
        marginTop: 80,
        gap: 6,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: T.textPrimary,
    },
    emptySub: {
        fontSize: 13,
        color: T.textSecondary,
    },

    // LOADING
    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: T.bg,
    },
    loadingText: {
        color: T.textSecondary,
    },

    list: {
        paddingBottom: 120,
    },
});