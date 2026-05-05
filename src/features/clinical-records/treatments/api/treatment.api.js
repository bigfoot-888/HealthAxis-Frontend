import { axios } from '../../../../lib/axios';

// ===== CREATE =====

export async function createTreatment(treatmentData) {
    try {
        const response = await axios.post('/treatments', treatmentData);
        return response.data;
    } catch (err) {
        console.error('Error creating treatment:', err);
        throw err;
    }
}

// ===== UPDATE =====

export async function updateTreatment(uuid, treatmentData) {
    try {
        const response = await axios.put(`/treatments/${uuid}`, treatmentData);
        return response.data;
    } catch (err) {
        console.error('Error updating treatment data:', err);
        throw err;
    }
}

export async function updateTreatmentClinicalStatus(uuid, clinicalStatus) {
    try {
        const response = await axios.patch(`/treatments/${uuid}/clinical-status`, { clinicalStatus });
        return response.data;
    } catch (err) {
        console.error('Error updating treatment clinical status:', err);
        throw err;
    }
}

export async function updateTreatmentStatus(uuid, status) {
    try {
        const response = await axios.patch(`/treatments/${uuid}/status`, { status });
        return response.data;
    } catch (err) {
        console.error('Error updating treatment status:', err);
        throw err;
    }
}

// ===== READ =====

export async function getTreatments() {
    try {
        const response = await axios.get('/treatments');
        return response.data;
    } catch (err) {
        console.error('Error fetching treatment data:', err);
        throw err;
    }
}

export async function getTreatmentsByPatient(uuid) {
    const response = await axios.get('/treatments', {
        params: { patientUuid: uuid },
    });
    return response.data;
}

export async function getTreatmentsByAppointment(uuid) {
    const response = await axios.get('/treatments', {
        params: { appointmentUuid: uuid },
    });
    return response.data;
}

export async function getTreatmentsByDiagnosis(uuid) {
    const response = await axios.get('/treatments', {
        params: { diagnosisUuid: uuid },
    });
    return response.data;
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

export async function getTreatmentPlain(uuid) {
    try {
        const response = await axios.get(`/treatments/${uuid}/plain`);
        return response.data;
    } catch (err) {
        console.error('Error getting plain treatment data:', err);
        throw err;
    }
}