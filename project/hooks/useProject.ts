"use client";

import { fetchProjectBySlug } from "@/actions/projectActions";
import { useQuery } from "@tanstack/react-query";

export function useProject(slug: string) {
    const {
        data: project,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["project", slug],
        queryFn: () => fetchProjectBySlug({ slug }),
        enabled: !!slug,
    });

    return { project, isLoading, error };
}
