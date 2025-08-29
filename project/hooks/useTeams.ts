"use client";

import {
    fetchTeams,
    createTeam,
    deleteTeam,
    updateTeam,
    fetchTeamBySlug,
    fetchTeamWithCreateProject,
    fetchInvitedTeams,
} from "@/actions/teamActions";
import { UpdateTeamInput } from "@/lib/validations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useTeams() {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["teams"],
        queryFn: () => fetchTeams(),
    });

    return {
        teams: res?.success ? res.data : null,
        isError,
        isLoading,
        error,
    };
}

export function useInvitedTeams() {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["invited"],
        queryFn: () => fetchInvitedTeams(),
        refetchInterval: 20000,
    });

    return {
        teams: res?.success ? res.data : null,
        isLoading,
        isError,
        error,
    };
}

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
        error,
    };
}

export function useTeamWithCreateProject() {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["teamProjectCreate"],
        queryFn: () => fetchTeamWithCreateProject(),
        enabled: true,
    });

    return {
        teams: res?.success ? res?.data : null,
        isLoading,
        isError,
        error,
    };
}

export function useTeamActions() {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: createTeam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
    });

    const del = useMutation({
        mutationFn: deleteTeam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
    });

    const update = useMutation({
        mutationFn: ({
            teamId,
            data,
        }: {
            teamId: string;
            data: UpdateTeamInput;
        }) => updateTeam(teamId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teamDetails"] });
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
    });
    return {
        createTeam: create.mutateAsync,
        deleteTeam: del.mutateAsync,
        updateTeam: update.mutateAsync,
        isCreating: create.isPending,
        isDeleting: del.isPending,
    };
}
