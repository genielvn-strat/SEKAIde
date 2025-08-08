"use client";

import {
    fetchTeams,
    createTeam,
    deleteTeam,
    updateTeam,
} from "@/actions/teamActions";
import { UpdateTeamInput } from "@/lib/validations";
import { FetchTeams } from "@/types/ServerResponses";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useTeams() {
    const queryClient = useQueryClient();

    const {
        data: res,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["teams"],
        queryFn: () => fetchTeams(),
    });

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
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
    });

    return {
        ownedTeams:
            res?.success && "owned" in (res?.data ?? {})
                ? (res.data as FetchTeams).owned
                : [],
        joinedTeams:
            res?.success && "joined" in (res?.data ?? {})
                ? (res.data as FetchTeams).joined
                : [],
        isLoading,
        error: !res?.success ? res?.message : error,
        createTeam: create.mutateAsync,
        deleteTeam: del.mutateAsync,
        updateTeam: update.mutateAsync,
        isCreating: create.isPending,
    };
}
