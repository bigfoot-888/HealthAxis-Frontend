import { useQuery } from '@tanstack/react-query';
import { getTreatmentsByPatient } from '@treatments/api/treatment.api';

export function useTreatmentsByPatient(patientUuid) {
  return useQuery({
    queryKey: ['treatments', { patientUuid }],
    queryFn: () => getTreatmentsByPatient(patientUuid),
    enabled: !!patientUuid, 
  });
}