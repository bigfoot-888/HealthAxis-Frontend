import { useQuery } from "@tanstack/react-query";
import { getPatient } from "@patients/api/patient-api";

export function usePatient(uuid) {
  return useQuery({
    queryKey: ["patient", uuid],
    queryFn: () => getPatient(uuid),
    enabled: !!uuid, // only run if uuid exists
  });
}
