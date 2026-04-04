import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const getTiendas = async () => {
    const { data } = await axios.get('/tiendas');
    return data.filter((t: any) => t.ruc !== '00000000000');
};

export const useTiendas = () => {
    const queryClient = useQueryClient();

    const tiendasQuery = useQuery({
        queryKey: ['tiendas'],
        queryFn: getTiendas,
    });

    const createTienda = useMutation({
        mutationFn: (data: any) => axios.post('/tiendas', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiendas'] });
        },
    });

    const updateTienda = useMutation({
        mutationFn: (data: any) => axios.put(`/tiendas/${data.id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiendas'] });
        },
    });

    const deleteTienda = useMutation({
        mutationFn: (id: number) => axios.delete(`/tiendas/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiendas'] });
        },
    });

    return {
        tiendas: tiendasQuery.data,
        loading: tiendasQuery.isLoading,

        createTienda: createTienda.mutate,
        updateTienda: updateTienda.mutate,
        deleteTienda: deleteTienda.mutate,
    };
};