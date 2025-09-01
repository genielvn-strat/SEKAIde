import {
    teams,
    teamMembers,
    projects,
    roles,
    rolePermissions,
    permissions,
    tasks,
    activityLogs,
} from "@/migrations/schema";
import { and, countDistinct, eq, or } from "drizzle-orm";
import { CreateTeam, UpdateTeam } from "@/types/Team";
import { failure, success } from "@/types/Response";
import {
    FetchTeams,
    FetchTeamDetails,
    FetchInvitedTeams,
} from "@/types/ServerResponses";
import { authorization } from "./authorizationQueries";
import { db } from "../db";
import { alias } from "drizzle-orm/pg-core";

export const teamQueries = {
    getUserTeamsWithDetail: async (userId: string) => {
        try {
            const memberSelf = alias(teamMembers, "memberSelf");

            const result: FetchTeams[] = await db
                .select({
                    id: teams.id,
                    name: teams.name,
                    slug: teams.slug,
                    memberCount: countDistinct(teamMembers.userId).as(
                        "memberCount"
                    ),
                    projectCount: countDistinct(projects.id).as("projectCount"),
                    createdAt: teams.createdAt,
                    updatedAt: teams.updatedAt,
                })
                .from(teams)
                .innerJoin(
                    memberSelf,
                    and(
                        eq(memberSelf.teamId, teams.id),
                        eq(memberSelf.userId, userId),
                        eq(memberSelf.inviteConfirmed, true)
                    )
                )
                .innerJoin(teamMembers, eq(teamMembers.teamId, teams.id))
                .leftJoin(projects, eq(projects.teamId, teams.id))
                .groupBy(
                    teams.id,
                    teams.name,
                    teams.slug,
                    teams.createdAt,
                    teams.updatedAt
                );

            return success(200, "Joined teams successfully fetched", result);
        } catch {
            return failure(500, "Failed to fetch joined teams");
        }
    },
    getJoinedTeamsNoDetails: async (userId: string) => {
        try {
            const teams = await db
                .select({ teamId: teamMembers.teamId })
                .from(teamMembers)
                .where(
                    and(
                        eq(teamMembers.userId, userId),
                        eq(teamMembers.inviteConfirmed, true)
                    )
                );

            return success(
                200,
                "User teams fetched successfully",
                teams.map((t) => t.teamId)
            );
        } catch {
            return failure(500, "Failed to fetch joined teams");
        }
    },
    getByOwner: async (ownerId: string) => {
        try {
            const result: FetchTeams[] = await db
                .select({
                    id: teams.id,
                    name: teams.name,
                    slug: teams.slug,
                    memberCount: countDistinct(teamMembers.userId).as(
                        "memberCount"
                    ),
                    projectCount: countDistinct(projects.id).as("projectCount"),
                    createdAt: teams.createdAt,
                    updatedAt: teams.updatedAt,
                })
                .from(teams)
                .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId)) // join for counting
                .leftJoin(projects, eq(projects.teamId, teams.id))
                .where(eq(teams.ownerId, ownerId))
                .groupBy(
                    teams.id,
                    teams.name,
                    teams.slug,
                    teams.createdAt,
                    teams.updatedAt
                );

            return success(200, "Owned teams successfully fetched", result);
        } catch {
            return failure(500, "Failed to fetch owned teams");
        }
    },
    getBySlug: async (slug: string, userId: string) => {
        if (!slug || !userId) return failure(400, "Missing required fields.");

        const isAuthorized = await authorization.checkIfTeamMemberByTeamSlug(
            slug,
            userId
        );

        if (!isAuthorized) return failure(404, "Not Found");

        try {
            const result: FetchTeamDetails = await db
                .select({
                    id: teams.id,
                    name: teams.name,
                    slug: teams.slug,
                    memberCount: countDistinct(teamMembers.userId).as(
                        "memberCount"
                    ),
                    projectCount: countDistinct(projects.id).as("projectCount"),
                    taskCount: countDistinct(tasks.id).as("taskCount"), // <-- new
                    createdAt: teams.createdAt,
                    updatedAt: teams.updatedAt,
                })
                .from(teams)
                .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
                .leftJoin(projects, eq(projects.teamId, teams.id))
                .leftJoin(tasks, eq(tasks.projectId, projects.id)) // <-- join tasks
                .where(
                    and(
                        eq(teams.slug, slug),
                        or(
                            eq(teams.ownerId, userId),
                            eq(teamMembers.userId, userId)
                        )
                    )
                )
                .groupBy(
                    teams.id,
                    teams.name,
                    teams.slug,
                    teams.createdAt,
                    teams.updatedAt
                )
                .then((res) => res[0] || null);

            return success(200, "Team details successfully fetched.", result);
        } catch {
            return failure(500, "Failed to fetch team details");
        }
    },
    getTeamsWithCreateProject: async (userId: string) => {
        try {
            const result: FetchTeams[] = await db
                .select({
                    id: teams.id,
                    name: teams.name,
                    slug: teams.slug,
                    createdAt: teams.createdAt,
                    updatedAt: teams.updatedAt,
                    memberCount: countDistinct(teamMembers.userId).as(
                        "memberCount"
                    ),
                    projectCount: countDistinct(projects.id).as("projectCount"),
                })
                .from(teams)
                .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
                .innerJoin(roles, eq(teamMembers.roleId, roles.id))
                .innerJoin(
                    rolePermissions,
                    eq(roles.id, rolePermissions.roleId)
                )
                .innerJoin(
                    permissions,
                    eq(rolePermissions.permissionId, permissions.id)
                )
                .leftJoin(projects, eq(teams.id, projects.teamId))
                .where(
                    and(
                        eq(teamMembers.userId, userId),
                        eq(permissions.name, "create_project")
                    )
                )
                .groupBy(teams.id);

            return success(
                200,
                "Team with create_project permission fetched successfully.",
                result
            );
        } catch {
            return failure(500, "Failed to fetch teams");
        }
    },
    getInvitedTeams: async (userId: string) => {
        try {
            const result: FetchInvitedTeams[] = await db
                .select({
                    teamMemberId: teamMembers.id,
                    teamName: teams.name,
                    teamId: teams.id,
                    roleName: roles.name,
                })
                .from(teamMembers)
                .innerJoin(teams, eq(teamMembers.teamId, teams.id))
                .innerJoin(roles, eq(teamMembers.roleId, roles.id))
                .where(
                    and(
                        eq(teamMembers.userId, userId),
                        eq(teamMembers.inviteConfirmed, false)
                    )
                );
            return success(200, "Invited teams fetched successfully", result);
        } catch {
            return failure(500, "Failed to fetch invited teams");
        }
    },
    create: async (data: CreateTeam) => {
        const result = await db.transaction(async (tx) => {
            try {
                if (!data.name || !data.ownerId) {
                    return failure(400, "Missing required fields.");
                }

                const insertedTeam = await tx
                    .insert(teams)
                    .values(data)
                    .returning();
                const team = insertedTeam[0];

                if (!team) throw new Error("Team creation failed");

                // create a team member for this user as well
                const ownerRole = await tx
                    .select({ id: roles.id })
                    .from(roles)
                    .where(eq(roles.nameId, "owner"))
                    .then((res) => res[0] ?? null);

                await tx.insert(teamMembers).values({
                    teamId: team.id,
                    userId: data.ownerId,
                    roleId: ownerRole.id,
                    inviteConfirmed: true,
                });
                return success(201, "Team created successfully", team);
            } catch {
                return failure(500, "Team creation failed");
            }
        });

        return result;
    },
    update: async (teamId: string, data: UpdateTeam, userId: string) => {
        if (!teamId || !userId) {
            return failure(400, "Missing required fields");
        }
        const member = await authorization.checkIfTeamMemberByTeamId(
            teamId,
            userId
        );

        if (!member) {
            return failure(403, "You are not authorized to update this team");
        }

        const permitted = await authorization.checkIfRoleHasPermission(
            member.roleId,
            "update_team"
        );

        if (!permitted) {
            return failure(403, "You are not authorized to update this team");
        }

        try {
            const result = await db
                .update(teams)
                .set({ ...data, updatedAt: new Date().toISOString() })
                .where(eq(teams.id, member.teamId))
                .returning();

            // save log as well
            await db.insert(activityLogs).values({
                teamId: member.teamId,
                permissionId: permitted.id,
                userId: member.userId,
                description: `Team has been renamed from ${member.teamName} to ${result[0].name} by ${member.userFullName}.`,
            });
            return success(200, "Team updated successfully", result[0]);
        } catch {
            return failure(500, "Failed to update team");
        }
    },
    delete: async (teamId: string, userId: string) => {
        if (!teamId || !userId) {
            return failure(400, "Missing required fields");
        }
        const team = await authorization.checkIfTeamOwnedByUser(teamId, userId);

        if (!team) {
            return failure(403, "You are not authorized to delete this team");
        }

        try {
            const result = await db
                .delete(teams)
                .where(eq(teams.id, teamId))
                .returning();
            return success(200, "Team deleted successfully", result[0]);
        } catch {
            return failure(500, "Failed to delete team");
        }
    },
};
