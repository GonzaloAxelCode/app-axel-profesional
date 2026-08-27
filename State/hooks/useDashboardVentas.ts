// hooks/useDashboardVentas.ts
import { useQuery } from '@tanstack/react-query';
import {
    getResumenVentasByDate,
    getMetodosPago,
    getTopProductsMonth,
    getDailyTrend,
    getSatisfaccion,
    obtenerResumenVentas,
    getTopCategorias,
} from '../api/ventas.api';

const dashKeys = {
    all: ['dashboard'] as const,
    resumenDia: (year: number, month: number, day: number) =>
        [...dashKeys.all, 'resumenDia', year, month, day] as const,
    resumenMes: (year: number, month: number) =>
        [...dashKeys.all, 'resumenMes', year, month] as const,
    metodosPago: (year: number, month: number) =>
        [...dashKeys.all, 'metodosPago', year, month] as const,
    topProductos: (month: string) =>
        [...dashKeys.all, 'topProductos', month] as const,
    topCategorias: (year: number, month: number) =>
        [...dashKeys.all, 'topCategorias', year, month] as const,
    dailyTrend: (days: number) =>
        [...dashKeys.all, 'dailyTrend', days] as const,
    resumenGeneral: () => [...dashKeys.all, 'resumenGeneral'] as const,
};

export const useDashboardVentas = (params: {
    selectedDate?: Date;
    selectedMonth?: number;
    selectedYear?: number;
}) => {
    const { selectedDate = new Date(), selectedMonth, selectedYear } = params;

    const day = selectedDate.getDate();
    const month = selectedMonth ?? selectedDate.getMonth();
    const year = selectedYear ?? selectedDate.getFullYear();
    const monthForApi = month + 1; // 1-indexed (August = 8)

    // Resumen del día seleccionado
    const resumenDiaQuery = useQuery({
        queryKey: dashKeys.resumenDia(year, monthForApi, day),
        queryFn: () => getResumenVentasByDate({ year, month: monthForApi, day, tipo: 'day_month_year' }),
    });

    // Resumen del mes seleccionado
    const resumenMesQuery = useQuery({
        queryKey: dashKeys.resumenMes(year, monthForApi),
        queryFn: () => getResumenVentasByDate({ year, month: monthForApi, tipo: 'month_year' }),
    });

    // Resumen general (semana)
    const resumenGeneralQuery = useQuery({
        queryKey: dashKeys.resumenGeneral(),
        queryFn: obtenerResumenVentas,
    });

    // Métodos de pago - API espera 1-indexed (August = 8)
    const metodosPagoQuery = useQuery({
        queryKey: dashKeys.metodosPago(year, monthForApi),
        queryFn: () => getMetodosPago(year, monthForApi),
    });

    // Top productos del mes seleccionado
    const monthStr = `${year}-${String(monthForApi).padStart(2, '0')}`;
    const topProductosQuery = useQuery({
        queryKey: dashKeys.topProductos(monthStr),
        queryFn: () => getTopProductsMonth(monthStr),
    });

    // Top categorías - API espera 0-indexed (August = 7)
    const topCategoriasQuery = useQuery({
        queryKey: dashKeys.topCategorias(year, month),
        queryFn: async () => {
            const result = await getTopCategorias(month, year);
            console.log('getTopCategorias called with month:', month, 'year:', year);
            console.log('Response:', JSON.stringify(result));
            return result;
        },
    });

    // Tendencia diaria
    const dailyTrendQuery = useQuery({
        queryKey: dashKeys.dailyTrend(20),
        queryFn: () => getDailyTrend(20),
    });

    return {
        // Data
        ventasDia: resumenDiaQuery.data,
        ventasMes: resumenMesQuery.data,
        resumenGeneral: resumenGeneralQuery.data,
        metodosPago: metodosPagoQuery.data,
        topProductos: topProductosQuery.data,
        topCategorias: topCategoriasQuery.data,
        dailyTrend: dailyTrendQuery.data,

        // Loading
        loadingDia: resumenDiaQuery.isLoading,
        loadingMes: resumenMesQuery.isLoading,
        loadingGeneral: resumenGeneralQuery.isLoading,
        loadingMetodosPago: metodosPagoQuery.isLoading,
        loadingTopProductos: topProductosQuery.isLoading,
        loadingTopCategorias: topCategoriasQuery.isLoading,
        loadingDailyTrend: dailyTrendQuery.isLoading,

        // Refetch
        refetchAll: async () => {
            await Promise.all([
                resumenDiaQuery.refetch(),
                resumenMesQuery.refetch(),
                resumenGeneralQuery.refetch(),
                metodosPagoQuery.refetch(),
                topProductosQuery.refetch(),
                topCategoriasQuery.refetch(),
                dailyTrendQuery.refetch(),
            ]);
        },
    };
};
