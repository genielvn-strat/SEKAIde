"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import {
    CreateListInput,
    createListSchema,
    UpdateListInput,
    updateListSchema,
} from "@/lib/validations";
import { CreateList, UpdateList } from "@/types/List";
import { ZodError } from "zod";
import { failure } from "@/types/Response";
import { pusher } from "@/lib/websocket/pusher";

export const fetchProjectLists = async (projectSlug: string) => {
    const userId = await getUserDbId();
    const lists = await queries.lists.getByProjectSlug(projectSlug, userId);
    if (!lists.success) throw new Error(lists.message);
    return lists;
};

export const createList = async (
    projectSlug: string,
    data: CreateListInput
) => {
    const userId = await getUserDbId();
    try {
        createListSchema.parse(data);
    } catch (err) {
        if (err instanceof ZodError) {
            return failure(400, `${err.errors[0].message}`);
        }
    }
    const listData: CreateList = {
        ...data,
    };
    const result = await queries.lists.create(listData, userId, projectSlug);
    if (result.success)
        await pusher.trigger(
            `project-${projectSlug}`,
            "lists-updated",
            result.data
        );
    return result;
};

export const updateList = async (
    projectSlug: string,
    listId: string,
    data: UpdateListInput
) => {
    const userId = await getUserDbId();
    try {
        updateListSchema.parse(data);
    } catch (err) {
        if (err instanceof ZodError) {
            return failure(400, `${err.errors[0].message}`);
        }
    }
    const listData: UpdateList = {
        ...data,
    };
    const result = await queries.lists.update(
        listData,
        listId,
        userId,
        projectSlug
    );
    if (result.success)
        await pusher.trigger(
            `project-${projectSlug}`,
            "lists-updated",
            result.data
        );
    return result;
};

export const deleteList = async (listId: string, projectSlug: string) => {
    const userId = await getUserDbId();
    return await queries.lists.delete(listId, projectSlug, userId);
};

export const moveList = async (
    listId: string,
    projectSlug: string,
    direction: "left" | "right"
) => {
    const userId = await getUserDbId();
    const result = await queries.lists.move(
        listId,
        projectSlug,
        direction,
        userId
    );
    if (result.success)
        await pusher.trigger(
            `project-${projectSlug}`,
            "lists-updated",
            result.data
        );
    return result;
};
