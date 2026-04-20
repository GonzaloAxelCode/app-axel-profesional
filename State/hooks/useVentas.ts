// hooks/useVentas.ts
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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


interface SearchVentasVariables {
    query: any;
    page?: number;
    page_size?: number;
}
export const useVentas = () => {
    const queryClient = useQueryClient();

    // Consultas
    const ventasHoyQuery = useQuery({
        queryKey: ['ventasHoy'],
        queryFn: getVentasHoy,
    });

    const resumenVentasQuery = useQuery({
        queryKey: ['resumenVentas'],
        queryFn: obtenerResumenVentas,
    });

    const topProductosQuery = useQuery({
        queryKey: ['topProductosHoy'],
        queryFn: getTopProductosMasVendidosHoy,
    });

    const ventasPorTiendaQuery_old = useQuery({
        queryKey: ['ventasPorTienda'],
        queryFn: () => getVentasPorTienda([2025, 1, 1], [2027, 1, 1], 4), // el terce parametro es el page_size
    });
    const ventasPorTiendaQuery = useInfiniteQuery({
        queryKey: ['ventasPorTiendaInfinite'],
        queryFn: ({ pageParam }) => {
            console.log('🔄 Fetching page:', pageParam);
            return getVentasPorTienda([2025, 1, 1], [2027, 1, 1], pageParam, 30);
        },
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;  // 👈 calculamos la página nosotros
            console.log('📄 nextPage:', nextPage, '/ total:', lastPage?.length_pages);

            return nextPage <= lastPage?.length_pages ? nextPage : undefined;
        },
        initialPageParam: 1,
    });
    const ventasPorRangoQuery = useQuery({
        queryKey: ['ventasPorRango'],
        queryFn: () => getVentasPorRangoFechasTienda(new Date(2025, 1, 1), new Date(2027, 1, 1)),
    });

    // Mutaciones
    const createVentaMutation = useMutation({
        mutationFn: createVenta,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ventasHoy'] }),
    });

    const createVentaPendienteMutation = useMutation({
        mutationFn: createVentaPendiente,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ventasHoy'] }),
    });

    const createVentaAnonimaMutation = useMutation({
        mutationFn: createVentaAnonima,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ventasHoy'] }),
    });

    const cancelarVentaMutation = useMutation({
        mutationFn: cancelarVenta,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ventasHoy'] }),
    });
    // Mutación para buscar ventas
    const searchVentasMutation = useMutation<VentaResponse, Error, SearchVentasVariables>({
        mutationFn: ({ query, page = 1, page_size = 30 }) =>
            fetchSearchVentas(query, page, page_size),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ventasHoy'] });
        },
    });

    // Mutación para anular una venta
    const anularVentaMutation = useMutation({
        mutationFn: ({ ventaId, motivo, tipo_motivo, anonima }: {
            ventaId: number;
            motivo: string;
            tipo_motivo: string;
            anonima: boolean;
        }) => anularVenta(ventaId, motivo, tipo_motivo, anonima),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ventasHoy'] });
        },
    });
    const generarComprobanteMutation = useMutation({
        mutationFn: generarComprobanteVenta,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ventasHoy'] }),
    });

    const resumenVentasByDateMutation = useMutation({
        mutationFn: getResumenVentasByDate,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumenVentas'] }),
    });


    const fetchNextVentasPage = () => ventasPorTiendaQuery.fetchNextPage();
    const hasNextVentasPage = ventasPorTiendaQuery.hasNextPage;
    const isFetchingNextVentasPage = ventasPorTiendaQuery.isFetchingNextPage;


    const refetchVentas = () => ventasPorTiendaQuery.refetch(); // ← agregar esto

    console.log('pages:', ventasPorTiendaQuery.data?.pages);
    return {
        // Queries
        ventasHoy: ventasHoyQuery.data?.results,
        resumenVentas: resumenVentasQuery.data,
        topProductosHoy: topProductosQuery.data?.topProductoMostSales,

        ventasPorTienda: ventasPorTiendaQuery.data?.pages?.flatMap(p => p?.results ?? []) ?? [],
        refetchVentas: refetchVentas, // ← agregar esto


        fetchNextVentasPage,
        hasNextVentasPage,
        isFetchingNextVentasPage,
        //inifnity ventas


        ventasPorRangoFechasTienda: ventasPorRangoQuery.data,

        loadingVentasHoy: ventasHoyQuery.isLoading,
        loadingResumenVentas: resumenVentasQuery.isLoading,
        loadingTopProductosHoy: topProductosQuery.isLoading,
        loadingVentasPorRango: ventasPorRangoQuery.isLoading,

        // Mutaciones
        createVenta: createVentaMutation.mutate,
        createVentaPendiente: createVentaPendienteMutation.mutate,
        createVentaAnonima: createVentaAnonimaMutation.mutate,
        cancelarVenta: cancelarVentaMutation.mutate,
        searchVentas: searchVentasMutation.mutate,
        anularVenta: anularVentaMutation.mutate,
        generarComprobante: generarComprobanteMutation.mutate,
        getResumenVentasByDate: resumenVentasByDateMutation.mutate,

        // Estados de mutaciones
        loadingCreateVenta: createVentaMutation.isPending,
        loadingCancelarVenta: cancelarVentaMutation.isPending,
        loadingAnularVenta: anularVentaMutation.isPending,
        loadingGenerarComprobante: generarComprobanteMutation.isPending,
    };
};