// api/client.ts
import { URLS } from '../utils/endpoints';

export const loginApi = async (username: string, password: string) => {
    const res = await fetch(URLS.CREATE_TOKEN, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
        console.log(res)
        throw new Error('Login failed');
    }
    return res.json(); // { access, refresh }
};

