"use client";

import {
    fetchTasksList,
    createTask,
    deleteTask,
    updateTask,
} from "@/actions/taskActions";
import { CreateTaskInput, UpdateListInput, UpdateTaskInput } from "@/lib/validations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useTasks(projectSlug: string, listId: string) {
    const queryClient = useQueryClient();

    const {
        data: tasks,
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
            taskId,
            projectSlug,
        }: {
            taskId: string;
            projectSlug: string;
        }) => deleteTask(taskId, projectSlug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`tasks-${listId}`] });
        },
    });

    const update = useMutation({
        mutationFn: ({
            taskId,
            data,
            projectSlug,
        }: {
            taskId: string;
            data: UpdateTaskInput;
            projectSlug: string;
        }) => updateTask(taskId, data, projectSlug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`tasks-${listId}`] });
        },
    });

    return {
        tasks: tasks,
        isLoading,
        error,
        createTask: create.mutate,
        deleteTask: del.mutate,
        updateTask: update.mutate,
        isCreating: create.isPending,
    };
}
