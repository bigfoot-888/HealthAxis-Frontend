import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@dashboards/api/dashboard-api";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(),
  });
}
