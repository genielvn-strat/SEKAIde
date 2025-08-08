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

export const fetchProjectLists = async (projectSlug: string) => {
    const userId = await getUserDbId();
    const lists = await queries.lists.getByProjectSlug(projectSlug, userId);
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
        name: data.name,
        description: data.description,
        position: data.position,
    };
    return await queries.lists.create(listData, userId, projectSlug);
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
    return await queries.lists.update(listData, listId, userId, projectSlug);
};

export const deleteList = async (listId: string, projectSlug: string) => {
    const userId = await getUserDbId();
    return await queries.lists.delete(listId, projectSlug, userId);
};
