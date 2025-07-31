"use client";

import {
    fetchTeams,
    createTeam,
    deleteTeam,
    updateTeam,
} from "@/actions/teamActions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useTeams() {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
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
        mutationFn: updateTeam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
    });

    return {
        ownedTeams: data?.owned ?? [],
        joinedTeams: data?.joined ?? [],
        isLoading,
        error,
        createTeam: create.mutate,
        deleteTeam: del.mutate,
        updateTeam: update.mutate,
        isCreating: create.isPending,
    };
}
