import { useQuery } from '@tanstack/react-query';
import { getAgenda } from '../api/agenda-api';

export function useAgendas() {
    return useQuery({
        queryKey: ['agenda', uuid],
        queryFn: () => getAgenda(uuid),
        enabled: !!uuid,
    });
}

