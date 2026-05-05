import { useQuery } from '@tanstack/react-query';
import { getTreatmentsByDiagnosis } from '@treatments/api/treatment.api';

export function useTreatmentsByDiagnosis(diagnosisUuid) {
    return useQuery({
        queryKey: ['treatments', diagnosisUuid],
        queryFn: () => getTreatmentsByDiagnosis(diagnosisUuid),
        enabled: !!diagnosisUuid,
    });
}
