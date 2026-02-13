import { useQuery } from "@tanstack/react-query";
import { getPatients } from "../api/patient-api";

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });
}