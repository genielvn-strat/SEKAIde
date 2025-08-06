"use client";

import { fetchProjectBySlug } from "@/actions/projectActions";
import { useQuery } from "@tanstack/react-query";

export function useProjectDetails(slug: string) {
    const {
        data: project,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["projectDetails", slug],
        queryFn: () => fetchProjectBySlug(slug),
        enabled: !!slug,
    });

    return { data: project, isLoading, isError, error };
}
