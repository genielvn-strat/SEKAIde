import { users, comments } from "@/migrations/schema";
import { eq } from "drizzle-orm";
import { failure, success } from "@/types/Response";
import { authorization } from "./authorizationQueries";
import { db } from "../db";
import { CreateComment, UpdateComment } from "@/types/Comment";

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

        const task = await authorization.checkIfTaskBelongsToProjectBySlug(
            projectSlug,
            taskSlug
        );

        if (!task) {
            return failure(500, "Task not found in this project");
        }

        try {
            const result = await db
                .select({
                    id: comments.id,
                    content: comments.content,
                    taskId: comments.taskId,
                    authorId: comments.authorId,
                    createdAt: comments.createdAt,
                    updatedAt: comments.updatedAt,
                    authorName: users.name,
                    authorUsername: users.username,
                })
                .from(comments)
                .innerJoin(users, eq(comments.authorId, users.id))
                .where(eq(comments.taskId, task.id));

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
        const isAuthorized = await authorization.checkIfTeamMemberByProjectSlug(
            projectSlug,
            userId
        );

        if (!isAuthorized) {
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

        const owned = await authorization.checkIfCommentOwnedByUser(
            commentId,
            userId
        );

        if (
            !member ||
            !member.role ||
            (!authorization.checkIfHasRole(member.role, [
                "project_manager",
                "admin",
            ]) &&
                !owned)
        ) {
            return failure(400, "Not authorized to delete this comment.");
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

        const owned = await authorization.checkIfCommentOwnedByUser(
            commentId,
            userId
        );

        if (
            !member ||
            !member.role ||
            (!authorization.checkIfHasRole(member.role, [
                "project_manager",
                "admin",
            ]) &&
                !owned)
        ) {
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

            return success(200, "Comment successfully deleted", result);
        } catch {
            return failure(500, "Failed to delete comment");
        }
    },
};
