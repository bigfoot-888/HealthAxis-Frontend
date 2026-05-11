import { useQuery } from "@tanstack/react-query";
import { getPatientHistory } from "@patients/api/patient.api";

export function usePatientHistory(uuid, page) {
  return useQuery({
    queryKey: ["history", uuid, page],
    queryFn: () => getPatientHistory(uuid, page, 20),
    enabled: !!uuid, // only run if uuid exists
  });
}
