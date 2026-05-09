import { axios } from '../../../lib/axios';

// ===== CREATE =====

export async function createAppointment(appointmentData) {
    const response = await axios.post('/appointments', appointmentData);
    return response.data;
}

export async function completeAppointmentWithClinicalData(uuid, clinicalData) {
    const response = await axios.post(`/appointments/${uuid}/complete`, clinicalData);
    return response.data;
}

// ===== UPDATE =====

export async function updateAppointment(uuid, appointmentData) {
    const response = await axios.put(`/appointments/${uuid}`, appointmentData);
    return response.data;
}

export async function updateAppointmentStatus(uuid, status, notes = null) {
    const payload = { status };
    if (notes !== null) payload.notes = notes;

    const response = await axios.patch(`/appointments/${uuid}/status`, payload);

    return response.data;
}

// ===== READ =====

export async function getAppointments() {
    const response = await axios.get('/appointments');
    return response.data;
}

export async function getAppointmentsByPatient(uuid) {
    const response = await axios.get('/appointments', {
        params: { patientUuid: uuid },
    });
    return response.data;
}

export async function getAppointmentsByUser(uuid) {
    const response = await axios.get('/appointments', {
        params: { userUuid: uuid },
    });
    return response.data;
}

export async function getMyAppointments(){
    const response = await axios.get('/appointments/me');
    return response.data;
}

export async function getAppointment(uuid) {
    const response = await axios.get(`/appointments/${uuid}`);
    return response.data;
}

export async function getAppointmentPlain(uuid) {
    const response = await axios.get(`/appointments/${uuid}/plain`);
    return response.data;
}

export async function getFilteredAppointments(query, limit = 20) {
    const response = await axios.get('/appointments/filtered', {
        params: { query, limit },
    });
    return response.data;
}
