// hooks/useDailySummary.ts
import { useQuery } from '@tanstack/react-query';
import {
    getDailySummary,
    getDailyPaymentMethods,
    getDailyPeakHours,
    getDailyTopProducts,
    getDailyTopCategories,
    getDailyRecentSales,
    getDailyCustomers,
} from '../api/ventas.api';

const dailyKeys = {
    all: ['daily'] as const,
    summary: () => [...dailyKeys.all, 'summary'] as const,
    paymentMethods: () => [...dailyKeys.all, 'paymentMethods'] as const,
    peakHours: () => [...dailyKeys.all, 'peakHours'] as const,
    topProducts: () => [...dailyKeys.all, 'topProducts'] as const,
    topCategories: () => [...dailyKeys.all, 'topCategories'] as const,
    recentSales: () => [...dailyKeys.all, 'recentSales'] as const,
    customers: () => [...dailyKeys.all, 'customers'] as const,
};

export const useDailySummary = () => {
    const summaryQuery = useQuery({
        queryKey: dailyKeys.summary(),
        queryFn: getDailySummary,
    });

    const paymentMethodsQuery = useQuery({
        queryKey: dailyKeys.paymentMethods(),
        queryFn: getDailyPaymentMethods,
    });

    const peakHoursQuery = useQuery({
        queryKey: dailyKeys.peakHours(),
        queryFn: getDailyPeakHours,
    });

    const topProductsQuery = useQuery({
        queryKey: dailyKeys.topProducts(),
        queryFn: getDailyTopProducts,
    });

    const topCategoriesQuery = useQuery({
        queryKey: dailyKeys.topCategories(),
        queryFn: getDailyTopCategories,
    });

    const recentSalesQuery = useQuery({
        queryKey: dailyKeys.recentSales(),
        queryFn: getDailyRecentSales,
    });

    const customersQuery = useQuery({
        queryKey: dailyKeys.customers(),
        queryFn: getDailyCustomers,
    });

    return {
        // Data
        summary: summaryQuery.data,
        paymentMethods: paymentMethodsQuery.data,
        peakHours: peakHoursQuery.data,
        topProducts: topProductsQuery.data,
        topCategories: topCategoriesQuery.data,
        recentSales: recentSalesQuery.data,
        customers: customersQuery.data,

        // Loading
        loadingSummary: summaryQuery.isLoading,
        loadingPaymentMethods: paymentMethodsQuery.isLoading,
        loadingPeakHours: peakHoursQuery.isLoading,
        loadingTopProducts: topProductsQuery.isLoading,
        loadingTopCategories: topCategoriesQuery.isLoading,
        loadingRecentSales: recentSalesQuery.isLoading,
        loadingCustomers: customersQuery.isLoading,

        // Refetch
        refetchAll: async () => {
            await Promise.all([
                summaryQuery.refetch(),
                paymentMethodsQuery.refetch(),
                peakHoursQuery.refetch(),
                topProductsQuery.refetch(),
                topCategoriesQuery.refetch(),
                recentSalesQuery.refetch(),
                customersQuery.refetch(),
            ]);
        },
    };
};
