import { useQuery } from '@tanstack/react-query';
import { getAppointmentsByUser } from '@appointments/api/appointment.api';

export function useAppointmentsByUser(userUuid) {
  return useQuery({
    queryKey: ['appointments', userUuid],
    queryFn: () => getAppointmentsByUser(userUuid),
    enabled: !!userUuid, 
  });
}