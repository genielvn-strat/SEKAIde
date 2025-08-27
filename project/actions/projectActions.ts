"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { CreateProject, UpdateProject } from "@/types/Project";
import {
    CreateProjectInput,
    createProjectSchema,
    UpdateProjectInput,
    updateProjectSchema,
} from "@/lib/validations";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { ZodError } from "zod";
import { failure } from "@/types/Response";

export const fetchUserProjects = async () => {
    const userId = await getUserDbId();
    const projects = await queries.projects.getByUserTeams(userId);
    if (!projects.success) throw new Error(projects.message);
    return projects;
};

export const fetchTeamProjects = async (teamSlug: string) => {
    const userId = await getUserDbId();
    const projects = await queries.projects.getByTeamSlug(teamSlug, userId);
    if (!projects.success) throw new Error(projects.message);
    return projects;
};

export const fetchProjectBySlug = async (slug: string) => {
    const userId = await getUserDbId();
    const project = await queries.projects.getBySlug(slug, userId);
    if (!project.success && project.status >= 500)
        throw new Error(project.message);
    return project;
};

export const createProject = async (data: CreateProjectInput) => {
    const ownerId = await getUserDbId();
    try {
        createProjectSchema.parse(data);
    } catch (err) {
        if (err instanceof ZodError) {
            return failure(400, `${err.errors[0].message}`);
        }
    }

    const project: CreateProject = {
        ...data,
        description: data.description,
        ownerId: ownerId,
        dueDate: data.dueDate,
        slug: `${slugify(data.name, {
            lower: true,
            strict: true,
        })}-${nanoid(6)}`,
    };

    return await queries.projects.create(project);
};

export const deleteProject = async (id: string) => {
    const userId = await getUserDbId();
    return await queries.projects.delete(id, userId);
};

export const resetProject = async (id: string) => {
    const userId = await getUserDbId();
    return await queries.projects.reset(id, userId);
};

export const updateProject = async (
    projectSlug: string,
    data: UpdateProjectInput
) => {
    const userId = await getUserDbId();
    try {
        updateProjectSchema.parse(data);
    } catch (err) {
        if (err instanceof ZodError) {
            return failure(400, `${err.errors[0].message}`);
        }
    }
    const project: UpdateProject = {
        ...data,
    };
    return await queries.projects.update(projectSlug, project, userId);
};
