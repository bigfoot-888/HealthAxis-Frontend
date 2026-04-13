import { useQuery } from '@tanstack/react-query';
import { getUsers, getPatients, getAgendas, getAppointments, getDiagnoses, getRoles } from '../api/formDataApi';

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
export function useAppointments() {
    return useQuery({
        queryKey: ['appointments_filtered'],
        queryFn: getAppointments,
    });
}

export function useDiagnoses() {
    return useQuery({
        queryKey: ['diagnoses_filtered'],
        queryFn: getDiagnoses,
    });
}
a;

export function useRoles() {
    return useQuery({
        queryKey: ['roles_filtered'],
        queryFn: getRoles,
    });
}
