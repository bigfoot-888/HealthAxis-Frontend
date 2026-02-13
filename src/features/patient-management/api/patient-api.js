import { axios } from '../../../lib/axios';

export async function createPatient(patientData){
    try {
        const response = await axios.post('/patients/new', patientData);
        return response.data;
    } catch (err) {
        console.error('Error creating patient:', err);
        throw err;
    }
}

export async function getPatients(){
    try {
        const response = await axios.get('/patients');
        return response.data;
    } catch (err) {
        console.error('Error fetching patient data:', err);
        throw err;
    }
}

export async function getPatient(id){
    try {
        const response = await axios.get(`/patients/${id}`);
        return response.data;
    } catch (err) {
        console.error('Error getting patient data:', err);
        throw err;
    }
}

export async function updatePatient(id, patientData){
    try {
        const response = await axios.put(`/patients/edit/${id}`, patientData);
        return response.data;
    } catch (err) {
        console.error('Error updating patient data:', err);
        throw err;
    }
}

export async function deactivatePatient(id){
    try {
        const response = await axios.patch('/patients/deactivate', {id: id});
        return response.data;
    } catch (err) {
        console.error('Error deactivating patient:', err);
        throw err;
    }
}

export async function importPatients(patientData){
    try {
        const response = await axios.post('/patients/import', {patients: patientData});
        return response.data;
    } catch (err) {
        console.error('Error importing patients:', err);
        throw err;
    }
}