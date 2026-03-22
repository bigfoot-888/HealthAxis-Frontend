import { useQuery } from '@tanstack/react-query';
import { getClinicalDocuments } from '@clinical-documents/api/clinical-document-api';

export function useClinicalDocuments() {
    return useQuery({
        queryKey: ['clinical-documents'],
        queryFn: getClinicalDocuments,
    });
}
