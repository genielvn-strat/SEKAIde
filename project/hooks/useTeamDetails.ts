"use client";

import { fetchTeamBySlug } from "@/actions/teamActions";
import { useQuery } from "@tanstack/react-query";

export function useTeamDetails(teamSlug: string) {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["teamDetails", teamSlug],
        queryFn: () => fetchTeamBySlug(teamSlug),
        enabled: !!teamSlug,
    });

    return {
        teamDetails: res?.success ? res?.data : null,
        isLoading,
        isError,
        error: !res?.success ? res?.message : error,
    };
}
