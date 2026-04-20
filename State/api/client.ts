// api/client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

type FetchOptions = RequestInit & {
    auth?: boolean; // permitir llamadas sin token
};

export const fetchWithAuth = async (url: string, options: FetchOptions = {}) => {
    const { auth = true, ...restOptions } = options;

    const accessToken = await AsyncStorage.getItem('access');
    const refreshToken = await AsyncStorage.getItem('refresh');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(auth && accessToken ? { Authorization: `JWT ${accessToken}` } : {}),
        ...(restOptions.headers || {}),
    };

    let res = await fetch(url, {
        ...restOptions,
        headers,
    });

    // 🔍 Leer el body correctamente (aunque falle)
    const contentType = res.headers.get('content-type') || '';
    let data: any = null;

    try {
        data = contentType.includes('application/json')
            ? await res.json()
            : await res.text();
    } catch (e) {
        data = null;
    }

    console.log('📡 RESPONSE:', {
        url,
        status: res.status,
        ok: res.ok,
        data,
    });

    // 🔐 Manejo de 401 (intento de refresh)
    if (res.status === 401 && auth && refreshToken) {
        console.log('🔄 Intentando refresh token...');

        try {
            const refreshRes = await fetch('http://10.200.250.246:8000/api/token/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            const refreshData = await refreshRes.json();

            if (!refreshRes.ok) throw new Error('Refresh falló');

            // guardar nuevo access
            await AsyncStorage.setItem('access', refreshData.access);

            // 🔁 reintentar request original
            const retryRes = await fetch(url, {
                ...restOptions,
                headers: {
                    ...headers,
                    Authorization: `JWT ${refreshData.access}`,
                },
            });

            const retryData = await retryRes.json();

            if (!retryRes.ok) {
                throw {
                    status: retryRes.status,
                    data: retryData,
                };
            }

            return retryData;
        } catch (err) {
            console.log('❌ Refresh falló, cerrar sesión');
            await AsyncStorage.multiRemove(['access', 'refresh']);
            throw new Error('Sesión expirada');
        }
    }

    // ❌ Manejo de errores (400, 403, 500, etc.)
    if (!res.ok) {
        throw {
            status: res.status,
            data,
        };
    }

    return data;
};