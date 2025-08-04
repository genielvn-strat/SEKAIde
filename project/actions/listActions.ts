"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { CreateListInput, UpdateListInput } from "@/lib/validations";
import { CreateList } from "@/types/List";

export const fetchProjectLists = async (projectSlug: string) => {
    await getUserDbId();
    const lists = await queries.lists.getByProjectSlug(projectSlug);
    return lists;
};

export const createList = async (
    projectSlug: string,
    data: CreateListInput
) => {
    const userId = await getUserDbId();
    const list: CreateList = {
        name: data.name,
        description: data.description,
        position: 0,
    };
    await queries.lists.create(list, userId, projectSlug);
};
export const deleteList = async () => {
    console.log("Delete");
};
export const updateList = async (
    projectSlug: string,
    listId: string,
    data: UpdateListInput
) => {
    console.log("Update");
};
