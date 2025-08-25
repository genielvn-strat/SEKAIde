"use client";

import { fetchUserId } from "@/actions/userActions";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["teams"],
        queryFn: () => fetchUserId(),
    });

    return {
        id: res,
        isError,
        isLoading,
        error,
    };
}
