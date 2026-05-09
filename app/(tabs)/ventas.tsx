import VentaDetalleModal from "@/components/venta/VentaDetailModal";
import { buildList, formatDivider } from "@/components/VentaScreenComponents/utils";
import VentaCard from "@/components/VentaScreenComponents/VentaCard";
import T from "@/constants/THEME";
import { useVentas } from "@/State/hooks/useVentas";
import { Venta } from "@/State/models/venta.models";
import { useVentaStore } from "@/State/store/useVentaStore";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    View
} from "react-native";
import { Text } from "react-native-paper";



export default function VentasScreenPremium() {
    const {
        ventasPorTienda,
        loadingVentasHoy,
        fetchNextVentasPage,
        hasNextVentasPage,
        isFetchingNextVentasPage,
        refreshVentasPorTienda,
    } = useVentas();

    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const { temporaryVenta, showVentaDetailTemporary, } = useVentaStore();


    const listData = useMemo(
        () => buildList(ventasPorTienda ?? []),
        [ventasPorTienda],
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        try { await refreshVentasPorTienda(); }
        finally { setRefreshing(false); }
    };

    if (loadingVentasHoy) {
        return (
            <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color={T.accent} />
                <Text style={styles.loadingText}>Cargando ventas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>

            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Ventas</Text>
                    <Text style={styles.subtitle}>
                        {ventasPorTienda?.length ?? 0} registros
                    </Text>
                </View>


            </View>

            <FlatList
                data={listData}
                keyExtractor={(item, index) =>
                    item.type === 'divider' ? `d-${item.fecha}` : `v-${item.data.id}`
                }
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={T.accent}
                    />
                }
                onEndReached={() => {
                    if (hasNextVentasPage && !isFetchingNextVentasPage) fetchNextVentasPage();
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
                            <View style={styles.dividerWrap}>
                                <View style={styles.line} />
                                <Text style={styles.dividerText}>{formatDivider(item.fecha)}</Text>
                                <View style={styles.line} />
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
                    <View style={styles.emptyWrap}>
                        <View style={styles.emptyIcon}>
                            <Icon name="package-variant-closed" size={32} color={T.accent} />
                        </View>
                        <Text style={styles.emptyText}>Sin resultados</Text>
                        <Text style={styles.emptySub}>No hay ventas</Text>
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


const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: T.bg },

    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: { fontSize: 28, fontWeight: '900', color: T.textPrimary },
    subtitle: { fontSize: 12, color: T.textSecondary },

    addBtn: {
        height: 44,
        borderRadius: 50,
        backgroundColor: T.accent,
        paddingHorizontal: 13,
        display: "flex",
        flexDirection: "row",
        gap: 10,

        alignItems: 'center',
        justifyContent: 'center',
        ...T.shadowAccent,
    },

    list: { paddingBottom: 120 },

    card: {
        marginHorizontal: 20,
        marginBottom: 14,
        padding: 16,
        borderRadius: T.radiusLg,
        backgroundColor: T.surface,
        borderWidth: 1,
        borderColor: T.border,
        ...T.shadowCard,
    },

    topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },

    avatar: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { fontSize: 20, fontWeight: '900' },

    cliente: { fontSize: 15, fontWeight: '800', color: T.textPrimary },
    serie: { fontSize: 12, color: T.textSecondary, marginTop: 2 },

    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    dot: { width: 6, height: 6, borderRadius: 3 },
    badgeText: { fontSize: 11, fontWeight: '700' },

    divider: {
        height: 1,
        backgroundColor: T.border,
        marginVertical: 12,
    },

    bottomRow: { flexDirection: 'row' },

    meta: { flex: 1 },
    metaLabel: {
        fontSize: 10,
        color: T.textMuted,
        textTransform: 'uppercase',
    },
    metaValue: {
        fontSize: 13,
        color: T.textSecondary,
        marginTop: 3,
    },
    total: {
        fontSize: 20,
        fontWeight: '900',
        color: T.accent,
    },

    dividerWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    line: { flex: 1, height: 0, },
    dividerText: { fontSize: 12, color: T.textSecondary },
    count: {
        backgroundColor: T.accentDim,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    countText: { fontSize: 10, color: T.accent, fontWeight: '700' },

    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: T.bg,
        gap: 10,
    },
    loadingText: { color: T.textSecondary },
    emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyIcon: {
        width: 64, height: 64, borderRadius: 20,
        backgroundColor: T.accentDim, borderWidth: 1, borderColor: T.accent + '30',
        alignItems: 'center', justifyContent: 'center',
    },
    emptyText: { fontSize: 15, color: T.textSecondary, fontWeight: '600' },
    emptySub: { fontSize: 12, color: T.textMuted },
});