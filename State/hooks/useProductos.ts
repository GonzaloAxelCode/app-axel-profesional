// hooks/useProductos.ts
import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '../api/client';
import { ProductosResponse } from '../models/producto.models';
import { URLS } from '../utils/endpoints';


export const useProductos = (page = 1, page_size = 10) => {
    return useQuery<ProductosResponse, Error>({
        queryKey: ['productos', page, page_size],
        queryFn: async () => {
            const url = `${URLS.PRODUCTOS}?page=${page}&page_size=${page_size}`;
            return fetchWithAuth(url);
        },

    });
};