import { axios } from '@/lib/axios';

export async function getPatientFlow(uuid) {
    try {
        const response = await axios.get(`/patients/${uuid}/flow`);
        console.log(response.data);
        return response.data;
    } catch (err) {
        console.error('Error getting patient flow:', err);
        throw err;
    }
}

export async function createSecondaryNode({ uuid, parentEventId, clinicalDocumentId }) {
    try {
        const response = await axios.post(`/patients/${uuid}/flow`, { parentEventId, clinicalDocumentId });
        return response.data;
    } catch (err) {
        console.error('Error getting patient flow:', err);
        throw err;
    }
}

export async function deleteFlowEvent(id, uuid) {
    try {
        const response = await axios.delete(`/patients/${uuid}/flow/${id}`);
        return response.data;
    } catch (err) {
        console.error('Error deleting flow event:', err);
        throw err;
    }
}