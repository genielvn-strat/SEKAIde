"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { CreateTeam, UpdateTeam } from "@/types/Team";
import {
    CreateTeamInput,
    createTeamSchema,
    UpdateTeamInput,
    updateTeamSchema,
} from "@/lib/validations";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { ZodError } from "zod";
import { failure, success } from "@/types/Response";

export const fetchTeams = async () => {
    const userId = await getUserDbId();
    const result = await queries.teams.getJoinedTeams(userId);

    return result
};

export const fetchTeamBySlug = async (slug: string) => {
    const userId = await getUserDbId();
    return await queries.teams.getBySlug(slug, userId);
};

export const fetchTeamWithCreateProject = async () => {
    const userId = await getUserDbId();
    return await queries.teams.getTeamsWithCreateProject(userId);
};

export const createTeam = async (data: CreateTeamInput) => {
    const userId = await getUserDbId();
    try {
        createTeamSchema.parse(data);
    } catch (err) {
        if (err instanceof ZodError) {
            return failure(400, `${err.errors[0].message}`);
        }
    }
    const team: CreateTeam = {
        name: data.name,
        ownerId: userId,
        slug: `${slugify(data.name, {
            lower: true,
            strict: true,
        })}-${nanoid(6)}`,
    };
    return await queries.teams.create(team);
};

export const deleteTeam = async (teamId: string) => {
    const userId = await getUserDbId();
    return await queries.teams.delete(teamId, userId);
};

export const updateTeam = async (teamId: string, data: UpdateTeamInput) => {
    const userId = await getUserDbId();
    try {
        updateTeamSchema.parse(data);
    } catch (err) {
        if (err instanceof ZodError) {
            return failure(400, `${err.errors[0].message}`);
        }
    }
    const team: UpdateTeam = {
        name: data.name,
    };
    return await queries.teams.update(teamId, team, userId);
};
