import { Inventario } from "./inventario.models";

export interface Producto {
    id: number,
    nombre: string;
    descripcion: string | null;
    categoria: number
    sku: string;
    marca?: string | null;
    modelo?: string | null;
    caracteristicas: any;
    fecha_creacion?: Date;
    fecha_actualizacion?: Date;
    activo?: boolean;
    categoria_nombre?: string
    date_created?: any
    imagen: string;
    is_inventario?: boolean
    inventario?: Inventario | null
}

export type ProductoCreate = Omit<Producto,
    'id' |
    'fecha_creacion' |
    'fecha_actualizacion' |
    'activo' |
    'categoria_nombre' |
    'imagen'  // quitamos string URL, la reemplazaremos con File
> & {
    imagen?: File | null; // nuevo campo para subir archivo
};

export interface ProductosResponse {
    results: Producto[];
    count: number;
    next: string | null;
    previous: string | null;
    index_page: number;
    length_pages: number;
}





export interface ProductoState {
    productos: Producto[];
    count: number;
    next: string | null;
    previous: string | null;
    index_page: number | null;
    length_pages: number | null;

    loading: boolean;
    error: any;

    // acciones
    loadProductos: (page?: number, page_size?: number) => Promise<void>;
}