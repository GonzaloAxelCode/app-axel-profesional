import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clienteApi } from '../api/cliente.api';
import { ClienteCreate, ClienteUpdate } from '../models/cliente.models';

export const useClientes = () => {
    const queryClient = useQueryClient();

    // 🔹 GET ALL
    const clientesQuery = useQuery({
        queryKey: ['clientes'],
        queryFn: clienteApi.getAll,
    });

    // 🔹 GET BY DNI
    const getClienteByDocument = async (document: string) => {
        return queryClient.fetchQuery({
            queryKey: ['cliente', document],
            queryFn: () => clienteApi.getClienteByDocument(document),
        });
    };

    // 🔹 CREATE
    const createCliente = useMutation({
        mutationFn: (data: ClienteCreate) => clienteApi.create(data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
        },
    });

    // 🔹 UPDATE
    const updateCliente = useMutation({
        mutationFn: (data: ClienteUpdate) => clienteApi.update(data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
        },
    });

    // 🔹 DELETE
    const deleteCliente = useMutation({
        mutationFn: (dni: string) => clienteApi.delete(dni),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
        },
    });

    // 🔹 DEACTIVATE
    const deactivateCliente = useMutation({
        mutationFn: (dni: string) => clienteApi.deactivate(dni),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
        },
    });

    return {
        // 🔹 QUERY
        clientes: clientesQuery.data?.results || [],
        loading: clientesQuery.isLoading,
        error: clientesQuery.error,
        loadClientes: clientesQuery.refetch,
        // 🔹 ACTIONS (tipo NgRx dispatch pero directo)
        getClienteByDocument,

        createCliente: createCliente.mutate,
        updatingCliente: updateCliente.mutate,
        deleteCliente: deleteCliente.mutate,
        deactivateCliente: deactivateCliente.mutate,

        // 🔹 STATES opcionales (pro level 🔥)
        creating: createCliente.isPending,
        updating: updateCliente.isPending,
        deleting: deleteCliente.isPending,
        deactivating: deactivateCliente.isPending,
    };
};