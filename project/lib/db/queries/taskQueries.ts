import { users, tasks, projects, lists } from "@/migrations/schema";
import { and, asc, eq, sql } from "drizzle-orm";
import { ArrangeTask, CreateTask, UpdateTask } from "@/types/Task";
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

        const canUpdate =
            (await authorization
                .checkIfRoleHasPermissionByProjectSlug(
                    userId,
                    projectSlug,
                    "update_task"
                )
                .then((res) => (res ? true : false))) ?? false;
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
                    assigneeId: users.id,
                    assigneeName: users.name,
                    assigneeUsername: users.username,
                    assigneeDisplayPicture: users.displayPictureLink,
                    projectName: projects.name,
                    projectSlug: projects.slug,
                    listId: lists.id,
                    listName: lists.name,
                    listColor: lists.color,
                    finished: tasks.finished,
                    allowUpdate: sql<boolean>`
                        CASE 
                            WHEN ${tasks.assigneeId} = ${userId} THEN TRUE
                            WHEN ${canUpdate} = TRUE THEN TRUE
                            ELSE FALSE
                        END
                    `,
                    finishedAt: tasks.finishedAt,
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
    getByProjectSlug: async (projectSlug: string, userId: string) => {
        const isAuthorized = await authorization.checkIfTeamMemberByProjectSlug(
            projectSlug,
            userId
        );

        if (!isAuthorized) {
            return failure(500, "You are not authorized to view these tasks.");
        }
        try {
            const canUpdate =
                (await authorization
                    .checkIfRoleHasPermissionByProjectSlug(
                        userId,
                        projectSlug,
                        "update_task"
                    )
                    .then((res) => (res ? true : false))) ?? false;

            const result: FetchTask[] = await db
                .select({
                    id: tasks.id,
                    title: tasks.title,
                    description: tasks.description,
                    priority: tasks.priority,
                    dueDate: tasks.dueDate,
                    position: tasks.position,
                    slug: tasks.slug,
                    assigneeId: users.id,
                    assigneeName: users.name,
                    assigneeUsername: users.username,
                    assigneeDisplayPicture: users.displayPictureLink,
                    projectName: projects.name,
                    projectSlug: projects.slug,
                    listId: lists.id,
                    listName: lists.name,
                    listColor: lists.color,
                    finished: tasks.finished,
                    allowUpdate: sql<boolean>`
                        CASE 
                            WHEN ${tasks.assigneeId} = ${userId} THEN TRUE
                            WHEN ${canUpdate} = TRUE THEN TRUE
                            ELSE FALSE
                        END
                    `,
                    finishedAt: tasks.finishedAt,
                })
                .from(tasks)
                .innerJoin(projects, eq(tasks.projectId, projects.id))
                .innerJoin(users, eq(tasks.assigneeId, users.id))
                .leftJoin(lists, eq(tasks.listId, lists.id))
                .orderBy(asc(tasks.position))
                .where(eq(projects.slug, projectSlug));

            return success(200, "Project Tasks fetched successfully", result);
        } catch {
            return failure(500, "Failed to fetch task");
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
                    ...(data.finished !== undefined
                        ? {
                              finishedAt: data.finished
                                  ? new Date().toISOString()
                                  : null,
                          }
                        : {}),
                    projectId: project.id,
                    position: 0,
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

        if (!member) {
            return failure(400, "Not authorized to update this task");
        }
        const assigned = await db
            .select()
            .from(tasks)
            .where(and(eq(tasks.slug, taskSlug), eq(tasks.assigneeId, userId)))
            .then((res) => res[0] ?? null);
        const permission = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "update_task"
        );
        if (!permission && !assigned)
            return failure(400, "Not authorized to update this task");
        try {
            let list;
            if (data.listId) {
                list = await db
                    .select({ isFinal: lists.isFinal, name: lists.name })
                    .from(lists)
                    .where(eq(lists.id, data.listId))
                    .then((res) => res[0] ?? null);
            }
            console.log(data);
            const result = await db
                .update(tasks)
                .set({
                    ...data,
                    dueDate: data.dueDate
                        ? data.dueDate.toISOString()
                        : undefined,
                    updatedAt: new Date().toISOString(),
                    ...(list !== undefined ? { finished: list.isFinal } : {}),
                    ...(data.finished !== undefined
                        ? {
                              finished: data.finished,
                              finishedAt: data.finished
                                  ? new Date().toISOString()
                                  : null,
                          }
                        : {}),
                })
                .where(eq(tasks.id, task.id))
                .returning();
            // Update project's updateAt column
            await db
                .update(projects)
                .set({
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(projects.id, task.projectId));
            return success(200, "Task updated successfully", result[0]);
        } catch {
            return failure(200, "Failed to update task");
        }
    },
    arrange: async (
        arrangedTasks: ArrangeTask[],
        selectedTaskId: string,
        projectSlug: string,
        userId: string
    ) => {
        const member = await authorization.checkIfTeamMemberByProjectSlug(
            projectSlug,
            userId
        );
        if (!member) {
            return failure(400, "Not authorized to arrange this task");
        }
        const assigned = await db
            .select()
            .from(tasks)
            .where(
                and(eq(tasks.id, selectedTaskId), eq(tasks.assigneeId, userId))
            )
            .then((res) => res[0] ?? null);
        const permission = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "update_task"
        );
        console.log(assigned, permission);
        if (!permission && !assigned)
            return failure(400, "Not authorized to arrange this task");
        try {
            const updatedTasks = [];
            for (const task of arrangedTasks) {
                const [updated] = await db
                    .update(tasks)
                    .set({
                        position: task.position,
                        listId: task.listId,
                    })
                    .where(eq(tasks.id, task.id))
                    .returning();
                if (updated) updatedTasks.push(updated);
            }
            await db
                .update(projects)
                .set({
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(projects.id, member.projectId));
            return success(200, "Task arranged successfully", updatedTasks);
        } catch {
            return failure(500, "Failed to arrange task.");
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

        if (!member) {
            return failure(400, "Not authorized to delete this task");
        }
        const assigned = await db
            .select()
            .from(tasks)
            .where(and(eq(tasks.slug, taskSlug), eq(tasks.assigneeId, userId)))
            .then((res) => res[0] ?? null);
        const permission = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "delete_task"
        );
        if (!permission && !assigned)
            return failure(400, "Not authorized to delete this task");

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
