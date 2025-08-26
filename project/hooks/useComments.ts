"use client";

import {
    createComment,
    deleteComment,
    fetchCommentList,
    updateComment,
} from "@/actions/commentActions";
import { CreateCommentInput } from "@/lib/validations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useComments(
    taskSlug: string,
    projectSlug: string,
    options: { enabled?: boolean } = { enabled: true }
) {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [`comments-${taskSlug}`],
        queryFn: () => fetchCommentList(taskSlug, projectSlug),
        enabled: !!projectSlug && !!taskSlug && options.enabled,
    });

    return {
        comments: res?.success ? res.data : null,
        isLoading,
        isError,
        error,
    };
}
export function useCommentActions(taskSlug: string) {
    const queryClient = useQueryClient();
    const create = useMutation({
        mutationFn: ({
            taskSlug,
            projectSlug,
            data,
        }: {
            taskSlug: string;
            projectSlug: string;
            data: CreateCommentInput;
        }) => createComment(taskSlug, projectSlug, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [`comments-${taskSlug}`],
            });
        },
    });

    const del = useMutation({
        mutationFn: ({
            commentId,
            taskSlug,
            projectSlug,
        }: {
            commentId: string;
            taskSlug: string;
            projectSlug: string;
        }) => deleteComment(commentId, taskSlug, projectSlug),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [`comments-${taskSlug}`],
            });
        },
    });

    const update = useMutation({
        mutationFn: ({
            commentId,
            taskSlug,
            projectSlug,
            data,
        }: {
            commentId: string;
            taskSlug: string;
            projectSlug: string;
            data: CreateCommentInput;
        }) => updateComment(commentId, taskSlug, projectSlug, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [`comments-${taskSlug}`],
            });
        },
    });
    return {
        createComment: create.mutateAsync,
        deleteComment: del.mutateAsync,
        updateComment: update.mutateAsync,
    };
}
