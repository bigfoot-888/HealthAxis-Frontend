import { axios } from '../../../lib/axios';

export async function createAgenda(agendaData){
    try {
        const response = await axios.post('/agendas/new', agendaData);
        return response.data;
    } catch (err) {
        console.error('Error creating agenda:', err);
        throw err;
    }
}

export async function updateAgenda(uuid, agendaData){
    try {
        const response = await axios.put(`/agendas/edit/${uuid}`, agendaData);
        return response.data;
    } catch (err) {
        console.error('Error updating agenda data:', err);
        throw err;
    }
}

export async function getAgendas(){
    try {
        const response = await axios.get('/agendas');
        return response.data;
    } catch (err) {
        console.error('Error fetching agenda data:', err);
        throw err;
    }
}

export async function getAgenda(uuid){
    try {
        const response = await axios.get(`/agendas/${uuid}`);
        return response.data;
    } catch (err) {
        console.error('Error getting agenda data:', err);
        throw err;
    }
}

export async function deactivateAgenda(id){
    try {
        const response = await axios.patch('/agendas/deactivate', {id: id});
        return response.data;
    } catch (err) {
        console.error('Error deactivating agenda:', err);
        throw err;
    }
}

export async function reactivateAgenda(id){
    try {
        const response = await axios.patch('/agendas/reactivate', {id: id});
        return response.data;
    } catch (err) {
        console.error('Error reactivating agenda:', err);
        throw err;
    }
}