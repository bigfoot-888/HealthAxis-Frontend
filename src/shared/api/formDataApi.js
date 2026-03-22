import { axios } from '../../lib/axios';

export async function getPatients({ query = '', limit = 20 } = {}) {
    try {
        const response = await axios.get('/patients/filtered', {
            params: { query, limit },
        });

        return response.data;
    } catch (err) {
        console.error('Error fetching patient data:', err);
        throw err;
    }
}

export async function getAppointments({ query = '', limit = 20 } = {}) {
    try {
        const response = await axios.get('/appointments/filtered', {
            params: { query, limit },
        });

        return response.data;
    } catch (err) {
        console.error('Error fetching appointment data:', err);
        throw err;
    }
}

export async function getUsers({ query = '', limit = 20 } = {}) {
    try {
        const response = await axios.get('/users/filtered', {
            params: { query, limit },
        });

        return response.data;
    } catch (err) {
        console.error('Error fetching user data:', err);
        throw err;
    }
}

export async function getAgendas({ query = '', limit = 20 } = {}) {
    try {
        const response = await axios.get('/agendas/filtered', {
            params: { query, limit },
        });

        return response.data;
    } catch (err) {
        console.error('Error fetching agenda data:', err);
        throw err;
    }
}


export async function getDiagnoses({ query = '', limit = 20 } = {}) {
    try {
        const response = await axios.get('/diagnoses/filtered', {
            params: { query, limit },
        });

        return response.data;
    } catch (err) {
        console.error('Error fetching diagnosis data:', err);
        throw err;
    }
}