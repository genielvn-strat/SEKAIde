"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { Project } from "@/types/Project";

export const fetchUserProjects = async () => {
    const userId = await getUserDbId();
    const projects = await queries.projects.getByUserTeams(userId);
    return projects;
};

export const fetchProjectBySlug = async ({ slug }: Partial<Project>) => {
    const userId = await getUserDbId();
    const project = await queries.projects.getBySlug(slug!, userId);
    return project;
};

export const createProject = async ({
    name,
    description,
    teamId,
}: Partial<Project>) => {
    const ownerId = await getUserDbId();
    await queries.projects.create({ name, description, ownerId, teamId });
};

export const deleteProject = async ({ id: projectId }: Partial<Project>) => {
    const ownerId = await getUserDbId();
    await queries.projects.delete({ id: projectId, ownerId });
};

export const updateProject = async (data: Partial<Project>) => {
    const ownerId = await getUserDbId();
    await queries.projects.update({ ...data, ownerId: ownerId });
};
