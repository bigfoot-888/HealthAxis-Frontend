import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@dashboards/api/dashboard-api";

export function useDashboard(uuid) {
  return useQuery({
    queryKey: ["dashboard", uuid],
    queryFn: () => getDashboard(uuid),
    enabled: !!uuid, // only run if uuid exists
  });
}
