"use client";

import {
    fetchTasksList,
    createTask,
    deleteTask,
    updateTask,
    fetchTaskBySlug,
} from "@/actions/taskActions";
import { CreateTaskInput, UpdateTaskInput } from "@/lib/validations";
import { FetchTask } from "@/types/ServerResponses";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useTaskActions() {
    const queryClient = useQueryClient();
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
            queryClient.invalidateQueries({ queryKey: [`tasks`] });
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
            queryClient.invalidateQueries({ queryKey: [`tasks`] });
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
            queryClient.invalidateQueries({ queryKey: [`tasks`] });
        },
    });

    return {
        createTask: create.mutateAsync,
        deleteTask: del.mutateAsync,
        updateTask: update.mutateAsync,
        isCreating: create.isPending,
    };
}

export function useTasksList(projectSlug: string, listId: string) {
    const {
        data: res,
        isLoading,
        error,
    } = useQuery({
        queryKey: [`tasks-${listId}`, projectSlug],
        queryFn: () => fetchTasksList(projectSlug, listId),
        enabled: !!projectSlug,
    });

    return {
        tasks: res?.success ? res.data : null,
        isLoading,
        error: !res?.success ? res?.message : error,
    };
}
export function useTaskDetails(taskSlug: string, projectSlug: string) {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["taskDetails", taskSlug],
        queryFn: () => fetchTaskBySlug(taskSlug, projectSlug),
        enabled: !!taskSlug,
    });

    return {
        task: res?.success ? res.data : null,
        isLoading,
        isError,
        error: !res?.success ? res?.message : error,
    };
}
