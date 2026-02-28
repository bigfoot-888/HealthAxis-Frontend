import { axios } from '../../../lib/axios';

export async function createAgendaPeriod(uuid, periodData){
    try {
        const response = await axios.post(`/agendas/${uuid}/periods/new`, periodData);
        return response.data;
    } catch (err) {
        console.error('Error creating period:', err);
        throw err;
    }
}