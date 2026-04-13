import { axios } from '../../../lib/axios';

// ===== CREATE =====

export async function createUser(userData) {
    const response = await axios.post('/users', userData);
    return response.data;
}

export async function importUsers(users) {
    const response = await axios.post('/users/import', { users });
    return response.data;
}

// ===== READ =====

export async function getUsers() {
    const response = await axios.get('/users');
    return response.data;
}

export async function getUser(uuid) {
    const response = await axios.get(`/users/${uuid}`);
    return response.data;
}

export async function getUsersByAgenda(uuid) {
    const response = await axios.get('/users', {
        params: { agendaUuid: uuid },
    });
    return response.data;
}

export async function getFilteredUsers(query, limit = 20) {
    const response = await axios.get('/users/filtered', {
        params: { query, limit },
    });
    return response.data;
}

export async function getProfile() {
    const response = await axios.get('/users/profile');
    return response.data;
}

// ===== UPDATE =====

export async function updateUser(uuid, userData) {
    const response = await axios.put(`/users/${uuid}`, userData);
    return response.data;
}

// ===== STATE =====

export async function deactivateUser(uuid) {
    const response = await axios.patch(`/users/${uuid}/deactivate`);
    return response.data;
}

export async function reactivateUser(uuid) {
    const response = await axios.patch(`/users/${uuid}/reactivate`);
    return response.data;
}

// ===== AUTH =====

export async function logout() {
    const response = await axios.post('/users/logout');
    return response.data;
}