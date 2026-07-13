import { useClientes as useClientesHook } from '@/State/hooks/useClientes';
import { Cliente } from '@/State/models/cliente.models';
import { useAppTheme } from '@/State/context/ThemeContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Icon, Text } from 'react-native-paper';

type ClienteFilterKey = 'dni' | 'ruc';

interface ClienteModalProps {
    visible: boolean;
    onClose: () => void;
    onClienteEncontrado: (cliente: Partial<Cliente>) => void;
    tipodoc: string;
}

export function ClientesModal({
    visible,
    onClose,
    onClienteEncontrado,
    tipodoc,
}: ClienteModalProps) {
    const { T } = useAppTheme();
    const AVATAR_COLORS = [T.accent, T.accent2, T.accent3, T.accent5];

    const makeStyles = (T: any) => StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: T.bg,
        },
        navbar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: T.border,
            backgroundColor: T.bg,
        },
        navTitleBlock: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        title: {
            fontSize: 20,
            fontWeight: '800',
            color: T.textPrimary,
        },
        countBadge: {
            backgroundColor: T.surfaceAlt,
            borderRadius: 999,
            paddingHorizontal: 8,
            paddingVertical: 2,
        },
        countText: {
            fontSize: 12,
            fontWeight: '700',
            color: T.textSecondary,
        },
        closeBtn: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: T.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
        },
        container: {
            padding: 16,
            paddingBottom: 60,
        },
        search: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: T.surface,
            borderRadius: T.radiusMd,
            paddingHorizontal: 12,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: T.border,
        },
        input: {
            flex: 1,
            paddingVertical: 12,
            color: T.textPrimary,
        },
        apiBtn: {
            backgroundColor: T.accent,
            padding: 14,
            borderRadius: T.radiusFull,
            alignItems: 'center',
            marginBottom: 12,
        },
        apiText: {
            color: T.bg,
            fontWeight: '700',
        },
        card: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 14,
            borderRadius: T.radiusLg,
            backgroundColor: T.surface,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: T.border,
            ...T.shadowCard,
        },
        avatar: {
            width: 46,
            height: 46,
            borderRadius: T.radiusMd,
            alignItems: 'center',
            justifyContent: 'center',
        },
        avatarText: {
            fontWeight: '800',
            fontSize: 16,
        },
        name: {
            fontSize: 15,
            fontWeight: '700',
            color: T.textPrimary,
        },
        doc: {
            fontSize: 12,
            color: T.textSecondary,
            marginTop: 2,
        },
        badge: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: T.radiusSm,
        },
        empty: {
            textAlign: 'center',
            marginTop: 40,
            color: T.textMuted,
        },
    });
    const styles = makeStyles(T);

    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState<ClienteFilterKey>(
        tipodoc === 'ruc' ? 'ruc' : 'dni',
    );
    const [isSearchingApi, setIsSearchingApi] = useState(false);

    const { clientes, loading, getClienteByDocument } = useClientesHook();

    useEffect(() => {
        if (tipodoc === 'dni' || tipodoc === 'ruc') setActiveFilter(tipodoc);
    }, [tipodoc]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return clientes.filter((c: Cliente) => {
            const nombre = c.fullname || c.firstname || '';
            const matchSearch =
                c.document?.includes(q) || nombre.toLowerCase().includes(q);
            const matchFilter =
                (activeFilter === 'dni' && c.document?.length === 8) ||
                (activeFilter === 'ruc' && c.document?.length === 11);
            return matchSearch && matchFilter;
        });
    }, [clientes, search, activeFilter]);

    const handleBuscarAPI = useCallback(async () => {
        if (!search || search.length < 8) return;
        try {
            setIsSearchingApi(true);
            const data: any = await getClienteByDocument(search);
            if (data?.nombre_completo || data?.nombre_o_razon_social) {
                const clienteNormalizado: Partial<Cliente> = {
                    fullname: data.nombre_o_razon_social || data.nombre_completo || '',
                    document: data.numero || '',
                };
                onClienteEncontrado(clienteNormalizado);
                onClose();
                setSearch('');
            }
        } catch {
        } finally {
            setIsSearchingApi(false);
        }
    }, [search]);

    // ── Item ──
    const renderItem = useCallback(
        ({ item }: { item: Cliente }) => {
            const nombre = item.fullname || item.firstname || '';
            const isRuc = item.document?.length === 11;
            const color = AVATAR_COLORS[(nombre?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

            return (
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.card}
                    onPress={() => {
                        onClienteEncontrado({
                            fullname:
                                item.fullname ||
                                `${item.lastname || ''} ${item.firstname || ''}`.trim(),
                            document: item.document,
                        });
                        onClose();
                    }}
                >
                    <View style={[styles.avatar, { backgroundColor: color + '20' }]}>
                        <Text style={[styles.avatarText, { color }]}>
                            {getInitials(nombre)}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.name} numberOfLines={1}>
                            {nombre || 'Sin nombre'}
                        </Text>
                        <Text style={styles.doc}>
                            {isRuc ? 'RUC' : 'DNI'} • {item.document}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.badge,
                            { backgroundColor: isRuc ? T.purple + '20' : T.green + '20' },
                        ]}
                    >
                        <Text
                            style={{
                                color: isRuc ? T.purple : T.green,
                                fontWeight: '700',
                                fontSize: 11,
                            }}
                        >
                            {isRuc ? 'RUC' : 'DNI'}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        },
        [onClienteEncontrado, onClose],
    );

    // ── Header ──
    const ListHeaderComponent = useCallback(
        () => (
            <View style={{ paddingHorizontal: 14 }}>
                <View style={styles.search}>
                    <Icon source="magnify" size={18} color={T.textMuted} />
                    <TextInput
                        placeholder="Buscar cliente..."
                        placeholderTextColor={T.textMuted}
                        value={search}
                        onChangeText={setSearch}
                        style={styles.input}
                    />
                </View>

                {filtered.length === 0 && search.length >= 8 && (
                    <TouchableOpacity
                        style={styles.apiBtn}
                        onPress={handleBuscarAPI}
                        disabled={isSearchingApi}
                    >
                        {isSearchingApi ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.apiText}>Buscar en SUNAT</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        ),
        [search, filtered.length, isSearchingApi, handleBuscarAPI],
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* ── Navbar ── */}
                <View style={styles.navbar}>
                    <View style={styles.navTitleBlock}>
                        <Text style={styles.title}>Clientes</Text>
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{filtered.length}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={8}>
                        <Icon source="close" size={22} color={T.textPrimary} />
                    </TouchableOpacity>
                </View>
                {ListHeaderComponent()}
                {/* ── Lista ── */}
                <FlatList
                    data={filtered}
                    keyExtractor={(item: any) => item.document}
                    renderItem={renderItem}

                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={
                        <Text style={styles.empty}>
                            {loading ? 'Cargando...' : 'Sin resultados'}
                        </Text>
                    }
                />
            </SafeAreaView>
        </Modal>
    );
}

const getInitials = (nombre: string) =>
    nombre
        .trim()
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');
