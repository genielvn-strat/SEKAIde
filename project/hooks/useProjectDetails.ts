"use client";

import { fetchProjectBySlug } from "@/actions/projectActions";
import { FetchProject } from "@/types/ServerResponses";
import { useQuery } from "@tanstack/react-query";

export function useProjectDetails(slug: string) {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["projectDetails", slug],
        queryFn: () => fetchProjectBySlug(slug),
        enabled: !!slug,
    });

    return {
        project: res?.success ? res.data : null,
        isLoading,
        isError,
        error,
    };
}
