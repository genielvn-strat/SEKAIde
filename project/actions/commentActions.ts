"use server";
import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { CreateCommentInput, UpdateCommentInput } from "@/lib/validations";
import { CreateComment, UpdateComment } from "@/types/Comment";

export const fetchCommentList = async (
    taskSlug: string,
    projectSlug: string
) => {
    const userId = await getUserDbId();
    const comments = await queries.comments.getByTaskSlug(
        taskSlug,
        projectSlug,
        userId
    );
    return comments;
};

export const createComment = async (
    taskSlug: string,
    projectSlug: string,
    data: CreateCommentInput
) => {
    const userId = await getUserDbId();
    const commentData: CreateComment = {
        ...data,
    };
    const comment = await queries.comments.create(
        taskSlug,
        projectSlug,
        userId,
        data
    );
    return comment;
};

export const deleteComment = async (
    commentId: string,
    taskSlug: string,
    projectSlug: string
) => {
    const userId = await getUserDbId();
    const deletedComment = await queries.comments.delete(
        commentId,
        taskSlug,
        projectSlug,
        userId
    );
    return deletedComment;
};

export const updateComment = async (
    commentId: string,
    taskSlug: string,
    projectSlug: string,
    data: UpdateCommentInput
) => {
    const userId = await getUserDbId();
    const commentData: UpdateComment = {
        ...data,
    };
    const updatedComment = await queries.comments.update(
        commentId,
        taskSlug,
        projectSlug,
        data,
        userId,
    );
    return updatedComment;
};
