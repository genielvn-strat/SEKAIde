"use client";

import {
    fetchTasksList,
    createTask,
    deleteTask,
    updateTask,
} from "@/actions/taskActions";
import {
    CreateTaskInput,
    UpdateListInput,
    UpdateTaskInput,
} from "@/lib/validations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useTasks(projectSlug: string, listId: string) {
    const queryClient = useQueryClient();

    const {
        data: res,
        isLoading,
        error,
    } = useQuery({
        queryKey: [`tasks-${listId}`, projectSlug],
        queryFn: () => fetchTasksList(projectSlug, listId),
        enabled: !!projectSlug,
    });

    const create = useMutation({
        mutationFn: ({
            projectSlug,
            listId,
            data,
        }: {
            projectSlug: string;
            listId: string;
            data: CreateTaskInput;
        }) => createTask(projectSlug, listId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`tasks-${listId}`] });
        },
    });

    const del = useMutation({
        mutationFn: ({
            taskSlug,
            projectSlug,
        }: {
            taskSlug: string;
            projectSlug: string;
        }) => deleteTask(taskSlug, projectSlug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`tasks-${listId}`] });
        },
    });

    const update = useMutation({
        mutationFn: ({
            taskSlug,
            data,
            projectSlug,
        }: {
            taskSlug: string;
            data: UpdateTaskInput;
            projectSlug: string;
        }) => updateTask(taskSlug, data, projectSlug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`tasks-${listId}`] });
        },
    });

    return {
        tasks: res?.success ? res.data : null,
        isLoading,
        error: !res?.success ? res?.message : error,
        createTask: create.mutateAsync,
        deleteTask: del.mutateAsync,
        updateTask: update.mutateAsync,
        isCreating: create.isPending,
    };
}
