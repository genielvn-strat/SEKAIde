"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { CreateListInput, UpdateListInput } from "@/lib/validations";
import { CreateList, UpdateList } from "@/types/List";

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
    const listData: CreateList = {
        name: data.name,
        description: data.description,
        position: data.position,
    };
    await queries.lists.create(listData, userId, projectSlug);
};

export const updateList = async (
    projectSlug: string,
    listId: string,
    data: UpdateListInput
) => {
    const userId = await getUserDbId();
    const listData: UpdateList = {
        ...data,
    };
    await queries.lists.update(listData, listId, userId, projectSlug);
};

export const deleteList = async (listId: string, projectSlug: string) => {
    const userId = await getUserDbId();
    await queries.lists.delete(listId, projectSlug, userId);
};
