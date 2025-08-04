"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { Task } from "@/types/Task";
import { Project } from "@/types/Project";

export const fetchTasks = async ({ slug }: Partial<Project>) => {
    const project = await queries.tasks.getByProjectSlug(slug!);
    return project;
};

export const createTask = async (
    {
        title,
        description,
        projectId,
        listId,
        assigneeId,
        position,
        priority,
        dueDate,
    }: Partial<Task>,
    slug: string
) => {
    const creatorId = await getUserDbId();
    await queries.tasks.create(
        {
            title,
            description,
            listId,
            assigneeId,
            position,
            priority,
            dueDate,
        },
        slug
    );
};

// export const deleteProject = async ({ id: projectId }: Partial<Project>) => {
//     const ownerId = await getUserDbId();
//     await queries.projects.delete({ id: projectId, ownerId });
// };

// export const updateProject = async (data: Partial<Project>) => {
//     const ownerId = await getUserDbId();
//     await queries.projects.update({ ...data, ownerId: ownerId });
// };
