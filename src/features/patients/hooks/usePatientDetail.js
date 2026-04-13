import { useQuery } from "@tanstack/react-query";
import { getPatientDetail } from "@patients/api/patient.api";

export function usePatientDetail(uuid) {
  return useQuery({
    queryKey: ["patient_detail", uuid],
    queryFn: () => getPatientDetail(uuid),
    enabled: !!uuid, // only run if uuid exists
  });
}
