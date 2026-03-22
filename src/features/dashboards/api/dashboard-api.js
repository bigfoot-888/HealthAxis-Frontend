import { axios } from '@/lib/axios';

export async function getDashboard(uuid){
    try {
        const response = await axios.get(`/dashboards/${uuid}`);
        return response.data;
    } catch (err) {
        console.error('Error getting dashboard:', err);
        throw err;
    }
}