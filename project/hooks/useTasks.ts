"use client";

import {
    fetchProjectTasks,
    createTask,
    deleteTask,
    updateTask,
    fetchTaskBySlug,
    arrangeTask,
    fetchTeamTasks,
    fetchCalendarTask,
} from "@/actions/taskActions";
import { CreateTaskInput, UpdateTaskInput } from "@/lib/validations";
import { FetchTask } from "@/types/ServerResponses";
import { ArrangeTask } from "@/types/Task";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useTaskActions(projectSlug: string) {
    const queryClient = useQueryClient();
    const create = useMutation({
        mutationFn: ({
            projectSlug,
            data,
        }: {
            projectSlug: string;
            data: CreateTaskInput;
        }) => createTask(projectSlug, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`tasks`, projectSlug] });
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
            queryClient.invalidateQueries({ queryKey: [`tasks`, projectSlug] });
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
            queryClient.invalidateQueries({ queryKey: [`tasks`, projectSlug] });
        },
    });
    const arrange = useMutation({
        mutationFn: ({
            tasks,
            selectedTaskId,
            projectSlug,
        }: {
            tasks: ArrangeTask[];
            selectedTaskId: string;
            projectSlug: string;
        }) => arrangeTask(tasks, selectedTaskId, projectSlug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`tasks`, projectSlug] });
        },
    });

    return {
        createTask: create.mutateAsync,
        deleteTask: del.mutateAsync,
        updateTask: update.mutateAsync,
        arrangeTask: arrange.mutateAsync,
        isCreating: create.isPending,
        isDeleting: del.isPending,
    };
}
export function useProjectTasks(
    projectSlug: string,
    options: { enabled?: boolean } = { enabled: true }
) {
    const {
        data: res,
        isError,
        isLoading,
        error,
    } = useQuery({
        queryKey: [`tasks`, projectSlug],
        queryFn: () => fetchProjectTasks(projectSlug),
        enabled: !!projectSlug && options.enabled,
    });

    return {
        tasks: res?.success ? res.data : null,
        isError,
        isLoading,
        error,
    };
}
export function useCalendarTasks() {
    const {
        data: res,
        isError,
        isLoading,
        error,
    } = useQuery({
        queryKey: [`calendar-tasks`],
        queryFn: () => fetchCalendarTask(),
    });

    return {
        tasks: res?.success ? res.data : null,
        isError,
        isLoading,
        error,
    };
}
export function useTeamTasks(
    teamSlug: string,
    options: { enabled?: boolean } = { enabled: true }
) {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [`team-tasks`],
        queryFn: () => fetchTeamTasks(teamSlug),
        enabled: !!teamSlug && options.enabled,
    });

    return {
        tasks: res?.success ? res.data : null,
        isError,
        isLoading,
        error,
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
        error,
    };
}
