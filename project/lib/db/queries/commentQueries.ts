import {
    users,
    comments,
    projects,
    tasks,
    activityLogs,
} from "@/migrations/schema";
import { eq, sql } from "drizzle-orm";
import { failure, success } from "@/types/Response";
import { authorization } from "./authorizationQueries";
import { db } from "../db";
import { CreateComment, UpdateComment } from "@/types/Comment";
import { FetchComment } from "@/types/ServerResponses";

export const commentQueries = {
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
            return failure(400, "Not authorized to view this task.");
        }

        const canUpdate =
            (await authorization
                .checkIfRoleHasPermissionByProjectSlug(
                    userId,
                    projectSlug,
                    "update_comment"
                )
                .then((res) => (res ? true : false))) ?? false;

        const task = await authorization.checkIfTaskBelongsToProjectBySlug(
            projectSlug,
            taskSlug
        );

        if (!task) {
            return failure(500, "Task not found in this project");
        }

        try {
            const result: FetchComment[] = await db
                .select({
                    id: comments.id,
                    content: comments.content,
                    taskId: comments.taskId,
                    authorId: comments.authorId,
                    createdAt: comments.createdAt,
                    updatedAt: comments.updatedAt,
                    authorName: users.name,
                    authorUsername: users.username,
                    authorDisplayPicture: users.displayPictureLink,
                    allowUpdate: sql<boolean>`
                        CASE 
                            WHEN ${comments.authorId} = ${userId} THEN TRUE
                            WHEN ${canUpdate} = TRUE THEN TRUE
                            ELSE FALSE
                        END
                    `,
                })
                .from(comments)
                .innerJoin(users, eq(comments.authorId, users.id))
                .where(eq(comments.taskId, task.id))
                .orderBy(comments.createdAt);

            return success(200, "Comments fetch successfully`", result);
        } catch {
            return failure(500, "Failed to fetch comments");
        }
    },
    create: async (
        taskSlug: string,
        projectSlug: string,
        userId: string,
        data: CreateComment
    ) => {
        const member = await authorization.checkIfTeamMemberByProjectSlug(
            projectSlug,
            userId
        );

        if (!member) {
            return failure(
                400,
                "Not authorized to create comment in this task."
            );
        }

        const permitted = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "create_comment"
        );

        if (!permitted) {
            return failure(
                400,
                "Not authorized to create comment in this task."
            );
        }

        const task = await authorization.checkIfTaskBelongsToProjectBySlug(
            projectSlug,
            taskSlug
        );

        if (!task) {
            return failure(500, "Task not found in this project");
        }

        try {
            const result = await db
                .insert(comments)
                .values({
                    ...data,
                    taskId: task.id,
                    authorId: userId,
                })
                .returning();
            await db.insert(activityLogs).values({
                teamId: member.teamId,
                permissionId: permitted.id,
                userId: member.id,
                description: `${member.userFullName} commented on a task titled ${task.title} on ${member.projectName}.`,
            });
            return success(200, "Comment created successfully", result[0]);
        } catch {
            return failure(500, "Failed to create comment");
        }
    },
    update: async (
        commentId: string,
        taskSlug: string,
        projectSlug: string,
        data: UpdateComment,
        userId: string
    ) => {
        const member = await authorization.checkIfTeamMemberByProjectSlug(
            projectSlug,
            userId
        );

        if (!member) {
            return failure(400, "Not authorized to update this comment.");
        }

        const owned = await authorization.checkIfCommentOwnedByUser(
            commentId,
            userId
        );

        const permitted = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "update_comment"
        );

        if (!owned && !permitted) {
            return failure(400, "Not authorized to update this comment.");
        }

        const task = await authorization.checkIfTaskBelongsToProjectBySlug(
            projectSlug,
            taskSlug
        );

        if (!task) {
            return failure(500, "Task not found in this project");
        }

        try {
            const result = await db
                .update(comments)
                .set({
                    ...data,
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(comments.id, commentId))
                .returning();
            // Update project's updateAt column
            await db
                .update(projects)
                .set({
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(projects.id, task.projectId));
            // Update task's updateAt column
            await db
                .update(tasks)
                .set({
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(tasks.id, task.id));
            await db.insert(activityLogs).values({
                teamId: member.teamId,
                permissionId: permitted.id,
                userId: member.id,
                description: `${member.userFullName} updated a comment on a task titled ${task.title} on ${member.projectName}.`,
            });
            return success(200, "Comment updated successfully", result[0]);
        } catch {
            return failure(500, "Failed to update comment");
        }
    },
    delete: async (
        commentId: string,
        taskSlug: string,
        projectSlug: string,
        userId: string
    ) => {
        const member = await authorization.checkIfTeamMemberByProjectSlug(
            projectSlug,
            userId
        );
        if (!member) {
            return failure(400, "Not authorized to delete this comment.");
        }

        const owned = await authorization.checkIfCommentOwnedByUser(
            commentId,
            userId
        );

        const permitted = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "delete_comment"
        );

        if (!owned && !permitted) {
            return failure(400, "Not authorized to delete this comment.");
        }

        const task = await authorization.checkIfTaskBelongsToProjectBySlug(
            projectSlug,
            taskSlug
        );

        if (!task) {
            return failure(500, "Task not found in this project");
        }
        const comment = await db
            .select()
            .from(comments)
            .where(eq(comments.id, commentId))
            .then((res) => res[0] || null);

        if (!comment || comment.taskId !== task.id) {
            throw new Error("Comment not found in this task");
        }
        try {
            const result = await db
                .delete(comments)
                .where(eq(comments.id, commentId))
                .returning();
            await db.insert(activityLogs).values({
                teamId: member.teamId,
                permissionId: permitted.id,
                userId: member.id,
                description: `${member.userFullName} deleted a comment on a task titled ${task.title} on ${member.projectName}.`,
            });
            return success(200, "Comment successfully deleted", result);
        } catch {
            return failure(500, "Failed to delete comment");
        }
    },
};
