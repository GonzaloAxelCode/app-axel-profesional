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
export async function getVentasHoy(): Promise<{ results: Venta[] }> {
    return fetchWithAuth(`${API_URL}/ventas/hoy/`);
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
    return fetchWithAuth(`${API_URL}/sales-by-date/`, { method: 'POST', body: JSON.stringify(body) });
}

// Resumen de ventas por fecha
export async function getResumenVentasByDate(payload: {
    year?: number;
    month?: number;
    day?: number;
    tipo: 'day_month_year' | 'month_year';
}): Promise<{ todaySales: number; thisMonthSales: number; tipo: string }> {
    return fetchWithAuth(`${API_URL}/ventas/resumenbymonthorday/`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

// Top productos más vendidos hoy
export async function getTopProductosMasVendidosHoy(): Promise<{ topProductoMostSales: ProductsSales[] }> {
    return fetchWithAuth(`${API_URL}/ventas/top-productos-vendidos-hoy/`, {
        method: 'POST',
        body: JSON.stringify({}),
    });
}
export async function getTopProductosMasVendidos(): Promise<{ topProductoMostSalesByDate: ProductoVendidoResumen }> {
    return fetchWithAuth(`${API_URL}/ventas/top-productos-vendidos/`, {
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

    return fetchWithAuth(`${API_URL}/ventas/tienda/?${params.toString()}`);
}

// Crear venta
export async function createVenta(venta: any): Promise<Venta> {
    return fetchWithAuth(`${API_URL}/ventas/crear/`, { method: 'POST', body: JSON.stringify(venta) });
}

// Crear venta pendiente
export async function createVentaPendiente(venta: CreateVenta): Promise<Venta> {
    return fetchWithAuth(`${API_URL}/ventas/crear/pendiente/`, { method: 'POST', body: JSON.stringify(venta) });
}

// Crear venta anónima
export async function createVentaAnonima(venta: CreateVenta): Promise<Venta> {
    return fetchWithAuth(`${API_URL}/ventas/crear/anonima/`, { method: 'POST', body: JSON.stringify(venta) });
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
    return fetchWithAuth(`${API_URL}/ventas/resumen/`, { method: 'POST', body: JSON.stringify({}) });
}

// Buscar ventas
export async function fetchSearchVentas(query: any, page = 1, page_size = 30): Promise<VentaResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('page_size', page_size.toString());

    return fetchWithAuth(`${API_URL}/ventas/search/?${params.toString()}`, { method: 'POST', body: JSON.stringify({ query }) });
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