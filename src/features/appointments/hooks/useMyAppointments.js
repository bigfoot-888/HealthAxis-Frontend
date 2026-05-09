import { useQuery } from '@tanstack/react-query';
import { getMyAppointments } from '@appointments/api/appointment.api';

export function useMyAppointments() {
  return useQuery({
    queryKey: ['appointments', "me"],
    queryFn: () => getMyAppointments(),
  });
}