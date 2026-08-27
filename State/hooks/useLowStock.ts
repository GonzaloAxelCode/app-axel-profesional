// hooks/useLowStock.ts
import { useQuery } from '@tanstack/react-query';
import { getLowStockProducts } from '../api/ventas.api';

const lowStockKeys = {
    all: ['lowStock'] as const,
    products: () => [...lowStockKeys.all, 'products'] as const,
};

export const useLowStock = () => {
    const lowStockQuery = useQuery({
        queryKey: lowStockKeys.products(),
        queryFn: getLowStockProducts,
    });

    return {
        lowStockData: lowStockQuery.data,
        lowStockProducts: lowStockQuery.data?.lowStockProducts ?? [],
        loading: lowStockQuery.isLoading,
        refetch: lowStockQuery.refetch,
    };
};
