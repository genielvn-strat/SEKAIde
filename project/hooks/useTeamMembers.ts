"use client";

import {
    acceptMembership,
    createMember,
    deleteMember,
    fetchTeamMembersByProjectSlug,
    fetchTeamMembersByTeamSlug,
    leaveMember,
    rejectMembership,
} from "@/actions/teamMemberActions";
import { CreateTeamMemberInput } from "@/lib/validations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
        queryFn: () => fetchTeamMembersByTeamSlug(slug),
        enabled: !!slug && options.enabled,
    });

    return {
        members: res?.success ? res.data : null,
        isLoading,
        isError: !res?.success ? true : isError,
        error: !res?.success ? res?.message : error,
    };
}
export function useTeamMembersByProject(
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
        queryFn: () => fetchTeamMembersByProjectSlug(slug),
        enabled: !!slug && options.enabled,
    });

    return {
        members: res?.success ? res.data : null,
        isLoading,
        isError: !res?.success ? true : isError,
        error: !res?.success ? res?.message : error,
    };
}
export function useTeamMemberActions() {
    const queryClient = useQueryClient();
    const invite = useMutation({
        mutationFn: ({
            teamSlug,
            data,
        }: {
            teamSlug: string;
            data: CreateTeamMemberInput;
        }) => createMember(teamSlug, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`teamMembers`] });
        },
    });
    const accept = useMutation({
        mutationFn: ({ teamMemberId }: { teamMemberId: string }) =>
            acceptMembership(teamMemberId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`teamMembers`] });
            queryClient.invalidateQueries({ queryKey: [`invited`] });
        },
    });
    const reject = useMutation({
        mutationFn: ({ teamMemberId }: { teamMemberId: string }) =>
            rejectMembership(teamMemberId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`teamMembers`] });
            queryClient.invalidateQueries({ queryKey: [`invited`] });
        },
    });
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
    const leave = useMutation({
        mutationFn: ({ teamSlug }: { teamSlug: string }) =>
            leaveMember(teamSlug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`teamMembers`] });
        },
    });

    return {
        invite: invite.mutateAsync,
        accept: accept.mutateAsync,
        reject: reject.mutateAsync,
        kick: kick.mutateAsync,
        leave: leave.mutateAsync,
        acceptLoading: accept.isPending,
        rejectLoading: reject.isPending,
    };
}
