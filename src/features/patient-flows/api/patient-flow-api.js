import { axios } from '@/lib/axios';

export async function getPatientFlow(uuid){
    try {
        const response = await axios.get(`/patients/${uuid}/flow`);
        return response.data;
    } catch (err) {
        console.error('Error getting patient flow:', err);
        throw err;
    }
}