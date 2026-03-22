import { axios } from '../../../../lib/axios';

export async function createDiagnosis(diagnosisData) {
    try {
        const response = await axios.post('/diagnoses/new', diagnosisData);
        return response.data;
    } catch (err) {
        console.error('Error creating diagnosis:', err);
        throw err;
    }
}

export async function updateDiagnosisState(uuid, state) {
    try {
        const response = await axios.patch(`/diagnoses/${uuid}/update/state`, { state });
        return response.data;
    } catch (err) {
        console.error('Error updating diagnosis state:', err);
        throw err;
    }
}

export async function updateDiagnosisRecordState(uuid, recordState) {
    try {
        const response = await axios.patch(`/diagnoses/${uuid}/update/record-state`, { recordState });
        return response.data;
    } catch (err) {
        console.error('Error updating diagnosis record state:', err);
        throw err;
    }
}

export async function getDiagnoses() {
    try {
        const response = await axios.get('/diagnoses');
        return response.data;
    } catch (err) {
        console.error('Error fetching diagnosis data:', err);
        throw err;
    }
}

export async function getDiagnosis(uuid) {
    try {
        const response = await axios.get(`/diagnoses/${uuid}`);
        return response.data;
    } catch (err) {
        console.error('Error getting diagnosis data:', err);
        throw err;
    }
}
