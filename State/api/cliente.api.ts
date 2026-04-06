import { fetchWithAuth } from "../api/client";
import { Cliente, ClienteCreate, ClienteUpdate } from "../models/cliente.models";
import { URLS } from "../utils/endpoints";

export const clienteApi = {
    getAll: async () => {
        return fetchWithAuth(`${URLS.CLIENTES}`);
    },

    getClienteByDocument: async (document: string): Promise<Cliente> => {
        return fetchWithAuth(`${URLS.CLIENTE_BY_DOCUMENT}`, {
            method: "POST",
            body: JSON.stringify({ numero: document, tipo: document.length === 8 ? 'dni' : 'ruc' }),
        });
    },

    create: async (cliente: ClienteCreate): Promise<Cliente> => {
        return fetchWithAuth(`${URLS.CLIENTES}/create/`, {
            method: "POST",
            body: JSON.stringify(cliente),
        });
    },

    update: async (cliente: ClienteUpdate): Promise<Cliente> => {
        return fetchWithAuth(`${URLS.CLIENTES}/${cliente.document}/`, {
            method: "PUT",
            body: JSON.stringify(cliente),
        });
    },

    deactivate: async (dni: string) => {
        return fetchWithAuth(`${URLS.CLIENTES}/deactivate/${dni}/`, {
            method: "PATCH",
        });
    },

    delete: async (dni: string) => {
        return fetchWithAuth(`${URLS.CLIENTES}/${dni}/`, {
            method: "DELETE",
        });
    },
};