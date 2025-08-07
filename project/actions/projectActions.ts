"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { CreateProject, Project, UpdateProject } from "@/types/Project";
import { CreateProjectInput, UpdateProjectInput } from "@/lib/validations";
import slugify from "slugify";
import { nanoid } from "nanoid";

export const fetchUserProjects = async () => {
    const userId = await getUserDbId();
    const projects = await queries.projects.getByUserTeams(userId);
    return projects;
};

export const fetchProjectBySlug = async (slug: string) => {
    const userId = await getUserDbId();
    const project = await queries.projects.getBySlug(slug, userId);
    return project;
};

export const createProject = async (data: CreateProjectInput) => {
    const ownerId = await getUserDbId();
    const project: CreateProject = {
        name: data.name,
        description: data.description,
        ownerId: ownerId,
        dueDate: data.dueDate,
        slug: `${slugify(data.name, {
            lower: true,
            strict: true,
        })}-${nanoid(6)}`,
        teamId: data.teamId,
    };

    await queries.projects.create(project);
};

export const deleteProject = async (slug: string) => {
    const userId = await getUserDbId();
    await queries.projects.delete(slug, userId);
};

export const updateProject = async (
    projectSlug: string,
    data: UpdateProjectInput
) => {
    const userId = await getUserDbId();
    const project: UpdateProject = {
        ...data,
    };
    await queries.projects.update(projectSlug, project, userId);
};
