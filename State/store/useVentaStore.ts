import { create } from 'zustand';
import { fetchWithAuth } from '../api/client';

import { Venta } from '../models/venta.models';
import { URLS } from '../utils/endpoints';
export interface ProductsSales {
    producto_id: number;
    nombre: string;
    cantidad_total_vendida: number;
    producto_imagen?: string
    producto_nombre?: string
    cantidad: number
    precio_unitario: number
}
interface VentaStore {
    ventas: Venta[];
    ventasToday: Venta[];
    temporaryVenta: Venta;
    showVentaDetailTemporary: boolean;

    salesDateRangePerDay: [string, number][];
    todaySales: number;
    thisWeekSales: number;
    thisMonthSales: number;
    topProductoMostSales: ProductsSales[];

    ventas_search: Venta[];
    search_ventas_found: string;

    count: number;
    next: any;
    previous: any;
    index_page: any;
    length_pages: any;

    loading: boolean;
    loadingLoadVentas: boolean;
    loadingVentasToday: boolean;
    loadingCreateVenta: boolean;
    loadingGenerarComprobante: boolean;
    loadingNotaCredito: boolean;
    loadingResumenVentas: boolean;
    loadingMostSales: boolean;
    loadingSearch: boolean;

    error?: any;

    // Funciones
    loadVentas: (page?: number, page_size?: number) => Promise<void>;
    loadVentasToday: () => Promise<void>;
    createVenta: (ventaData: any) => Promise<void>;
    generateComprobante: (ventaId: number) => Promise<void>;
    cancelVenta: (ventaId: number) => Promise<void>;
    anularVenta: (ventaId: number, options: any) => Promise<void>;
    loadResumenVentas: () => Promise<void>;
    loadTopProductosVentasHoy: () => Promise<void>;
    loadVentasRangoFechas: (startDate: string, endDate: string) => Promise<void>;
    searchVentas: (query: string, page?: number, page_size?: number) => Promise<void>;
    clearVentaTemporal: () => void;
    clearVentaSearch: () => void;
}

export const useVentaStore = create<VentaStore>((set, get) => ({
    ventas: [],
    ventasToday: [],
    temporaryVenta: {} as Venta,
    showVentaDetailTemporary: false,

    salesDateRangePerDay: [],
    todaySales: 0,
    thisWeekSales: 0,
    thisMonthSales: 0,
    topProductoMostSales: [],

    ventas_search: [],
    search_ventas_found: '',

    count: 0,
    next: null,
    previous: null,
    index_page: null,
    length_pages: null,

    loading: false,
    loadingLoadVentas: false,
    loadingVentasToday: false,
    loadingCreateVenta: false,
    loadingGenerarComprobante: false,
    loadingNotaCredito: false,
    loadingResumenVentas: false,
    loadingMostSales: false,
    loadingSearch: false,

    error: null,

    // Funciones
    loadVentas: async (page = 1, page_size = 10) => {
        set({ loadingLoadVentas: true, error: null });
        try {
            const res = await fetchWithAuth(`${URLS.VENTAS_POR_TIENA}?page=${page}&page_size=${page_size}`);
            set({
                ventas: res.results,
                count: res.count,
                next: res.next,
                previous: res.previous,
                index_page: res.index_page,
                length_pages: res.length_pages,
                loadingLoadVentas: false,
            });
        } catch (error) {
            set({ loadingLoadVentas: false, error });
        }
    },

    loadVentasToday: async () => {
        set({ loadingVentasToday: true, error: null });
        try {
            const res = await fetchWithAuth(`${URLS.VENTAS_HOY}`);
            set({ ventasToday: res.results, loadingVentasToday: false });
        } catch (error) {
            set({ loadingVentasToday: false, error });
        }
    },

    createVenta: async (ventaData) => {
        set({ loadingCreateVenta: true, error: null });
        try {
            const res = await fetchWithAuth(URLS.CREAR_VENTA, { method: 'POST', body: JSON.stringify(ventaData) });
            set((state) => ({
                ventas: [...state.ventas, res],
                temporaryVenta: res,
                showVentaDetailTemporary: true,
                loadingCreateVenta: false,
            }));
        } catch (error) {
            set({ loadingCreateVenta: false, error });
        }
    },

    generateComprobante: async (ventaId) => {
        set({ loadingGenerarComprobante: true, error: null });
        try {
            const res = await fetchWithAuth(`${URLS.GENERAR_COMPROBANTE}/${ventaId}`, { method: 'POST' });
            set((state) => ({
                ventas: state.ventas.map(v => v.id === ventaId ? res : v),
                ventas_search: state.ventas_search.map(v => v.id === ventaId ? res : v),
                temporaryVenta: res,
                showVentaDetailTemporary: true,
                loadingGenerarComprobante: false,
            }));
        } catch (error) {
            set({ loadingGenerarComprobante: false, error });
        }
    },

    cancelVenta: async (ventaId) => {
        set({ loading: true, error: null });
        try {
            await fetchWithAuth(`${URLS.CANCELAR_VENTA}/${ventaId}`, { method: 'POST' });
            set((state) => ({
                ventas: state.ventas.map(v => v.id === ventaId ? { ...v, estado: 'Cancelada' } : v),
                loading: false,
            }));
        } catch (error) {
            set({ loading: false, error });
        }
    },

    anularVenta: async (ventaId: number, options: any) => {
        set({ loadingNotaCredito: true, error: null });
        try {
            const res = await fetchWithAuth(`${URLS.ANULAR_VENTA}/`, { method: 'POST', body: JSON.stringify(options) });
            set((state) => ({
                ventas: state.ventas.map(v => v.id === ventaId ? { ...v, comprobante_nota_credito: res.comprobante_nota_credito } : v),
                ventasToday: state.ventasToday.map(v => v.id === ventaId ? { ...v, comprobante_nota_credito: res.comprobante_nota_credito } : v),
                temporaryVenta: { ...state.temporaryVenta, comprobante_nota_credito: res.comprobante_nota_credito, venta_estado: res.venta_estado, estado: res.venta_estado },
                loadingNotaCredito: false,
            }));
        } catch (error) {
            set({ loadingNotaCredito: false, error });
        }
    },

    loadResumenVentas: async () => {
        set({ loadingResumenVentas: true, error: null });
        try {
            const res = await fetchWithAuth(URLS.RESUMEN_VENTAS);
            set({
                todaySales: res.todaySales,
                thisWeekSales: res.thisWeekSales,
                thisMonthSales: res.thisMonthSales,
                loadingResumenVentas: false,
            });
        } catch (error) {
            set({ loadingResumenVentas: false, error });
        }
    },

    loadTopProductosVentasHoy: async () => {
        set({ loadingMostSales: true, error: null });
        try {
            const res = await fetchWithAuth(URLS.TOP_PRODUCTOS_HOY);
            set({ topProductoMostSales: res, loadingMostSales: false });
        } catch (error) {
            set({ loadingMostSales: false, error });
        }
    },

    loadVentasRangoFechas: async (startDate, endDate) => {
        set({ loading: true, error: null });
        try {
            const res = await fetchWithAuth(`${URLS.VENTAS_POR_RANGO}?start=${startDate}&end=${endDate}`);
            set({ salesDateRangePerDay: res, loading: false });
        } catch (error) {
            set({ loading: false, error });
        }
    },

    searchVentas: async (query, page = 1, page_size = 10) => {
        set({ loadingSearch: true, error: null });
        try {
            const res = await fetchWithAuth(`${URLS.SEARCH_VENTAS}?q=${query}&page=${page}&page_size=${page_size}`);
            set({
                ventas_search: res.results,
                search_ventas_found: res.search_ventas_found,
                count: res.count,
                next: res.next,
                previous: res.previous,
                index_page: res.index_page,
                length_pages: res.length_pages,
                loadingSearch: false,
            });
        } catch (error) {
            set({ loadingSearch: false, error });
        }
    },

    clearVentaTemporal: () => {
        set({ temporaryVenta: {} as Venta, showVentaDetailTemporary: false });
    },

    clearVentaSearch: () => {
        set({
            ventas_search: [],
            search_ventas_found: '',
            count: 0,
            next: null,
            previous: null,
            index_page: null,
            length_pages: null,
            loadingSearch: false,
        });
    },
}));