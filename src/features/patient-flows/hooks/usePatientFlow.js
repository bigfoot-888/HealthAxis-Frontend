import { useQuery } from "@tanstack/react-query";
import { getPatientFlow } from "@patient-flows/api/patient-flow-api";

export function usePatientFlow(uuid) {
  return useQuery({
    queryKey: ["patient-flow", uuid],
    queryFn: () => getPatientFlow(uuid),
    enabled: !!uuid, // only run if uuid exists
  });
}
