"use client";

import {
    deleteMember,
    fetchTeamMembersBySlug,
} from "@/actions/teamMemberActions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTeamMembers(
    slug: string,
    options: { enabled?: boolean } = { enabled: true }
) {
    const queryClient = useQueryClient();

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
    const kick = useMutation({
        mutationFn: ({
            teamSlug,
            targetUserId,
        }: {
            teamSlug: string;
            targetUserId: string;
        }) => deleteMember(teamSlug, targetUserId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`teamMembers`] });
        },
    });

    return {
        members: res?.success ? res.data : null,
        kick: kick.mutateAsync,
        isLoading,
        isError,
        error: !res?.success ? res?.message : error,
    };
}
