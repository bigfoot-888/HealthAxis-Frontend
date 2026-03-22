import { useQuery } from '@tanstack/react-query';
import { getAgendas } from '@agendas/api/agenda-api';

export function useAgendas() {
    return useQuery({
        queryKey: ['agendas'],
        queryFn: getAgendas,
    });
}
