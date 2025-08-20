import { projects, lists } from "@/migrations/schema";
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

        const permission = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "create_list"
        );
        console.log(permission);

        if (!permission) return failure(400, "Not authorized to create a list");

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
        const permission = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "update_list"
        );
        if (!permission)
            return failure(400, "Not authorized to update this list");

        try {
            const result = await db
                .update(lists)
                .set({
                    ...data,
                })
                .where(eq(lists.id, list.id))
                .returning();

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
        const permission = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "delete_list"
        );
        if (!permission)
            return failure(400, "Not authorized to delete this list");

        try {
            const result = await db
                .delete(lists)
                .where(eq(lists.id, list.id))
                .returning();
            return success(200, "List deleted successfully", result);
        } catch {
            return failure(500, "Failed to delete list.");
        }
    },
};
