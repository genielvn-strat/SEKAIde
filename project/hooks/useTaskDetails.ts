"use client";

import { fetchTaskBySlug } from "@/actions/taskActions";
import { useQuery } from "@tanstack/react-query";

export function useTaskDetails(taskSlug: string, projectSlug: string) {
    const {
        data: task,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["taskDetails", taskSlug],
        queryFn: () => fetchTaskBySlug(taskSlug, projectSlug),
        enabled: !!taskSlug,
    });

    return { task, isLoading, isError, error };
}
