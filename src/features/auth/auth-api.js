import { axios } from '@/lib/axios';

export async function login(userData){
    try {
        const response = await axios.post('/auth/login', userData);
        return response.data;
    } catch (err) {
        throw err;
    }
}

export async function logout() {
    const response = await axios.post('/auth/logout');
    return response.data;
}

