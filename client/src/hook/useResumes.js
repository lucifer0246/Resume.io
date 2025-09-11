import { useQuery } from "@tanstack/react-query";
import { resumeAPI } from "../API/API";

export function useResumes() {
  return useQuery({
    queryKey: ["resumes"], // unique cache key
    queryFn: () => resumeAPI.getUserResumes().then((res) => res.data),
    refetchOnWindowFocus: true, // default: refetch when user comes back
    refetchOnReconnect: true, // refetch if internet reconnects
    staleTime: 1000 * 60, // 1 min before considering data "stale"
  });
}
