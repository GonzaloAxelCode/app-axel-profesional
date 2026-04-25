// stores/useClienteStore.ts
import { create } from "zustand";
import { Cliente } from "../models/cliente.models";

interface ClienteState {
    clienteSeleccionado: Cliente | null;
    search: string;
    clientesFiltrados: Cliente[];

    setCliente: (c: Cliente | null) => void;
    setSearch: (text: string) => void;
    filtrar: (clientes: Cliente[]) => void;
}

export const useClienteStore = create<ClienteState>((set, get) => ({
    clienteSeleccionado: null,
    search: "",
    clientesFiltrados: [],
    setCliente: (c) => set({ clienteSeleccionado: c }),

    setSearch: (text) => set({ search: text }),

    filtrar: (clientes) => {
        const search = get().search.toLowerCase();

        const filtrados = clientes.filter(c =>
            c.fullname?.toLowerCase().includes(search) ||
            c.document?.includes(search)
        );

        set({ clientesFiltrados: filtrados });
    },
}));