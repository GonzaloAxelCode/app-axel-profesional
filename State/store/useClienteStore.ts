// stores/useClienteStore.ts
import { create } from "zustand";
import { Cliente } from "../models/cliente.models";

type FilterKey = 'todos' | 'dni' | 'ruc';

interface ClienteState {
    clienteSeleccionado: Cliente | null;
    search: string;
    activeFilter: FilterKey;
    clientesFiltrados: Cliente[];

    setCliente: (c: Cliente | null) => void;
    setSearch: (text: string) => void;
    setActiveFilter: (filter: FilterKey) => void;
    filtrar: (clientes: Cliente[]) => void;
}

export const useClienteStore = create<ClienteState>((set, get) => ({
    clienteSeleccionado: null,
    search: "",
    activeFilter: 'todos',
    clientesFiltrados: [],
    setCliente: (c) => set({ clienteSeleccionado: c }),

    setSearch: (text) => set({ search: text }),
    
    setActiveFilter: (filter) => set({ activeFilter: filter }),

    filtrar: (clientes) => {
        const { search, activeFilter } = get();
        const searchLower = search.toLowerCase();

        let filtrados = clientes.filter(c =>
            c.fullname?.toLowerCase().includes(searchLower) ||
            c.document?.includes(search)
        );

        // Aplicar filtro de DNI/RUC
        if (activeFilter === 'dni') {
            filtrados = filtrados.filter(c => c.document?.length !== 11);
        } else if (activeFilter === 'ruc') {
            filtrados = filtrados.filter(c => c.document?.length === 11);
        }

        set({ clientesFiltrados: filtrados });
    },
}));