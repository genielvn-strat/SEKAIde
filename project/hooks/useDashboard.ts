"use client";
import { fetchAssignedTasks, fetchFeed } from "@/actions/dashboardActions";
import { useQuery } from "@tanstack/react-query";

export function useFeed() {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["dashboard"],
        queryFn: () => fetchFeed(),
    });

    return {
        feed: res?.success ? res?.data : null,
        isLoading,
        isError,
        error,
    };
}

export function useAssignedTasks() {
    const {
        data: res,
        isLoading,
        error,
        isError,
    } = useQuery({
        queryKey: [`tasks`],
        queryFn: () => fetchAssignedTasks(),
        refetchInterval: 30000,
    });

    return {
        tasks: res?.success ? res.data : null,
        isLoading,
        error,
        isError,
    };
}
