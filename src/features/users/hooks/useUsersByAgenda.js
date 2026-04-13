import { useQuery } from '@tanstack/react-query';
import { getUsersByAgenda } from '@users/api/user.api';

export function useUsersByAgenda(agendaUuid) {
    return useQuery({
        queryKey: ['users', { agendaUuid }],
        queryFn: () => getUsersByAgenda(agendaUuid),
        enabled: !!agendaUuid,
    });
}
