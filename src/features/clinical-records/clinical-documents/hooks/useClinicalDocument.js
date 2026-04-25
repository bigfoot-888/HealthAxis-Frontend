import { useQuery } from '@tanstack/react-query';
import { getClinicalDocument } from '@clinical-documents/api/clinical-document.api';

export function useClinicalDocument(uuid) {
    return useQuery({
        queryKey: ['clinical-document', uuid],
        queryFn: () => getClinicalDocument(uuid),
        enabled: !!uuid, // only run if uuid exists
    });
}
