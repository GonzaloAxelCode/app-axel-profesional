// hooks/useVentas.ts
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import {
    anularVenta,
    cancelarVenta,
    createVenta,
    createVentaAnonima,
    createVentaPendiente,
    fetchSearchVentas,
    generarComprobanteVenta,
    getResumenVentasByDate,
    getTopProductosMasVendidosHoy,
    getVentasHoy,
    getVentasPorRangoFechasTienda,
    getVentasPorTienda,
    obtenerResumenVentas,
    VentaResponse,
} from '../api/ventas.api';

// 🔥 KEY CENTRALIZADA (MUY IMPORTANTE)
const ventasKeys = {
    all: ['ventas'] as const,
    hoy: () => [...ventasKeys.all, 'hoy'] as const,
    resumen: () => [...ventasKeys.all, 'resumen'] as const,
    top: () => [...ventasKeys.all, 'top'] as const,
    tienda: () => [...ventasKeys.all, 'tienda'] as const,
    rango: () => [...ventasKeys.all, 'rango'] as const,
};

interface SearchVentasVariables {
    query: any;
    page?: number;
    page_size?: number;
}

export const useVentas = () => {
    const queryClient = useQueryClient();

    // ─── QUERIES ─────────────────────────────────────

    const ventasHoyQuery = useQuery({
        queryKey: ventasKeys.hoy(),
        queryFn: getVentasHoy,
    });

    const resumenVentasQuery = useQuery({
        queryKey: ventasKeys.resumen(),
        queryFn: obtenerResumenVentas,
    });

    const topProductosQuery = useQuery({
        queryKey: ventasKeys.top(),
        queryFn: getTopProductosMasVendidosHoy,
    });

    const ventasPorTiendaQuery = useInfiniteQuery({
        queryKey: ventasKeys.tienda(),
        queryFn: ({ pageParam = 1 }) =>
            getVentasPorTienda([2025, 1, 1], [2027, 1, 1], pageParam, 30),

        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= lastPage?.length_pages ? nextPage : undefined;
        },

        initialPageParam: 1,
    });

    const ventasPorRangoQuery = useQuery({
        queryKey: ventasKeys.rango(),
        queryFn: () =>
            getVentasPorRangoFechasTienda(
                new Date(2025, 1, 1),
                new Date(2027, 1, 1)
            ),
    });

    // ─── MUTACIONES ─────────────────────────────────

    const invalidateAllVentas = () => {
        queryClient.invalidateQueries({ queryKey: ventasKeys.all });
    };

    const createVentaMutation = useMutation({
        mutationFn: createVenta,
        onSuccess: invalidateAllVentas,
    });

    const createVentaPendienteMutation = useMutation({
        mutationFn: createVentaPendiente,
        onSuccess: invalidateAllVentas,
    });

    const createVentaAnonimaMutation = useMutation({
        mutationFn: createVentaAnonima,
        onSuccess: invalidateAllVentas,
    });

    const cancelarVentaMutation = useMutation({
        mutationFn: cancelarVenta,
        onSuccess: invalidateAllVentas,
    });

    const anularVentaMutation = useMutation({
        mutationFn: ({ ventaId, motivo, tipo_motivo, anonima }: {
            ventaId: number;
            motivo: string;
            tipo_motivo: string;
            anonima: boolean;
        }) => anularVenta(ventaId, motivo, tipo_motivo, anonima),
        onSuccess: invalidateAllVentas,
    });

    const generarComprobanteMutation = useMutation({
        mutationFn: generarComprobanteVenta,
        onSuccess: invalidateAllVentas,
    });

    const resumenVentasByDateMutation = useMutation({
        mutationFn: getResumenVentasByDate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ventasKeys.resumen() });
        },
    });

    const searchVentasMutation = useMutation<
        VentaResponse,
        Error,
        SearchVentasVariables
    >({
        mutationFn: ({ query, page = 1, page_size = 30 }) =>
            fetchSearchVentas(query, page, page_size),
    });

    // ─── RETURN LIMPIO ──────────────────────────────

    return {
        // DATA
        ventasHoy: ventasHoyQuery.data?.results,
        resumenVentas: resumenVentasQuery.data,
        topProductosHoy: topProductosQuery.data?.topProductoMostSales,

        ventasPorTienda:
            ventasPorTiendaQuery.data?.pages?.flatMap(p => p?.results ?? []) ?? [],

        ventasPorRangoFechasTienda: ventasPorRangoQuery.data,
        // MANUAL REFETCH
        refreshVentasPorTienda: ventasPorTiendaQuery.refetch,
        refreshAll: async () => {
            await Promise.all([
                ventasHoyQuery.refetch(),
                resumenVentasQuery.refetch(),
                topProductosQuery.refetch(),
                ventasPorTiendaQuery.refetch(),
                ventasPorRangoQuery.refetch(),
            ]);
        },
        // LOADING
        loadingVentasHoy: ventasHoyQuery.isLoading,
        loadingResumenVentas: resumenVentasQuery.isLoading,
        loadingTopProductosHoy: topProductosQuery.isLoading,
        loadingVentasPorRango: ventasPorRangoQuery.isLoading,

        // INFINITE
        fetchNextVentasPage: ventasPorTiendaQuery.fetchNextPage,
        hasNextVentasPage: ventasPorTiendaQuery.hasNextPage,
        isFetchingNextVentasPage: ventasPorTiendaQuery.isFetchingNextPage,

        // MUTATIONS
        createVenta: createVentaMutation.mutate,
        createVentaPendiente: createVentaPendienteMutation.mutate,
        createVentaAnonima: createVentaAnonimaMutation.mutate,
        cancelarVenta: cancelarVentaMutation.mutate,
        anularVenta: anularVentaMutation.mutate,
        generarComprobante: generarComprobanteMutation.mutate,
        getResumenVentasByDate: resumenVentasByDateMutation.mutate,
        searchVentas: searchVentasMutation.mutate,

        // STATES
        loadingCreateVenta: createVentaMutation.isPending,
    };
};