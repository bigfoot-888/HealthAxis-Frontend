import { axios } from '@/lib/axios';

// ===== CREATE =====

export async function createPatient(patientData) {
    const response = await axios.post('/patients', patientData);
    return response.data;
}

export async function importPatients(patients) {
    const response = await axios.post('/patients/import', { patients });
    return response.data;
}

// ===== READ =====

export async function getPatients() {
    const response = await axios.get('/patients');
    return response.data;
}

export async function getPatient(uuid) {
    const response = await axios.get(`/patients/${uuid}`);
    return response.data;
}

export async function getPatientDetail(uuid) {
    const response = await axios.get(`/patients/${uuid}/detail`);
    return response.data;
}

export async function getPatientFlow(uuid) {
    const response = await axios.get(`/patients/${uuid}/flow`);
    return response.data;
}

export async function getFilteredPatients(query, limit = 20) {
    const response = await axios.get('/patients/filtered', {
        params: { query, limit },
    });
    return response.data;
}

export async function getPatientHistory(uuid, page, limit) {
    const response = await axios.get(`/patients/${uuid}/history`, {params: { page, limit}})
    return response.data; 
}

// ===== UPDATE =====

export async function updatePatient(uuid, patientData) {
    const response = await axios.put(`/patients/${uuid}`, patientData);
    return response.data;
}

// ===== STATE =====

export async function deactivatePatient(uuid) {
    const response = await axios.patch(`/patients/${uuid}/deactivate`);
    return response.data;
}

export async function reactivatePatient(uuid) {
    const response = await axios.patch(`/patients/${uuid}/reactivate`);
    return response.data;
}