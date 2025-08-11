"use client";

import { fetchTeamMembersBySlug } from "@/actions/teamMemberActions";
import { useQuery } from "@tanstack/react-query";

export function useTeamMembers(
    slug: string,
    options: { enabled?: boolean } = { enabled: true }
) {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["teamMembers", slug],
        queryFn: () => fetchTeamMembersBySlug(slug),
        enabled: !!slug && options.enabled,
    });

    // invite someone function
    // remove someone function

    return {
        members: res?.success ? res.data : null,
        isLoading,
        isError,
        error: !res?.success ? res?.message : error,
    };
}
