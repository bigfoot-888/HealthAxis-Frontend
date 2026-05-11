import { axios } from '../../../lib/axios';

// ===== CREATE =====

export async function createAgenda(agendaData) {
    const response = await axios.post('/agendas', agendaData);
    return response.data;
}

// ===== UPDATE =====

export async function updateAgenda(uuid, agendaData) {
    const response = await axios.put(`/agendas/${uuid}`, agendaData);
    return response.data;
}

export async function deactivateAgenda(uuid) {
    const response = await axios.patch(`/agendas/${uuid}/deactivate`);
    return response.data;
}

export async function reactivateAgenda(uuid) {
    const response = await axios.patch(`/agendas/${uuid}/reactivate`);
    return response.data;
}

export async function createAgendaPeriod(uuid, periodData) {
    const response = await axios.post(`/agendas/${uuid}/periods`, periodData);
    return response.data;
}

export async function updateAgendaPeriodStatus(agendaUuid, periodUuid, status) {
    const response = await axios.patch(`/agendas/${agendaUuid}/periods/${periodUuid}`, status);
    return response.data;
}

// ===== READ =====

export async function getAgendas() {
    const response = await axios.get('/agendas');
    return response.data;
}

export async function getAgenda(uuid) {
    const response = await axios.get(`/agendas/${uuid}`);
    return response.data;
}

export async function getFilteredAgendas(query, limit = 20) {
    const response = await axios.get('/agendas/filtered', {
        params: { query, limit },
    });
    return response.data;
}
