import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '../api/client';
import { URLS } from '../utils/endpoints';

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => fetchWithAuth(URLS.CREATE_TOKEN),
    });
};