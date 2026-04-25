import { useQuery } from '@tanstack/react-query';

import { fetchInventariosPorTienda } from '../api/inventario.api';
import { Inventario, InventarioCart } from '../models/inventario.models';


export const useInventario = () => {


    const query = useQuery<Inventario[], Error>({
        queryKey: ['inventario'],
        queryFn: async () => {
            const data: any = await fetchInventariosPorTienda();

            return data;
        },

    });

    return {
        productos: query.data ?? [] as InventarioCart[],
        isLoading: query.isLoading,
        isError: query.isError,
    };
};