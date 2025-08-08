"use client";

import { fetchTeamBySlug } from "@/actions/teamActions";
import { FetchTeamDetails } from "@/types/ServerResponses";
import { useQuery } from "@tanstack/react-query";

export function useTeamDetails(slug: string) {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["teamDetails", slug],
        queryFn: () => fetchTeamBySlug(slug),
        enabled: !!slug,
    });

    return {
        data: res?.success ? (res.data as FetchTeamDetails) : null,
        isLoading,
        isError,
        error: !res?.success ? res?.message : error,
    };
}
