import { useAppTheme } from '@/State/context/ThemeContext';
import { useClientes } from '@/State/hooks/useClientes';
import { Cliente } from '@/State/models/cliente.models';
import { useClienteStore } from '@/State/store/useClienteStore';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    Linking,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Text } from 'react-native-paper';

// ─── helpers ─────────────────────────────
const getInitial = (name: string) =>
    name?.trim()?.charAt(0)?.toUpperCase() ?? '?';

const AVATAR_COLORS = ['#C6FF00', '#6DFF7A', '#3BA7FF', '#f9a8d4', '#F8FF72', '#9B6DFF'];
const getAvatarColor = (n: string) =>
    AVATAR_COLORS[(n?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

const isRuc = (doc: string) => doc?.length === 11;
const docLabel = (doc: string) => (isRuc(doc) ? 'RUC' : 'DNI');

type FilterKey = 'todos' | 'dni' | 'ruc';

const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'dni', label: 'DNI' },
    { key: 'ruc', label: 'RUC' },
];

// ─── CARD PREMIUM ───────────────────────
function ClienteCard({ cliente, index, T }: { cliente: Cliente; index: number; T: any }) {
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

    const openWhatsApp = () => {
        if (cliente.phone) {
            // Limpiar todo excepto números
            let cleanPhone = cliente.phone.replace(/\D/g, '');
            // Quitar código de país 51 si existe
            if (cleanPhone.startsWith('51') && cleanPhone.length > 9) {
                cleanPhone = cleanPhone.substring(2);
            }
            // Quitar 0 inicial si existe
            if (cleanPhone.startsWith('0')) {
                cleanPhone = cleanPhone.substring(1);
            }
            const url = `https://wa.me/51${cleanPhone}`;
            Linking.openURL(url);
        }
    };

    return (
        <Animated.View style={{ transform: [{ scale }], opacity }}>
            <TouchableOpacity style={[styles.card, { backgroundColor: T.surface, borderColor: T.border }]} activeOpacity={0.9}>

                {/* Avatar */}
                <View style={[styles.avatar, { backgroundColor: color + '22' }]}>
                    <Text style={[styles.avatarText, { color }]}>
                        {getInitial(cliente.fullname)}
                    </Text>
                </View>

                {/* Info */}
                <View style={styles.info}>
                    <Text style={[styles.name, { color: T.textPrimary }]} numberOfLines={1}>
                        {cliente.fullname || 'Sin nombre'}
                    </Text>

                    <Text style={[styles.doc, { color: T.textSecondary }]}>
                        {docLabel(cliente.document)} · {cliente.document}
                    </Text>

                    {cliente.address && (
                        <Text style={[styles.extra, { color: T.textMuted }]} numberOfLines={1}>
                            {cliente.address}
                        </Text>
                    )}

                    {cliente.email && (
                        <Text style={[styles.extra, { color: T.textMuted }]} numberOfLines={1}>
                            {cliente.email}
                        </Text>
                    )}
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    {cliente.phone && (
                        <TouchableOpacity
                            style={[styles.iconBtn, { backgroundColor: '#25D366' + '18', borderColor: '#25D366' + '30' }]}
                            onPress={openWhatsApp}
                        >
                            <Icon name="whatsapp" size={18} color="#25D366" />
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

// ─── SCREEN ─────────────────────────────
export default function ClientesScreenPremium() {
    const { T } = useAppTheme();
    const { clientes, loading, } = useClientes();
    const { search, setSearch, activeFilter, setActiveFilter, filtrar, clientesFiltrados } = useClienteStore();

    const inputRef = useRef<TextInput>(null);
    const [focus, setFocus] = useState(false);

    useEffect(() => {
        filtrar(clientes);
    }, [search, clientes, activeFilter]);

    const clearSearch = () => {
        setSearch('');
        inputRef.current?.blur();
    };

    if (loading) {
        return (
            <View style={[styles.screen, { backgroundColor: T.bg }]}>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title, { color: T.textPrimary }]}>Clientes</Text>
                        <Text style={[styles.subtitle, { color: T.textSecondary }]}>Cargando...</Text>
                    </View>
                </View>
                <View style={[styles.center, { paddingBottom: 100 }]}>
                    <ActivityIndicator size="large" color={T.accent} />
                    <Text style={[styles.centerText, { color: T.textSecondary }]}>Cargando clientes...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.screen, { backgroundColor: T.bg }]}>

            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: T.textPrimary }]}>Clientes</Text>
                    <Text style={[styles.subtitle, { color: T.textSecondary }]}>
                        {clientesFiltrados.length} registros
                    </Text>
                </View>
            </View>

            {/* SEARCH */}
            <View style={[
                styles.search,
                { backgroundColor: T.surfaceAlt, borderColor: T.border },
                focus && { borderColor: T.accent }
            ]}>
                <Icon name="magnify" size={18} color={T.textMuted} />

                <TextInput
                    ref={inputRef}
                    style={[styles.input, { color: T.textPrimary }]}
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

            {/* FILTERS */}
            <View style={styles.filtersWrap}>
                {FILTERS.map((f) => {
                    const active = activeFilter === f.key;
                    return (
                        <TouchableOpacity
                            key={f.key}
                            onPress={() => setActiveFilter(f.key)}
                            style={[styles.filterBtn, { backgroundColor: active ? T.accent : T.surfaceAlt }]}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterText, { color: active ? T.bg : T.textSecondary }]}>
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* LIST */}
            <FlatList
                data={clientesFiltrados}
                keyExtractor={(item) => item.document}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <ClienteCard cliente={item} index={index} T={T} />
                )}
                ListEmptyComponent={
                    <View style={[styles.empty, { paddingBottom: 100 }]}>
                        <View style={[styles.emptyIcon, { backgroundColor: T.accent + '18' }]}>
                            <Icon name="account-off-outline" size={36} color={T.accent} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: T.textPrimary }]}>
                            {search ? 'Sin resultados' : 'Sin clientes'}
                        </Text>
                        <Text style={[styles.emptySub, { color: T.textSecondary }]}>
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
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    centerText: {
        fontSize: 14,
        fontWeight: '600',
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
    },
    subtitle: {
        fontSize: 12,
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
        borderWidth: 1,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
    },

    // FILTERS
    filtersWrap: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 12,
        gap: 8,
    },
    filterBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: 'transparent',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'transparent',
    },

    // CARD
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        borderWidth: 1,
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
    },
    doc: {
        fontSize: 12,
        marginTop: 2,
    },
    extra: {
        fontSize: 11,
        marginTop: 2,
    },

    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },

    // EMPTY
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 60,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
    },
    emptySub: {
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 20,
    },

    list: {
        paddingBottom: 120,
    },
});
