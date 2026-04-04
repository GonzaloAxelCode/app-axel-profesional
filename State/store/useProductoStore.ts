// stores/useProductoStore.ts
import { create } from 'zustand';
import { fetchWithAuth } from '../api/client';
import { ProductoState } from '../models/producto.models';
import { URLS } from '../utils/endpoints';


export const useProductoStore = create<ProductoState>((set, get) => ({
    productos: [],
    count: 0,
    next: null,
    previous: null,
    index_page: null,
    length_pages: null,
    loading: false,
    error: null,

    loadProductos: async (page = 1, page_size = 10) => {
        set({ loading: true, error: null });
        try {
            const url = `${URLS.PRODUCTOS}?page=${page}&page_size=${page_size}`;
            const response = await fetchWithAuth(url);

            set({
                productos: response.results,
                count: response.count,
                next: response.next,
                previous: response.previous,
                index_page: response.index_page,
                length_pages: response.length_pages,
                loading: false,
            });
        } catch (error) {
            set({ loading: false, error });
        }
    },
}));