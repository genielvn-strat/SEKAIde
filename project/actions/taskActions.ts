"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { CreateTask, UpdateTask } from "@/types/Task";
import { CreateTaskInput, UpdateTaskInput } from "@/lib/validations";
import slugify from "slugify";
import { nanoid } from "nanoid";

export const fetchTasksList = async (projectSlug: string, listId: string) => {
    await getUserDbId();
    const project = await queries.tasks.getByListId(projectSlug, listId);
    return project;
};

export const createTask = async (
    projectSlug: string,
    listId: string,
    data: CreateTaskInput
) => {
    const userId = await getUserDbId();
    const taskData: CreateTask = {
        ...data,
        slug: `${slugify(data.title, {
            lower: true,
            strict: true,
        })}-${nanoid(6)}`,
        assigneeId: userId, // TODO: Use assignee from what the user selects in the UI. For now, you are the assignee.
        listId: listId,
    };
    await queries.tasks.create(projectSlug, taskData, userId);
};

export const deleteTask = async (taskId: string, projectSlug: string) => {
    const userId = await getUserDbId();
    await queries.tasks.delete(taskId, projectSlug, userId);
};

export const updateTask = async (
    taskId: string,
    data: UpdateTaskInput,
    projectSlug: string
) => {
    const userId = await getUserDbId();
    const taskData: UpdateTask = {
        ...data,
    };
    await queries.tasks.update(taskId, taskData, projectSlug, userId);
};
