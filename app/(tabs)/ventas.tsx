import VentaDetalleModal from "@/components/venta/VentaDetailModal";
import { buildList, formatDivider } from "@/components/VentaScreenComponents/utils";
import VentaCard from "@/components/VentaScreenComponents/VentaCard";
import { useAppTheme } from "@/State/context/ThemeContext";
import { useVentas } from "@/State/hooks/useVentas";
import { Venta } from "@/State/models/venta.models";
import { useVentaStore, VentaFilterKey } from "@/State/store/useVentaStore";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import { Text } from "react-native-paper";

const FILTERS: { key: VentaFilterKey; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'aceptado', label: 'Aceptados' },
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'anulado', label: 'Anulados' },
];

export default function VentasScreenPremium() {
    const { T } = useAppTheme();
    const { temporaryVenta, showVentaDetailTemporary, activeFilter, setActiveFilter } = useVentaStore();
    const {
        ventasPorTienda,
        loadingVentasHoy,
        fetchNextVentasPage,
        hasNextVentasPage,
        isFetchingNextVentasPage,
        refreshVentasPorTienda,
    } = useVentas(activeFilter);

    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    const listData = useMemo(
        () => buildList(ventasPorTienda ?? []),
        [ventasPorTienda],
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        try { await refreshVentasPorTienda(); }
        finally { setRefreshing(false); }
    };

    const st = styles(T);

    if (loadingVentasHoy) {
        return (
            <View style={st.loadingWrap}>
                <ActivityIndicator size="large" color={T.accent} />
                <Text style={{ color: T.textSecondary }}>Cargando ventas...</Text>
            </View>
        );
    }

    return (
        <View style={st.screen}>
            <View style={st.header}>
                <View>
                    <Text style={st.title}>Ventas</Text>
                    <Text style={st.subtitle}>{listData.filter(i => i.type === 'venta').length} registros</Text>
                </View>
            </View>

            {/* Filtros */}
            <View style={st.filtersWrap}>
                {FILTERS.map((f) => {
                    const active = activeFilter === f.key;
                    return (
                        <TouchableOpacity
                            key={f.key}
                            onPress={() => setActiveFilter(f.key)}
                            style={[st.filterBtn, active && st.filterBtnActive]}
                            activeOpacity={0.7}
                        >
                            <Text style={[st.filterText, active && st.filterTextActive]}>
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <FlatList
                data={listData}
                keyExtractor={(item, index) =>
                    item.type === 'divider' ? `d-${item.fecha}` : `v-${item.data.id}`
                }
                contentContainerStyle={st.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={T.accent} />
                }
                onEndReached={() => {
                    if (hasNextVentasPage && !isFetchingNextVentasPage) {
                        fetchNextVentasPage();
                    }
                }}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                    isFetchingNextVentasPage ? (
                        <ActivityIndicator size="small" color={T.accent} style={{ marginVertical: 16 }} />
                    ) : null
                }
                renderItem={({ item }) => {
                    if (item.type === 'divider') {
                        return (
                            <View style={st.dividerWrap}>
                                <View style={st.line} />
                                <Text style={st.dividerText}>{formatDivider(item.fecha)}</Text>
                                <View style={st.line} />
                            </View>
                        );
                    }
                    return (
                        <VentaCard
                            venta={item.data}
                            onPress={() => {
                                useVentaStore.setState({
                                    temporaryVenta: item.data,
                                    showVentaDetailTemporary: true
                                });
                            }}
                        />
                    );
                }}
                ListEmptyComponent={
                    <View style={st.emptyWrap}>
                        <View style={st.emptyIcon}>
                            <Icon name="package-variant-closed" size={32} color={T.accent} />
                        </View>
                        <Text style={{ fontSize: 15, color: T.textSecondary, fontWeight: '600' }}>Sin resultados</Text>
                        <Text style={{ fontSize: 12, color: T.textMuted }}>No hay ventas</Text>
                    </View>
                }
            />

            <VentaDetalleModal
                venta={temporaryVenta}
                visible={showVentaDetailTemporary}
                onClose={() =>
                    useVentaStore.setState({
                        showVentaDetailTemporary: false,
                        temporaryVenta: {} as Venta
                    })
                }
            />
        </View>
    );
}

const styles = (T: any) => StyleSheet.create({
    screen: { flex: 1, backgroundColor: T.bg },
    header: {
        paddingTop: 60, paddingHorizontal: 20, marginBottom: 10,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    title: { fontSize: 28, fontWeight: '900', color: T.textPrimary },
    subtitle: { fontSize: 12, color: T.textSecondary },
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
        backgroundColor: T.surfaceAlt,
    },
    filterBtnActive: {
        backgroundColor: T.accent,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: T.textSecondary,
    },
    filterTextActive: {
        color: T.bg,
    },
    list: { paddingBottom: 120 },
    dividerWrap: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 20,
    },
    line: { flex: 1, height: 0 },
    dividerText: { fontSize: 12, color: T.textSecondary },
    loadingWrap: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: T.bg, gap: 10,
    },
    emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyIcon: {
        width: 64, height: 64, borderRadius: 20,
        backgroundColor: T.accentDim, borderWidth: 1, borderColor: T.accent + '30',
        alignItems: 'center', justifyContent: 'center',
    },
});
