import { useQuery } from '@tanstack/react-query';

import { fetchInventariosPorTienda } from '../api/inventario.api';
import { Inventario, InventarioCart } from '../models/inventario.models';
import { useInventarioStore } from '../store/useInventarioStore';


export const useInventario = () => {
    const setProductos = useInventarioStore((state) => state.setProductos);

    const query = useQuery<Inventario[], Error>({
        queryKey: ['inventario'],
        queryFn: async () => {
            const data: any = await fetchInventariosPorTienda();
            setProductos(data); // guardamos en Zustand
            return data;
        },

    });

    return {
        productos: query.data ?? [] as InventarioCart[],
        isLoading: query.isLoading,
        isError: query.isError,
    };
};