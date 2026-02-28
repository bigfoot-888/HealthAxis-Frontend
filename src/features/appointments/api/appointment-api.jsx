import { axios } from '../../../lib/axios';

export async function createAppointment(appointmentData){
    try {
        const response = await axios.post('/appointments/new', appointmentData);
        return response.data;
    } catch (err) {
        console.error('Error creating appointment:', err);
        throw err;
    }
}

export async function updateAppointment(uuid, appointmentData){
    try {
        const response = await axios.put(`/appointments/edit/${uuid}`, appointmentData);
        return response.data;
    } catch (err) {
        console.error('Error updating appointment data:', err);
        throw err;
    }
}

export async function getAppointments(){
    try {
        const response = await axios.get('/appointments');
        return response.data;
    } catch (err) {
        console.error('Error fetching appointment data:', err);
        throw err;
    }
}

export async function getAppointment(uuid){
    try {
        const response = await axios.get(`/appointments/${uuid}`);
        return response.data;
    } catch (err) {
        console.error('Error getting appointment data:', err);
        throw err;
    }
}
export async function getAppointmentPlain(uuid){
    try {
        const response = await axios.get(`/appointments/${uuid}/plain`);
        return response.data;
    } catch (err) {
        console.error('Error getting appointment data:', err);
        throw err;
    }
}

export async function updateAppointmentState(uuid, state, notes=null){
    try {
        const response = await axios.patch(`/appointments/${uuid}/update`, {state, notes});
        return response.data;
    } catch (err) {
        console.error('Error updating appointment state:', err);
        throw err;
    }
}
