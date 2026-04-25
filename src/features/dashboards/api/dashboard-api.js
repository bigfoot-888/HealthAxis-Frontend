import { axios } from '@/lib/axios';

export async function getDashboard(){
    try {
        const response = await axios.get(`/dashboards`);
        return response.data;
    } catch (err) {
        console.error('Error obteniendo dashboard:', err);
        throw err;
    }
}

export async function updateLayout(layout){
    try {
        const response = await axios.patch(`/dashboards/layout`, {layout});
        return response.data;
    } catch (err) {
        console.error('Error actualizando layout del dashboard:', err);
        throw err;
    }
}

export async function createDashboardWidget(payload) {
    try {
        const response = await axios.post('/dashboards/components', payload);
        return response.data;
    } catch (err) {
        console.error('Error creando widget del dashboard:', err);
        throw err;
    }
}