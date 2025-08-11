"use client";

import { fetchTeamProjects } from "@/actions/projectActions";
import { useQuery } from "@tanstack/react-query";

export function useTeamProjects(
    slug: string,
    options: { enabled?: boolean } = { enabled: true }
) {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["teamProjects", slug],
        queryFn: () => fetchTeamProjects(slug),
        enabled: !!slug && options.enabled,
    });

    return {
        projects: res?.success ? res.data : null,
        isLoading,
        isError,
        error: !res?.success ? res?.message : error,
    };
}
