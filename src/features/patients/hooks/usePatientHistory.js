import { useQuery } from "@tanstack/react-query";
import { getPatientHistory } from "@patients/api/patient.api";

export function usePatientHistory(uuid) {
  return useQuery({
    queryKey: ["history", uuid],
    queryFn: () => getPatientHistory(uuid),
    enabled: !!uuid, // only run if uuid exists
  });
}
