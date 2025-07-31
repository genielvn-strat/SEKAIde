"use server";

import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { Team } from "@/types";

export const fetchTeams = async () => {
    const userId = await getUserDbId();
    const [owned, joined] = await Promise.all([
        queries.teams.getByOwner(userId),
        queries.teams.getJoinedTeams(userId),
    ]);
    return { owned, joined };
};

export const createTeam = async ({ name }: Partial<Team>) => {
    const ownerId = await getUserDbId();
    return await queries.teams.create({ name, ownerId });
};

export const deleteTeam = async ({ id: teamId }: Partial<Team>) => {
    const ownerId = await getUserDbId();
    await queries.teams.delete({ id: teamId, ownerId });
};

export const updateTeam = async (data: Partial<Team>) => {
    const ownerId = await getUserDbId();
    await queries.teams.update({ ...data, ownerId: ownerId });
};
