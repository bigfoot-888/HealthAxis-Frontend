import { axios } from '../../../../lib/axios';

export async function createTreatment(treatmentData) {
    try {
        const response = await axios.post('/treatments/new', treatmentData);
        return response.data;
    } catch (err) {
        console.error('Error creating treatment:', err);
        throw err;
    }
}

export async function updateTreatmentState(uuid, state) {
    try {
        const response = await axios.patch(`/treatments/${uuid}/update/state`, { state });
        return response.data;
    } catch (err) {
        console.error('Error updating treatment state:', err);
        throw err;
    }
}

export async function updateTreatmentRecordState(uuid, recordState) {
    try {
        const response = await axios.patch(`/treatments/${uuid}/update/record-state`, { recordState });
        return response.data;
    } catch (err) {
        console.error('Error updating treatment record state:', err);
        throw err;
    }
}

export async function getTreatments() {
    try {
        const response = await axios.get('/treatments');
        return response.data;
    } catch (err) {
        console.error('Error fetching treatment data:', err);
        throw err;
    }
}

export async function getTreatment(uuid) {
    try {
        const response = await axios.get(`/treatments/${uuid}`);
        return response.data;
    } catch (err) {
        console.error('Error getting treatment data:', err);
        throw err;
    }
}
