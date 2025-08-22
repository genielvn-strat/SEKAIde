"use client";

import {
    fetchUserProjects,
    createProject,
    deleteProject,
    updateProject,
    fetchTeamProjects,
    fetchProjectBySlug,
    resetProject,
} from "@/actions/projectActions";
import { UpdateProjectInput } from "@/lib/validations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useProjects() {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["projects"],
        queryFn: () => fetchUserProjects(),
    });

    return {
        projects: res?.success ? res?.data : [],
        isError: !res?.success ? res?.message : isError,
        isLoading,
        error: !res?.success ? res?.message : error,
    };
}
export function useTeamProjects(
    slug: string,
    options: { enabled?: boolean } = { enabled: true }
) {
    const {
        data: res,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["teamProjects", slug],
        queryFn: () => fetchTeamProjects(slug),
        enabled: !!slug && options.enabled,
    });

    return {
        projects: res?.success ? res.data : null,
        isLoading,
        isError: !res?.success ? true : isError,
        error: !res?.success ? res?.message : error,
    };
}
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
export function useProjectActions() {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects", "projectDetails"],
            });
        },
    });

    const del = useMutation({
        mutationFn: ({ id }: { id: string }) => deleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects", "projectDetails"],
            });
        },
    });

    const update = useMutation({
        mutationFn: ({
            projectSlug,
            data,
        }: {
            projectSlug: string;
            data: UpdateProjectInput;
        }) => updateProject(projectSlug, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });
            queryClient.invalidateQueries({
                queryKey: ["projectDetails"],
            });
        },
    });
    const reset = useMutation({
        mutationFn: ({ id }: { id: string }) => resetProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects", "projectDetails"],
            });
        },
    });
    return {
        createProject: create.mutateAsync,
        deleteProject: del.mutateAsync,
        resetProject: reset.mutateAsync,
        updateProject: update.mutateAsync,
        isCreating: create.isPending,
        isDeleting: del.isPending,
    };
}

// TODO: Task 4.1 - Implement project CRUD operations
// TODO: Task 4.2 - Create project listing and dashboard interface

/*
TODO: Implementation Notes for Interns:

Custom hook for project data management:
- Fetch projects list
- Create new project
- Update project
- Delete project
- Search/filter projects
- Pagination

Features:
- React Query/SWR for caching
- Optimistic updates
- Error handling
- Loading states
- Infinite scrolling (optional)

Example structure:
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useProjects() {
  const queryClient = useQueryClient()
  
  const {
    data: projects,
    isLoading,
    error
  } = useQuery({
    queryKey: ['projects'],
    queryFn: () => queries.projects.getAll()
  })
  
  const createProject = useMutation({
    mutationFn: queries.projects.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })
  
  return {
    projects,
    isLoading,
    error,
    createProject: createProject.mutate,
    isCreating: createProject.isPending
  }
}

Dependencies to install:
- @tanstack/react-query (recommended)
- OR swr (alternative)
*/

// Placeholder to prevent import errors
