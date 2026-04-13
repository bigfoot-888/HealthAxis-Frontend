import { useQuery } from "@tanstack/react-query";
import { getDiagnosis } from "@diagnoses/api/diagnosis.api";

export function useDiagnosis(uuid) {
  return useQuery({
    queryKey: ["diagnosis", uuid],
    queryFn: () => getDiagnosis(uuid),
    enabled: !!uuid, // only run if uuid exists
  });
}
