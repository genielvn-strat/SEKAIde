"use client";

import {
    fetchProjectLists,
    createList,
    deleteList,
    updateList,
} from "@/actions/listActions";
import { CreateListInput, UpdateListInput } from "@/lib/validations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useLists(
    projectSlug: string,
    options: { enabled?: boolean } = { enabled: true }
) {
    const queryClient = useQueryClient();

    const {
        data: lists,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["lists", projectSlug],
        queryFn: () => fetchProjectLists(projectSlug),
        enabled: !!projectSlug && options.enabled,
    });

    const create = useMutation({
        mutationFn: ({
            projectSlug,
            data,
        }: {
            projectSlug: string;
            data: CreateListInput;
        }) => createList(projectSlug, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lists"] });
        },
    });

    const del = useMutation({
        mutationFn: ({
            listId,
            projectSlug,
        }: {
            listId: string;
            projectSlug: string;
        }) => deleteList(listId, projectSlug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lists"] });
        },
    });

    const update = useMutation({
        mutationFn: ({
            projectSlug,
            listId,
            data,
        }: {
            projectSlug: string;
            listId: string;
            data: UpdateListInput;
        }) => updateList(projectSlug, listId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lists"] });
        },
    });

    return {
        lists: lists,
        isLoading,
        error,
        createList: create.mutate,
        deleteList: del.mutate,
        updateList: update.mutate,
        isCreating: create.isPending,
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
