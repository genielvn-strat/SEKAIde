"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { ArrangeTask, CreateTask, UpdateTask } from "@/types/Task";
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
import { pusher } from "@/lib/websocket/pusher";

export const fetchProjectTasks = async (projectSlug: string) => {
    const userId = await getUserDbId();
    const tasks = await queries.tasks.getByProjectSlug(projectSlug, userId);
    if (!tasks.success && tasks.status >= 500) throw new Error(tasks.message);
    return tasks;
};
export const fetchTeamTasks = async (teamSlug: string) => {
    const userId = await getUserDbId();
    const tasks = await queries.tasks.getByTeamSlug(teamSlug, userId);
    if (!tasks.success && tasks.status >= 500) throw new Error(tasks.message);
    return tasks;
};
export const fetchCalendarTask = async () => {
    const userId = await getUserDbId();
    const tasks = await queries.tasks.getCalendarTasks(userId);
    if (!tasks.success && tasks.status >= 500) throw new Error(tasks.message);
    return tasks;
};
export const fetchTaskBySlug = async (
    taskSlug: string,
    projectSlug: string
) => {
    const userId = await getUserDbId();

    const task = await queries.tasks.getByTaskSlug(
        taskSlug,
        projectSlug,
        userId
    );
    if (!task.success && task.status >= 500) throw new Error(task.message);
    return task;
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

    const result = await queries.tasks.create(projectSlug, taskData, userId);
    if (result.success)
        await pusher.trigger(
            `project-${projectSlug}`,
            "tasks-updated",
            result.data
        );

    return result;
};

export const deleteTask = async (taskSlug: string, projectSlug: string) => {
    const userId = await getUserDbId();
    const result = await queries.tasks.delete(taskSlug, projectSlug, userId);
    if (result.success)
        await pusher.trigger(
            `project-${projectSlug}`,
            "tasks-updated",
            result.data
        );
    return result;
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
    const result = await queries.tasks.update(
        taskSlug,
        taskData,
        projectSlug,
        userId
    );
    if (result.success)
        await pusher.trigger(
            `project-${projectSlug}`,
            "tasks-updated",
            result.data
        );
    return result;
};
export const arrangeTask = async (
    tasks: ArrangeTask[],
    selectedTaskId: string,
    projectSlug: string
) => {
    const userId = await getUserDbId();

    const result = await queries.tasks.arrange(
        tasks,
        selectedTaskId,
        projectSlug,
        userId
    );
    if (result.success)
        await pusher.trigger(
            `project-${projectSlug}`,
            "tasks-updated",
            result.data
        );
    return result;
};
