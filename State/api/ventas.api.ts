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

// Top categorías más vendidas
export interface TopCategoriasResponse {
    month: number;
    year: number;
    total_categorias: number;
    categorias: {
        categoria_id: number;
        nombre: string;
        codigo: string;
        total_unidades: number;
        total_ingresos: number;
    }[];
}

export async function getTopCategorias(month: number, year: number): Promise<TopCategoriasResponse> {
    try {
        // La API espera month 0-indexed (January = 0) como en la web
        const response = await fetchWithAuth(`${API_URL}/reports/top-categories/`, {
            method: 'POST',
            body: JSON.stringify({ month, year }),
        });
        console.log('getTopCategorias API response:', JSON.stringify(response));
        return response;
    } catch (error) {
        console.error('Error fetching top categories:', error);
        // Retornar estructura vacía en caso de error
        return { month, year, total_categorias: 0, categorias: [] };
    }
}

// ── Daily Summary API ──

export interface DailySummaryResponse {
    fecha: string;
    total_ventas: number;
    comprobantes_emitidos: number;
    clientes_atendidos: number;
}

export interface DailyPaymentMethod {
    metodo_pago: string;
    cantidad_transacciones: number;
    total_soles: number;
    porcentaje_transacciones: number;
    porcentaje_monto: number;
}

export interface DailyPaymentMethodsResponse {
    fecha: string;
    total_transacciones: number;
    total_general_soles: number;
    metodos_pago: DailyPaymentMethod[];
}

export interface PeakHour {
    hora: number;
    label: string;
    cantidad_ventas: number;
    total_soles: number;
}

export interface DailyPeakHoursResponse {
    fecha: string;
    hora_pico_ventas: PeakHour;
    hora_pico_monto: PeakHour;
    horas: PeakHour[];
}

export interface DailyTopProduct {
    posicion: number;
    producto_id: number;
    nombre: string;
    sku: string;
    cantidad_vendida: number;
    total_neto: number;
}

export interface DailyTopProductsResponse {
    fecha: string;
    total_productos: number;
    productos: DailyTopProduct[];
}

export interface DailyTopCategoria {
    posicion: number;
    categoria_id: number;
    nombre: string;
    codigo: string;
    color: string;
    total_unidades: number;
    ingreso_neto: number;
}

export interface DailyTopCategoriesResponse {
    fecha: string;
    total_categorias: number;
    categorias: DailyTopCategoria[];
}

export interface RecentSale {
    venta_id: number;
    numero_comprobante: string;
    cliente: string;
    hora: string;
    monto: number;
    cantidad_productos: number;
    metodo_pago: string;
}

export interface DailyRecentSalesResponse {
    fecha: string;
    ventas_recientes: RecentSale[];
}

export interface DailyCustomersResponse {
    fecha: string;
    total_clientes: number;
    clientes_nuevos: number;
    clientes_recurrentes: number;
    porcentaje_nuevos: number;
    porcentaje_recurrentes: number;
    tasa_retencion: number;
}

export async function getDailySummary(): Promise<DailySummaryResponse> {
    return fetchWithAuth(`${API_URL}/reports/daily-summary/`);
}

export async function getDailyPaymentMethods(): Promise<DailyPaymentMethodsResponse> {
    return fetchWithAuth(`${API_URL}/reports/daily-payment-methods/`);
}

export async function getDailyPeakHours(): Promise<DailyPeakHoursResponse> {
    return fetchWithAuth(`${API_URL}/reports/daily-peak-hours/`);
}

export async function getDailyTopProducts(): Promise<DailyTopProductsResponse> {
    return fetchWithAuth(`${API_URL}/reports/daily-top-products/`);
}

export async function getDailyTopCategories(): Promise<DailyTopCategoriesResponse> {
    return fetchWithAuth(`${API_URL}/reports/daily-top-categories/`);
}

export async function getDailyRecentSales(): Promise<DailyRecentSalesResponse> {
    return fetchWithAuth(`${API_URL}/reports/daily-recent-sales/`);
}

export async function getDailyCustomers(): Promise<DailyCustomersResponse> {
    return fetchWithAuth(`${API_URL}/reports/daily-customers/`);
}

// ── Low Stock API ──

export interface LowStockProduct {
    item: {
        id: number;
        nombre: string;
        sku: string;
        categoria: number;
        categoria_nombre: string;
        imagen: string;
    };
    inventario: {
        id: number;
        cantidad: number;
        stock_minimo: number;
        stock_maximo: number;
        costo_compra: number;
        costo_venta: number;
        estado: string;
        producto_nombre: string;
        categoria_nombre: string;
        tienda_nombre: string;
    };
}

export interface LowStockResponse {
    lowStockProducts: LowStockProduct[];
}

export async function getLowStockProducts(): Promise<LowStockResponse> {
    return fetchWithAuth(`${API_URL}/productos-menor-stock/`);
}

// ── Pedidos API ──

export interface PedidoProducto {
    id?: number;
    producto?: number;
    producto_nombre?: string;
    cantidad: number;
    stock_disponible?: boolean;
    valor_unitario: number;
    precio_unitario: number;
    costo_original?: number;
    descuento?: number;
}

export interface Pedido {
    id: number;
    numero_pedido: string;
    fecha_hora: string;
    fecha_realizacion?: string;
    fecha_cancelacion?: string;
    metodo_pago: string;
    estado: 'COTIZADO' | 'PENDIENTE' | 'REALIZADO' | 'CANCELADO';
    activo: boolean;
    total: number;
    subtotal: number;
    igv_total: number;
    descuento_total: number;
    tipo_documento_cliente?: string;
    numero_documento_cliente?: string;
    nombre_cliente: string;
    email_cliente?: string;
    telefono_cliente?: string;
    direccion_cliente?: string;
    observaciones?: string;
    productos: PedidoProducto[];
    date_created: string;
}

export interface PedidoResponse {
    count: number;
    results: Pedido[];
}

export interface PedidoSearchResponse {
    count: number;
    next: number | null;
    previous: number | null;
    index_page: number;
    length_pages: number;
    results: Pedido[];
}

export interface CreatePedido {
    cliente?: {
        tipo_documento: string;
        numero: string;
        nombre_completo: string;
        correo_cliente?: string;
        telefono_cliente?: string;
        direccion_cliente?: string;
    };
    metodoPago: string;
    observaciones?: string;
    productos: {
        inventarioId: number;
        cantidad_final: number;
        descuento?: number;
    }[];
}

export async function getPedidos(fromDate: string, toDate: string): Promise<PedidoResponse> {
    return fetchWithAuth(`${API_URL}/pedidos/lista/`, {
        method: 'POST',
        body: JSON.stringify({ from_date: fromDate, to_date: toDate }),
    });
}

export async function searchPedidos(page: number, pageSize: number, query: any = {}): Promise<PedidoSearchResponse> {
    return fetchWithAuth(`${API_URL}/pedidos/buscar/`, {
        method: 'POST',
        body: JSON.stringify({ page, page_size: pageSize, query }),
    });
}

export async function createPedido(pedido: CreatePedido): Promise<Pedido> {
    return fetchWithAuth(`${API_URL}/pedidos/crear/`, {
        method: 'POST',
        body: JSON.stringify(pedido),
    });
}

export async function cancelPedido(pedidoId: number): Promise<Pedido> {
    return fetchWithAuth(`${API_URL}/pedidos/cancelar/${pedidoId}/`, {
        method: 'PUT',
    });
}