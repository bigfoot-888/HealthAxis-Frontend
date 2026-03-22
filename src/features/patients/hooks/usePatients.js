import { useQuery } from "@tanstack/react-query";
import { getPatients } from "@patients/api/patient-api";

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });
}