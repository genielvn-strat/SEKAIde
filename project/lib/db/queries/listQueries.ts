import { projects, lists, activityLogs } from "@/migrations/schema";
import { asc, count, eq } from "drizzle-orm";
import { CreateList, UpdateList } from "@/types/List";
import { failure, success } from "@/types/Response";
import { authorization } from "./authorizationQueries";
import { db } from "../db";
import { FetchList } from "@/types/ServerResponses";

export const listQueries = {
    getByProjectSlug: async (projectSlug: string, userId: string) => {
        const member = await authorization.checkIfTeamMemberByProjectSlug(
            projectSlug,
            userId
        );

        if (!member) {
            return failure(404, "Not found");
        }
        try {
            const result: FetchList[] = await db
                .select({
                    id: lists.id,
                    name: lists.name,
                    description: lists.description,
                    isFinal: lists.isFinal,
                    color: lists.color,
                    position: lists.position,
                })
                .from(lists)
                .innerJoin(projects, eq(lists.projectId, projects.id))
                .where(eq(projects.slug, projectSlug))
                .orderBy(asc(lists.position));
            return success(200, "Fetched lists successfully", result);
        } catch {
            return failure(500, "Failed to fetch list");
        }
    },
    create: async (data: CreateList, userId: string, projectSlug: string) => {
        // 1. Find the project by slug
        const project = await db
            .select({ id: projects.id })
            .from(projects)
            .where(eq(projects.slug, projectSlug))
            .then((res) => res[0] ?? null);

        if (!project) {
            return failure(500, "Project not found");
        }

        // 2. Check if the user is part of the team and is a project_manager or admin
        const member = await authorization.checkIfTeamMemberByProjectSlug(
            projectSlug,
            userId
        );

        if (!member) {
            return failure(400, "Not authorized to create a list");
        }

        const permitted = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "create_list"
        );

        if (!permitted) return failure(400, "Not authorized to create a list");

        try {
            const [{ count: listCount }] = await db
                .select({ count: count() })
                .from(lists)
                .where(eq(lists.projectId, project.id));
            const result = await db
                .insert(lists)
                .values({
                    ...data,
                    projectId: project.id,
                    position: listCount,
                })
                .returning();
            await db.insert(activityLogs).values({
                teamId: member.teamId,
                permissionId: permitted.id,
                userId: member.id,
                description: `A list named ${result[0].name} has been created on ${member.projectName} by ${member.userFullName}.`,
            });
            return success(200, "List created successfully", result[0]);
        } catch {
            return failure(500, "Failed to create list");
        }
    },
    update: async (
        data: UpdateList,
        listId: string,
        userId: string,
        projectSlug: string
    ) => {
        if (!data || !listId || !userId || !projectSlug) {
            throw new Error("Missing required fields");
        }

        const list = await authorization.checkIfListBelongsToProjectBySlug(
            projectSlug,
            listId
        );

        if (!list || !list.id || !list.projectId || !list.teamId) {
            return failure(500, "List not found in this project");
        }

        const member = await authorization.checkIfTeamMemberByTeamId(
            list.teamId,
            userId
        );

        if (!member) {
            return failure(400, "Not authorized to update this list");
        }
        const permitted = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "update_list"
        );
        if (!permitted)
            return failure(400, "Not authorized to update this list");

        try {
            const result = await db
                .update(lists)
                .set({
                    ...data,
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(lists.id, list.id))
                .returning();
            // Update project's updateAt column
            await db
                .update(projects)
                .set({
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(projects.id, list.projectId));
            await db.insert(activityLogs).values({
                teamId: member.teamId,
                permissionId: permitted.id,
                userId: member.id,
                description: `${member.userFullName} has made changes to the list named ${list.name} on ${list.projectName}.`,
            });
            return success(200, "List updated successfully", result[0]);
        } catch {
            return failure(500, "Failed to update list");
        }
    },
    delete: async (listId: string, projectSlug: string, userId: string) => {
        const list = await authorization.checkIfListBelongsToProjectBySlug(
            projectSlug,
            listId
        );

        if (!list || !list.teamId || !list.id) {
            return failure(500, "List not found in this project");
        }

        const member = await authorization.checkIfTeamMemberByTeamId(
            list.teamId,
            userId
        );

        if (!member) {
            return failure(400, "Not authorized to delete this list");
        }
        const permitted = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "delete_list"
        );
        if (!permitted)
            return failure(400, "Not authorized to delete this list");

        try {
            const result = await db
                .delete(lists)
                .where(eq(lists.id, list.id))
                .returning();
            await db.insert(activityLogs).values({
                teamId: member.teamId,
                permissionId: permitted.id,
                userId: member.id,
                description: `A list named ${list.name} on ${list.projectName} has been deleted by ${member.userFullName}.`,
            });
            return success(200, "List deleted successfully", result);
        } catch {
            return failure(500, "Failed to delete list.");
        }
    },
    move: async (
        listId: string,
        projectSlug: string,
        direction: "left" | "right",
        userId: string
    ) => {
        const list = await authorization.checkIfListBelongsToProjectBySlug(
            projectSlug,
            listId
        );

        if (!list || !list.teamId) {
            return failure(404, "List not found in this project");
        }

        const member = await authorization.checkIfTeamMemberByTeamId(
            list.teamId,
            userId
        );

        if (!member) return failure(400, "Not authorized to move this list");

        const permitted = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "update_list"
        );
        if (!permitted)
            return failure(400, "Not authorized to move this list");

        try {
            const projectLists = await db
                .select({
                    id: lists.id,
                    position: lists.position,
                })
                .from(lists)
                .innerJoin(projects, eq(lists.projectId, projects.id))
                .where(eq(projects.slug, projectSlug))
                .orderBy(asc(lists.position));

            const currentIndex = projectLists.findIndex(
                (l) => l.id === list.id
            );
            if (currentIndex === -1)
                return failure(404, "List not found in this project");

            // Boundary checks
            if (
                (direction === "left" && currentIndex === 0) ||
                (direction === "right" &&
                    currentIndex === projectLists.length - 1)
            ) {
                return failure(
                    400,
                    "Cannot move list further in that direction"
                );
            }

            const swapIndex =
                direction === "left" ? currentIndex - 1 : currentIndex + 1;

            const currentList = projectLists[currentIndex];
            const swapList = projectLists[swapIndex];

            // Swap positions
            await db.transaction(async (tx) => {
                await tx
                    .update(lists)
                    .set({ position: swapList.position })
                    .where(eq(lists.id, currentList.id));

                await tx
                    .update(lists)
                    .set({ position: currentList.position })
                    .where(eq(lists.id, swapList.id));
            });
            await db.insert(activityLogs).values({
                teamId: member.teamId,
                permissionId: permitted.id,
                userId: member.id,
                description: `${member.userFullName} has made changes to the list named ${list.name} on ${list.projectName}.`,
            });
            return success(200, "List moved successfully", {
                movedListId: currentList.id,
                swappedWithId: swapList.id,
            });
        } catch (err) {
            console.error("Move list error:", err);
            return failure(500, "Failed to move list");
        }
    },
};
