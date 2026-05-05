import { useQuery } from '@tanstack/react-query';
import { getAppointmentsByPatient } from '@appointments/api/appointment.api';

export function useAppointmentsByPatient(patientUuid) {
  return useQuery({
    queryKey: ['appointments', patientUuid],
    queryFn: () => getAppointmentsByPatient(patientUuid),
    enabled: !!patientUuid, 
  });
}