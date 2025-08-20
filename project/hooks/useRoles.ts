"use client";

import { authRoleByTeamSlug, fetchRoles } from "@/actions/roleActions";
import { teams } from "@/migrations/schema";
import { useQuery } from "@tanstack/react-query";

export function useRoles() {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["roles"],
        queryFn: () => fetchRoles(),
    });

    return {
        roles: res?.success ? res.data : null,
        isLoading,
        isError,
        error,
    };
}

export function useAuthRoleByTeam(
    teamSlug: string,
    action: string,
    options: { enabled?: boolean } = { enabled: true }
) {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [`authRoleTeam-${action}`],
        queryFn: () => authRoleByTeamSlug(teamSlug, action),
        enabled: !!teamSlug && options.enabled,
    });

    return {
        permitted: res,
        isLoading,
        isError,
        error,
    };
}
