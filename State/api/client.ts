// api/client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<any> => {
    const accessToken = await AsyncStorage.getItem('access');

    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken ? `JWT ${accessToken}` : '',
            ...(options.headers || {}),
        },
    });

    if (res.status === 401) {

        throw new Error('Unauthorized');
    }

    return res.json();
};