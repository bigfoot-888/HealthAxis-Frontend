
import { useQuery } from '@tanstack/react-query';
import { getUsers, getPatients, getAgendas } from '../api/formDataApi';

export function useUsers() {
    return useQuery({
        queryKey: ['users_filtered'],
        queryFn: getUsers,
    });
}

export function usePatients() {
    return useQuery({
        queryKey: ['patients_filtered'],
        queryFn: getPatients,
    });
}

export function useAgendas() {
    return useQuery({
        queryKey: ['agendas_filtered'],
        queryFn: getAgendas,
    });
}
