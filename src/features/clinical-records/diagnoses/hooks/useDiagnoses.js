import { useQuery } from '@tanstack/react-query';
import { getDiagnoses } from '@diagnoses/api/diagnosis.api';

export function useDiagnoses() {
    return useQuery({
        queryKey: ['diagnoses'],
        queryFn: getDiagnoses,
    });
}
