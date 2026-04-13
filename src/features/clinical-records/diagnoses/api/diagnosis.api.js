import { axios } from '../../../../lib/axios';

// ===== CREATE =====

export async function createDiagnosis(diagnosisData) {
    const response = await axios.post('/diagnoses', diagnosisData);
    return response.data;
}

// ===== UPDATE =====

export async function updateDiagnosisStatus(uuid, status) {
    const response = await axios.patch(`/diagnoses/${uuid}/status`, { status });
    return response.data;
}

export async function updateDiagnosisClinicalStatus(uuid, clinicalStatus) {
    const response = await axios.patch(
        `/diagnoses/${uuid}/clinical-status`,
        { clinicalStatus }
    );
    return response.data;
}

// ===== READ =====

export async function getDiagnoses() {
    const response = await axios.get('/diagnoses');
    return response.data;
}

export async function getDiagnosesByPatient(uuid) {
    const response = await axios.get('/diagnoses', {
        params: { patientUuid: uuid },
    });
    return response.data;
}

export async function getDiagnosesByAppointment(uuid) {
    const response = await axios.get('/diagnoses', {
        params: { appointmentUuid: uuid },
    });
    return response.data;
}

export async function getDiagnosis(uuid) {
    const response = await axios.get(`/diagnoses/${uuid}`);
    return response.data;
}

export async function getFilteredDiagnoses(query, limit = 20) {
    const response = await axios.get('/diagnoses/filtered', {
        params: { query, limit },
    });
    return response.data;
}