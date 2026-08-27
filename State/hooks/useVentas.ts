// hooks/useVentas.ts
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';

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
    getSatisfaccion,
    getMetodosPago,
    getTopProductsMonth,
    getDailyTrend,
    VentaResponse,
    SatisfaccionResponse,
    MetodoPagoResponse,
    TopProductsMonthResponse,
    DailyTrendResponse,
} from '../api/ventas.api';
import { VentaFilterKey } from '../store/useVentaStore';

// 🔥 KEY CENTRALIZADA (MUY IMPORTANTE)
const ventasKeys = {
    all: ['ventas'] as const,
    hoy: () => [...ventasKeys.all, 'hoy'] as const,
    resumen: () => [...ventasKeys.all, 'resumen'] as const,
    top: () => [...ventasKeys.all, 'top'] as const,
    tienda: () => [...ventasKeys.all, 'tienda'] as const,
    rango: () => [...ventasKeys.all, 'rango'] as const,
    satisfaccion: (yearA: number, monthA: number, yearB: number, monthB: number) =>
        [...ventasKeys.all, 'satisfaccion', yearA, monthA, yearB, monthB] as const,
    metodosPago: (year: number, month: number) =>
        [...ventasKeys.all, 'metodosPago', year, month] as const,
    topProductosMonth: (month: string) =>
        [...ventasKeys.all, 'topProductosMonth', month] as const,
    dailyTrend: (days: number) =>
        [...ventasKeys.all, 'dailyTrend', days] as const,
};

interface SearchVentasVariables {
    query: any;
    page?: number;
    page_size?: number;
}

export const useVentas = (activeFilter: VentaFilterKey = 'todos') => {
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
        queryKey: [...ventasKeys.tienda(), activeFilter],
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

    // ─── CHART QUERIES ───────────────────────────────

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const satisfaccionQuery = useQuery({
        queryKey: ventasKeys.satisfaccion(currentYear, currentMonth, prevYear, prevMonth),
        queryFn: () => getSatisfaccion(currentYear, currentMonth, prevYear, prevMonth),
    });

    const metodosPagoQuery = useQuery({
        queryKey: ventasKeys.metodosPago(currentYear, currentMonth),
        queryFn: () => getMetodosPago(currentYear, currentMonth),
    });

    const topProductosMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const topProductosMonthQuery = useQuery({
        queryKey: ventasKeys.topProductosMonth(topProductosMonthStr),
        queryFn: () => getTopProductsMonth(topProductosMonthStr),
    });

    const dailyTrendQuery = useQuery({
        queryKey: ventasKeys.dailyTrend(20),
        queryFn: () => getDailyTrend(20),
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

    // Filtrar y deduplicar ventas
    const ventasPorTienda = useMemo(() => {
        const all = ventasPorTiendaQuery.data?.pages?.flatMap(p => p?.results ?? []) ?? [];
        
        // Deduplicar por ID
        const unique = new Map();
        all.forEach(v => {
            if (!unique.has(v.id)) {
                unique.set(v.id, v);
            }
        });
        
        let filtered = Array.from(unique.values());
        
        // Aplicar filtro de estado
        if (activeFilter !== 'todos') {
            filtered = filtered.filter((v) => {
                const estado = v.estado?.toLowerCase() || '';
                if (activeFilter === 'anulado') {
                    return estado.includes('anul') || estado.includes('cancel');
                }
                if (activeFilter === 'aceptado') {
                    return estado.includes('acept') || estado.includes('aprob') || estado.includes('complet');
                }
                if (activeFilter === 'pendiente') {
                    return estado.includes('pend') || estado.includes('proces');
                }
                return true;
            });
        }
        
        return filtered;
    }, [ventasPorTiendaQuery.data, activeFilter]);

    return {
        // DATA
        ventasHoy: ventasHoyQuery.data?.results,
        resumenVentas: resumenVentasQuery.data,
        topProductosHoy: topProductosQuery.data?.topProductoMostSales,

        ventasPorTienda,

        ventasPorRangoFechasTienda: ventasPorRangoQuery.data,

        // CHART DATA
        satisfaccion: satisfaccionQuery.data,
        metodosPago: metodosPagoQuery.data,
        topProductosMonth: topProductosMonthQuery.data,
        dailyTrend: dailyTrendQuery.data,

        // MANUAL REFETCH
        refreshVentasPorTienda: ventasPorTiendaQuery.refetch,
        refreshAll: async () => {
            await Promise.all([
                ventasHoyQuery.refetch(),
                resumenVentasQuery.refetch(),
                topProductosQuery.refetch(),
                ventasPorTiendaQuery.refetch(),
                ventasPorRangoQuery.refetch(),
                satisfaccionQuery.refetch(),
                metodosPagoQuery.refetch(),
                topProductosMonthQuery.refetch(),
                dailyTrendQuery.refetch(),
            ]);
        },
        // LOADING
        loadingVentasHoy: ventasHoyQuery.isLoading,
        loadingResumenVentas: resumenVentasQuery.isLoading,
        loadingTopProductosHoy: topProductosQuery.isLoading,
        loadingVentasPorRango: ventasPorRangoQuery.isLoading,
        loadingSatisfaccion: satisfaccionQuery.isLoading,
        loadingMetodosPago: metodosPagoQuery.isLoading,
        loadingTopProductosMonth: topProductosMonthQuery.isLoading,
        loadingDailyTrend: dailyTrendQuery.isLoading,

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