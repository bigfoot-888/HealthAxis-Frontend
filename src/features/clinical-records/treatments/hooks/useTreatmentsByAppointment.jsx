import { useQuery } from '@tanstack/react-query';
import { getTreatmentsByAppointment } from '@treatments/api/treatment.api';

export function useTreatmentsByAppointment(appointmentUuid) {
  return useQuery({
    queryKey: ['treatments', { appointmentUuid }],
    queryFn: () => getTreatmentsByAppointment(appointmentUuid),
    enabled: !!appointmentUuid, 
  });
}