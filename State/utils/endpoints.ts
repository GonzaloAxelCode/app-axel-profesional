

export const URL_DESA = 'http://10.137.171.135:8000';
export const URL_PROD = 'https://inventarioaxel.duckdns.org';

export const PRODUCTION = true; // Cambia a false para desarrollo

export const URL_BASE = PRODUCTION ? URL_PROD : URL_DESA;



export const URLS = {
    BASE: URL_BASE,

    // Auth
    CREATE_TOKEN: URL_BASE + '/api/auth/jwt/create/custom/',

    // Productos
    PRODUCTOS: URL_BASE + '/api/productos/',
    IMAGE_URL_BASE: URL_BASE,
    IMAGE_URL_PLACEHOLDER: 'https://sublimac.com/wp-content/uploads/2017/11/default-placeholder.png',
    CLIENTES: URL_BASE + '/api/clientes/',
    CLIENTE_BY_DOCUMENT: URL_BASE + '/api/consulta-documento/',
    // Ventas
    VENTAS_HOY: URL_BASE + '/api/ventas/hoy/',
    VENTAS_POR_TIENA: URL_BASE + '/api/ventas/tienda/',
    VENTAS_POR_RANGO: URL_BASE + '/api/sales-by-date/',
    RESUMEN_VENTAS: URL_BASE + '/api/ventas/resumen/',
    RESUMEN_VENTAS_BY_DATE: URL_BASE + '/api/ventas/resumenbymonthorday/',
    TOP_PRODUCTOS_HOY: URL_BASE + '/api/ventas/top-productos-vendidos-hoy/',
    TOP_PRODUCTOS_VENTAS_BY_DATE: URL_BASE + '/api/ventas/top-productos-vendidos/',
    CREAR_VENTA: URL_BASE + '/api/ventas/crear/',
    CREAR_VENTA_PENDIENTE: URL_BASE + '/api/ventas/crear/pendiente/',
    CREAR_VENTA_ANONIMA: URL_BASE + '/api/ventas/crear/anonima/',
    CANCELAR_VENTA: (ventaId: number) => URL_BASE + `/api/ventas/cancelar/${ventaId}/`,
    SEARCH_VENTAS: URL_BASE + '/api/ventas/search/',
    ANULAR_VENTA: URL_BASE + '/api/nota-credito/registrar',
    GENERAR_COMPROBANTE: URL_BASE + '/api/ventas/generar-comprobante/',
};

