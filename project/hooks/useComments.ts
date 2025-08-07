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
    const queryClient = useQueryClient();
    const {
        data: comments,
        isLoading,
        error,
    } = useQuery({
        queryKey: [`comments-${taskSlug}`, projectSlug],
        queryFn: () => fetchCommentList(taskSlug, projectSlug),
        enabled: !!projectSlug && !!taskSlug && options.enabled,
    });

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
        comments,
        isLoading,
        error,
        createComment: create.mutate,
        deleteComment: del.mutate,
        updateComment: update.mutate,
    };
}
