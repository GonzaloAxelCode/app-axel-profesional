// api/inventario.api.ts
import { Inventario } from '../models/inventario.models';
import { URL_BASE, URLS } from '../utils/endpoints';
import { fetchWithAuth } from './client';



// Trae todos los inventarios
export async function fetchInventariosPorTienda(): Promise<Inventario[]> {
    const response = await fetchWithAuth(`${URL_BASE}/api/inventarios/`);
    // La API devuelve { results: Inventario[] }
    return response.results;
}

// Buscar producto por SKU
export async function buscarProductoPorSKU(sku: string): Promise<any> {
    const response = await fetchWithAuth(URLS.BUSCAR_POR_SKU(sku));
    return response;
}