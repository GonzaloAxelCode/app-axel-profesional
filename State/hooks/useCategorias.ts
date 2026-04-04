import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createCategoria,
    deleteCategoria,
    getCategorias,
    updateCategoria,
} from '../api/categoria.api';

export const useCategorias = () => {
    const queryClient = useQueryClient();

    const categoriasQuery = useQuery({
        queryKey: ['categorias'],
        queryFn: getCategorias,
    });

    const createMutation = useMutation({
        mutationFn: createCategoria,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateCategoria,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategoria,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        },
    });

    return {
        categorias: categoriasQuery.data,
        loading: categoriasQuery.isLoading,

        createCategoria: createMutation.mutate,
        updateCategoria: updateMutation.mutate,
        deleteCategoria: deleteMutation.mutate,
    };
};