// api/ventas.api.ts

import { CreateVenta, Venta } from '../models/venta.models';
import { ProductoVendidoResumen, ProductsSales } from '../store/useVentaStore';
import { URL_BASE } from '../utils/endpoints';
import { fetchWithAuth } from './client';

const API_URL = `${URL_BASE}/api`;

// Tipos de respuestas
export interface VentaResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Venta[];
    index_page: number;
    length_pages: number;
}




// Ventas hoy
export async function getVentasHoy(): Promise<VentaResponse> {
    const today = new Date();
    const params = new URLSearchParams();
    params.append('from_date', `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`);
    params.append('to_date', `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`);
    params.append('page', '1');
    params.append('page_size', '100');
    return fetchWithAuth(`${API_URL}/sales/totals/?${params.toString()}`);
}

// Ventas por rango de fechas (resumen)
export async function getVentasPorRangoFechasTienda(
    fromDate: Date,
    toDate: Date
): Promise<{ salesDateRangePerDay: [string, number][] }> {
    const body = {
        from_date: [fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()],
        to_date: [toDate.getFullYear(), toDate.getMonth(), toDate.getDate()],
    };
    return fetchWithAuth(`${API_URL}/sales/date-range/`, { method: 'POST', body: JSON.stringify(body) });
}

// Resumen de ventas por fecha
export async function getResumenVentasByDate(payload: {
    year?: number;
    month?: number;
    day?: number;
    tipo: 'day_month_year' | 'month_year';
}): Promise<{ todaySales: number; thisMonthSales: number; tipo: string }> {
    return fetchWithAuth(`${API_URL}/sales/by-day-month/`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

// Top productos más vendidos hoy
export async function getTopProductosMasVendidosHoy(): Promise<{ topProductoMostSales: ProductsSales[] }> {
    return fetchWithAuth(`${API_URL}/sales/top-products/`, {
        method: 'POST',
        body: JSON.stringify({}),
    });
}
export async function getTopProductosMasVendidos(): Promise<{ topProductoMostSalesByDate: ProductoVendidoResumen }> {
    return fetchWithAuth(`${API_URL}/sales/top-products-month/`, {
        method: 'POST',
        body: JSON.stringify({}),
    });
}
// Ventas por tienda con paginación
export async function getVentasPorTienda(
    from_date: [number, number, number],
    to_date: [number, number, number],
    page = 1,
    page_size = 30
): Promise<VentaResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('page_size', page_size.toString());

    const formatDate = ([y, m, d]: [number, number, number]) =>
        `${y}-${(m + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;

    params.append('from_date', formatDate(from_date));
    params.append('to_date', formatDate(to_date));

    return fetchWithAuth(`${API_URL}/sales/totals/?${params.toString()}`);
}

// Crear venta
export async function createVenta(venta: any): Promise<Venta> {
    return fetchWithAuth(`${API_URL}/sales/create/`, { method: 'POST', body: JSON.stringify(venta) });
}

// Crear venta pendiente
export async function createVentaPendiente(venta: CreateVenta): Promise<Venta> {
    return fetchWithAuth(`${API_URL}/sales/create/pendiente/`, { method: 'POST', body: JSON.stringify(venta) });
}

// Crear venta anónima
export async function createVentaAnonima(venta: CreateVenta): Promise<Venta> {
    return fetchWithAuth(`${API_URL}/sales/create/anonima/`, { method: 'POST', body: JSON.stringify(venta) });
}

// Cancelar venta
export async function cancelarVenta(ventaId: number): Promise<Venta> {
    return fetchWithAuth(`${API_URL}/ventas/cancelar/${ventaId}/`, { method: 'PATCH', body: JSON.stringify({}) });
}

// Resumen general de ventas
export async function obtenerResumenVentas(): Promise<{
    todaySales: number;
    thisWeekSales: number;
    thisMonthSales: number;
}> {
    return fetchWithAuth(`${API_URL}/sales/summary/`, { method: 'POST', body: JSON.stringify({}) });
}

// Buscar ventas
export async function fetchSearchVentas(query: any, page = 1, page_size = 30): Promise<VentaResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('page_size', page_size.toString());

    return fetchWithAuth(`${API_URL}/sales/search/?${params.toString()}`, { method: 'POST', body: JSON.stringify({ query }) });
}

// Anular venta / generar nota de crédito
export async function anularVenta(
    ventaId: number,
    motivo: string,
    tipo_motivo: string,
    anonima: boolean
): Promise<{ comprobante_nota_credito: any }> {
    return fetchWithAuth(`${API_URL}/nota-credito/registrar/`, {
        method: 'POST',
        body: JSON.stringify({ venta_id: ventaId, motivo, tipo_motivo, anonima }),
    });
}

// Generar comprobante de venta
export async function generarComprobanteVenta(ventaId: number): Promise<Venta> {
    return fetchWithAuth(`${API_URL}/ventas/generar-comprobante/`, {
        method: 'POST',
        body: JSON.stringify({ venta_id: ventaId }),
    });
}

// ── Dashboard Charts API ──

export interface SatisfaccionResponse {
    mes_a: { year: number; month: number; ventas: number };
    mes_b: { year: number; month: number; ventas: number };
    porcentaje: number;
    variacion: number;
}

export interface MetodoPagoResponse {
    year: number;
    month: number;
    total_ventas: number;
    metodos_pago: {
        metodo_pago: string;
        cantidad: number;
        porcentaje: number;
    }[];
}

export interface TopProductsMonthResponse {
    year: number;
    month: number;
    results: { nombre: string; cantidad_total_vendida: number }[];
}

export interface DailyTrendResponse {
    results: { fecha: string; total: number }[];
}

export async function getSatisfaccion(
    yearA: number, monthA: number, yearB: number, monthB: number
): Promise<SatisfaccionResponse> {
    return fetchWithAuth(`${API_URL}/sales/satisfaction/`, {
        method: 'POST',
        body: JSON.stringify({ year_a: yearA, month_a: monthA, year_b: yearB, month_b: monthB }),
    });
}

export async function getMetodosPago(year: number, month: number): Promise<MetodoPagoResponse> {
    return fetchWithAuth(`${API_URL}/sales/payment-methods/`, {
        method: 'POST',
        body: JSON.stringify({ year, month }),
    });
}

export async function getTopProductsMonth(month: string): Promise<TopProductsMonthResponse> {
    return fetchWithAuth(`${API_URL}/sales/top-products-month/`, {
        method: 'POST',
        body: JSON.stringify({ month }),
    });
}

export async function getDailyTrend(days: number = 20): Promise<DailyTrendResponse> {
    return fetchWithAuth(`${API_URL}/sales/daily-trend/`, {
        method: 'POST',
        body: JSON.stringify({ days }),
    });
}