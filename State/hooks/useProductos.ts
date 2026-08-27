// hooks/useProductos.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchWithAuth } from '../api/client';
import { ProductosResponse } from '../models/producto.models';
import { URLS } from '../utils/endpoints';

export const useProductos = (page_size = 10) => {

    const productosQuery = useInfiniteQuery<ProductosResponse, Error>({
        queryKey: ['productosInfinite'],
        queryFn: async ({ pageParam = 1 }) => {
            const url = `${URLS.PRODUCTOS}?page=${pageParam}&page_size=${page_size}`;
            return fetchWithAuth(url);
        },

        initialPageParam: 1,

        getNextPageParam: (lastPage, allPages) => {
            // 👇 IMPORTANTE: depende de tu backend
            // opción 1: si tienes next
            if (lastPage.next) return allPages.length + 1;

            // opción 2: si tienes total páginas
            if (lastPage.length_pages) {
                const next = allPages.length + 1;
                return next <= lastPage.length_pages ? next : undefined;
            }

            // fallback
            return undefined;
        },
    });

    // 🔥 flatten y eliminar duplicados
    const productos = useMemo(() => {
        const all = productosQuery.data?.pages?.flatMap(p => p.results ?? []) ?? [];
        const unique = new Map();
        all.forEach(p => {
            if (!unique.has(p.id)) {
                unique.set(p.id, p);
            }
        });
        return Array.from(unique.values());
    }, [productosQuery.data]);

    return {
        productos,
        loadProductos: productosQuery.refetch,
        isLoading: productosQuery.isLoading,
        error: productosQuery.error,

        fetchNextProductosPage: productosQuery.fetchNextPage,
        hasNextProductosPage: productosQuery.hasNextPage,
        isFetchingNextProductosPage: productosQuery.isFetchingNextPage,

        refetchProductos: productosQuery.refetch,
    };
};