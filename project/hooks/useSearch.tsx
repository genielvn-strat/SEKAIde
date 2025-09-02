"use client"

import { fetchItems } from "@/actions/searchActions";
import { useQuery } from "@tanstack/react-query";

export function useSearch(
    options: { enabled?: boolean } = { enabled: true }
) {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [`searchItems`],
        queryFn: () => fetchItems(),
        enabled: options.enabled,
    });

    return {
        items: res,
        isLoading,
        isError,
        error,
    };
}
