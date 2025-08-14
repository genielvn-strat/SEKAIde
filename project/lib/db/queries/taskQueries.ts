import { users, tasks, projects, lists } from "@/migrations/schema";
import { and, asc, eq } from "drizzle-orm";
import { CreateTask, UpdateTask } from "@/types/Task";
import { failure, success } from "@/types/Response";
import { authorization } from "./authorizationQueries";
import { db } from "../db";
import { FetchTask } from "@/types/ServerResponses";

export const taskQueries = {
    getByTaskSlug: async (
        taskSlug: string,
        projectSlug: string,
        userId: string
    ) => {
        const isAuthorized = await authorization.checkIfTeamMemberByProjectSlug(
            projectSlug,
            userId
        );

        if (!isAuthorized) {
            return failure(404, "Not found.");
        }

        try {
            const result: FetchTask = await db
                .select({
                    id: tasks.id,
                    title: tasks.title,
                    description: tasks.description,
                    priority: tasks.priority,
                    dueDate: tasks.dueDate,
                    position: tasks.position,
                    slug: tasks.slug,
                    assigneeName: users.name,
                    assigneeUsername: users.username,
                    projectName: projects.name,
                    projectSlug: projects.slug,
                    listName: lists.name,
                })
                .from(tasks)
                .innerJoin(projects, eq(tasks.projectId, projects.id))
                .innerJoin(users, eq(tasks.assigneeId, users.id))
                .innerJoin(lists, eq(tasks.listId, lists.id))
                .where(
                    and(
                        eq(tasks.slug, taskSlug),
                        eq(projects.slug, projectSlug)
                    )
                )
                .then((res) => res[0] || null);

            return success(200, "Task fetched successfully", result);
        } catch {
            return failure(500, "Failed to fetch task");
        }
    },
    getByListId: async (projectSlug: string, listId: string) => {
        if (!projectSlug || !listId) {
            return failure(400, "Missing required fields");
        }

        const list = await authorization.checkIfListBelongsToProjectBySlug(
            projectSlug,
            listId
        );

        if (!list || !list.id || !list.projectId) {
            return failure(500, "List not found in this project");
        }

        try {
            const tasksInList: FetchTask[] = await db
                .select({
                    id: tasks.id,
                    title: tasks.title,
                    description: tasks.description,
                    priority: tasks.priority,
                    dueDate: tasks.dueDate,
                    position: tasks.position,
                    slug: tasks.slug,
                    assigneeName: users.name,
                    assigneeUsername: users.username,
                    projectName: projects.name,
                    projectSlug: projects.slug,
                    listName: lists.name,
                })
                .from(tasks)
                .innerJoin(users, eq(tasks.assigneeId, users.id))
                .innerJoin(projects, eq(tasks.projectId, projects.id))
                .innerJoin(lists, eq(tasks.listId, lists.id))
                .where(
                    and(
                        eq(projects.id, list.projectId),
                        eq(tasks.listId, list.id)
                    )
                )
                .orderBy(asc(tasks.position));

            if (!tasksInList) {
                return failure(500, "No tasks found for this list");
            }

            return success(200, "Task list fetched successfully", tasksInList);
        } catch {
            return failure(500, "Failed to fetch task list");
        }
    },
    create: async (projectSlug: string, data: CreateTask, userId: string) => {
        if (!data.title || !data.listId) {
            return failure(400, "Missing required fields");
        }

        // Check if the user is part of the team and is a project_manager or admin
        const member = await authorization.checkIfTeamMemberByProjectSlug(
            projectSlug,
            userId
        );

        if (!member) {
            return failure(
                400,
                "Not authorized to create task in this project"
            );
        }

        const project = await db
            .select()
            .from(projects)
            .where(eq(projects.slug, projectSlug))
            .then((res) => res[0] ?? null);

        if (!project) {
            return failure(500, "Project not found");
        }
        try {
            const result = await db
                .insert(tasks)
                .values({
                    ...data,
                    projectId: project.id,
                    dueDate: data.dueDate?.toISOString(),
                })
                .returning();

            return success(200, "Task created successfully", result[0]);
        } catch {
            return failure(400, "Failed to create task");
        }
    },

    update: async (
        taskSlug: string,
        data: UpdateTask,
        projectSlug: string,
        userId: string
    ) => {
        // Check if task exists in the project
        const task = await authorization.checkIfTaskBelongsToProjectBySlug(
            projectSlug,
            taskSlug
        );

        if (!task || !task.id || !task.projectId || !task.teamId) {
            return failure(500, "Task not found in this project");
        }

        // Check if the user is part of the team and is a project_manager or admin
        const member = await authorization.checkIfTeamMemberByTeamId(
            task.teamId,
            userId
        );

        if (
            !member ||
            !member.role ||
            !authorization.checkIfHasRole(member.role, [
                "project_manager",
                "admin",
            ])
        ) {
            return failure(400, "Not authorized to update this task");
        }
        try {
            const result = await db
                .update(tasks)
                .set({
                    ...data,
                    dueDate: data.dueDate
                        ? data.dueDate.toISOString()
                        : undefined,
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(tasks.id, task.id))
                .returning();
            return success(200, "Task updated successfully", result[0]);
        } catch {
            return failure(200, "Failed to update task");
        }
    },
    delete: async (taskSlug: string, projectSlug: string, userId: string) => {
        const task = await authorization.checkIfTaskBelongsToProjectBySlug(
            projectSlug,
            taskSlug
        );

        if (!task || !task.id || !task.projectId || !task.teamId) {
            return failure(500, "Task not found in this project");
        }

        const member = await authorization.checkIfTeamMemberByTeamId(
            task.teamId,
            userId
        );

        if (
            !member ||
            !member.role ||
            !authorization.checkIfHasRole(member.role, [
                "project_manager",
                "admin",
            ])
        ) {
            return failure(400, "Not authorized to delete this task");
        }

        try {
            const result = await db
                .delete(tasks)
                .where(eq(tasks.id, task.id))
                .returning();
            return success(200, "Task deleted successfully", result);
        } catch {
            return failure(500, "Failed to delete task");
        }
    },
};
