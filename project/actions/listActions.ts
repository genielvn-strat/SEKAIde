"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { UpdateListInput } from "@/lib/validations";

export const fetchProjectLists = async (projectSlug: string) => {
    const userId = await getUserDbId();
    const lists = await queries.lists.getByProjectSlug(projectSlug);
    console.log(lists);
    return lists;
};

export const createList = async () => {
    console.log("Create");
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
