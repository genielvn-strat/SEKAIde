"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { CreateTeam, Team, UpdateTeam } from "@/types/Team";
import { CreateTeamInput, UpdateTeamInput } from "@/lib/validations";
import slugify from "slugify";
import { nanoid } from "nanoid";

export const fetchTeams = async () => {
    const userId = await getUserDbId();
    const [owned, joined] = await Promise.all([
        queries.teams.getByOwner(userId),
        queries.teams.getJoinedTeams(userId),
    ]);
    return { owned, joined };
};

export const fetchTeamBySlug = async (slug: string) => {
    const userId = await getUserDbId();
    const team = await queries.teams.getBySlug(slug, userId);
    return team;
};

export const createTeam = async (data: CreateTeamInput) => {
    const ownerId = await getUserDbId();
    const team: CreateTeam = {
        name: data.name,
        ownerId: ownerId,
        slug: `${slugify(data.name, {
            lower: true,
            strict: true,
        })}-${nanoid(6)}`,
    };
    return await queries.teams.create(team);
};

export const deleteTeam = async (teamId: string) => {
    const ownerId = await getUserDbId();
    await queries.teams.delete(teamId, ownerId);
};

export const updateTeam = async (teamId: string, data: UpdateTeamInput) => {
    const ownerId = await getUserDbId();
    const team: UpdateTeam = {
        name: data.name,
    };
    await queries.teams.update(teamId, team, ownerId);
};
