"use client";

import { fetchTeamBySlug } from "@/actions/teamActions";
import { useQuery } from "@tanstack/react-query";

export function useTeamDetails(slug: string) {
    const {
        data: team,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["teamDetails", slug],
        queryFn: () => fetchTeamBySlug(slug),
        enabled: !!slug,
    });

    return { data: team, isLoading, isError, error };
}
