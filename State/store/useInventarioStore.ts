// store/inventario.store.ts
import { create } from 'zustand';
import { Producto } from '../models/producto.models';

interface InventarioState {
    productos: Producto[];
    setProductos: (productos: Producto[]) => void;
}

export const useInventarioStore = create<InventarioState>((set) => ({
    productos: [],
    setProductos: (productos) => set({ productos }),
}));