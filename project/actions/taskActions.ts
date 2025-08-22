"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { CreateTask, UpdateTask } from "@/types/Task";
import {
    CreateTaskInput,
    createTaskSchema,
    UpdateTaskInput,
    updateTaskSchema,
} from "@/lib/validations";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { failure } from "@/types/Response";
import { ZodError } from "zod";

export const fetchTasks = async (projectSlug: string) => {
    const userId = await getUserDbId();
    const tasks = await queries.tasks.getByProjectSlug(projectSlug, userId);
    return tasks;
};


export const fetchTaskBySlug = async (
    taskSlug: string,
    projectSlug: string
) => {
    const userId = await getUserDbId();
    return await queries.tasks.getByTaskSlug(taskSlug, projectSlug, userId);
};

export const createTask = async (
    projectSlug: string,
    data: CreateTaskInput
) => {
    const userId = await getUserDbId();
    try {
        createTaskSchema.parse(data);
    } catch (err) {
        if (err instanceof ZodError) {
            return failure(400, `${err.errors[0].message}`);
        }
    }
    const taskData: CreateTask = {
        ...data,
        slug: `${slugify(data.title, {
            lower: true,
            strict: true,
        })}-${nanoid(6)}`,
        assigneeId: data.assigneeId ?? userId, 
    };
    return await queries.tasks.create(projectSlug, taskData, userId);
};

export const deleteTask = async (taskSlug: string, projectSlug: string) => {
    const userId = await getUserDbId();
    return await queries.tasks.delete(taskSlug, projectSlug, userId);
};

export const updateTask = async (
    taskSlug: string,
    data: UpdateTaskInput,
    projectSlug: string
) => {
    const userId = await getUserDbId();
    try {
        updateTaskSchema.parse(data);
    } catch (err) {
        if (err instanceof ZodError) {
            return failure(400, `${err.errors[0].message}`);
        }
    }
    const taskData: UpdateTask = {
        ...data,
    };
    return await queries.tasks.update(taskSlug, taskData, projectSlug, userId);
};
