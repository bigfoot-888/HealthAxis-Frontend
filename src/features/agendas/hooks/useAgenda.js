import { useQuery } from '@tanstack/react-query';
import { getAgenda } from '@/features/agendas/api/agenda.api';

export function useAgenda(uuid) {
    return useQuery({
        queryKey: ['agenda', uuid],
        queryFn: () => getAgenda(uuid),
        enabled: !!uuid,
    });
}

