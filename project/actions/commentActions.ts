"use server";
import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import {
    CreateCommentInput,
    createCommentSchema,
    UpdateCommentInput,
    updateCommentSchema,
} from "@/lib/validations";
import { CreateComment, UpdateComment } from "@/types/Comment";
import { ZodError } from "zod";
import { failure } from "@/types/Response";

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
    try {
        createCommentSchema.parse(data);
    } catch (err) {
        if (err instanceof ZodError) {
            return failure(400, `${err.errors[0].message}`);
        }
    }
    const commentData: CreateComment = {
        ...data,
    };
    const comment = await queries.comments.create(
        taskSlug,
        projectSlug,
        userId,
        commentData
    );
    return comment;
};

export const deleteComment = async (
    commentId: string,
    taskSlug: string,
    projectSlug: string
) => {
    const userId = await getUserDbId();
    return await queries.comments.delete(
        commentId,
        taskSlug,
        projectSlug,
        userId
    );
};

export const updateComment = async (
    commentId: string,
    taskSlug: string,
    projectSlug: string,
    data: UpdateCommentInput
) => {
    const userId = await getUserDbId();
    try {
        updateCommentSchema.parse(data);
    } catch (err) {
        if (err instanceof ZodError) {
            return failure(400, `${err.errors[0].message}`);
        }
    }
    const commentData: UpdateComment = {
        ...data,
    };
    return await queries.comments.update(
        commentId,
        taskSlug,
        projectSlug,
        commentData,
        userId
    );
};
