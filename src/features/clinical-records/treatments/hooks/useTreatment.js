import { useQuery } from '@tanstack/react-query';
import { getTreatment } from '@treatments/api/treatment.api';

export function useTreatment(uuid) {
    return useQuery({
        queryKey: ['treatment', uuid],
        queryFn: () => getTreatment(uuid),
        enabled: !!uuid, // only run if uuid exists
    });
}
