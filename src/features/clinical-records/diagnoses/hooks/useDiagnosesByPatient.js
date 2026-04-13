import { useQuery } from '@tanstack/react-query';
import { getDiagnosesByPatient } from '@diagnoses/api/diagnosis.api';

export function useDiagnosesByPatient(patientUuid) {
  return useQuery({
    queryKey: ['diagnoses', { patientUuid }],
    queryFn: () => getDiagnosesByPatient(patientUuid),
    enabled: !!patientUuid, 
  });
}