import { axios } from '../../lib/axios';

export async function validateLogin(userData){
    try {
        const response = await axios.post('/auth/login', userData);
        return response.data;
    } catch (err) {
        throw err;
    }
}

