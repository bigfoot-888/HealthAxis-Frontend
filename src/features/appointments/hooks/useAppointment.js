import { useQuery } from '@tanstack/react-query';
import { getAppointment, getAppointmentPlain } from '../api/appointment-api';

export function useAppointment(uuid) {
    return useQuery({
        queryKey: ['appointment', uuid],
        queryFn: () => getAppointment(uuid),
        enabled: !!uuid, // only run if uuid exists
    });
}

export function useAppointmentPlain(uuid) {
    return useQuery({
        queryKey: ['appointment_plain', uuid],
        queryFn: () => getAppointmentPlain(uuid),
        enabled: !!uuid, // only run if uuid exists
    });
}
