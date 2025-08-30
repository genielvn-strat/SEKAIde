import { fetchTeamActivity } from "@/actions/activityActions";
import { useQuery } from "@tanstack/react-query";

export function useTeamActivity(
    teamSlug: string,
    options: { enabled?: boolean } = { enabled: true }
) {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["teamActivity"],
        queryFn: () => fetchTeamActivity(teamSlug),
        enabled: !!teamSlug && options.enabled,
    });

    return {
        teamActivty: res?.success ? res.data : null,
        isError,
        isLoading,
        error,
    };
}
