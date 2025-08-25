"use client"
import { fetchDashboard } from "@/actions/dashboardActions";
import { useQuery } from "@tanstack/react-query";

export function useDashboard() {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["dashboard"],
        queryFn: () => fetchDashboard(),
    });

    return {
        overview: res?.success ? res?.data : null,
        isLoading,
        isError: !res?.success ? true : isError,
        error: !res?.success ? res?.message : error,
    };
}
