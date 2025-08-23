import {
    comments,
    projects,
    tasks,
    teamMembers,
    teams,
    users,
} from "@/migrations/schema";
import { db } from "../db";
import { and, desc, eq, inArray } from "drizzle-orm";
import { failure, success } from "@/types/Response";

export const dashboardQueries = {
    getRecentProjects: async (teamIds: string[]) => {
        try {
            const results = await db
                // "[teamName] has created a new project, [projectName]"
                // (then show the project card): projectName and projectDescription
                .selectDistinct({
                    name: projects.name,
                    description: projects.description,
                    teamName: teams.name,
                    slug: projects.slug,
                    createdAt: projects.createdAt,
                })
                .from(projects)
                .innerJoin(teamMembers, eq(teamMembers.teamId, projects.teamId))
                .innerJoin(teams, eq(projects.teamId, teams.id))
                .where(inArray(teamMembers.teamId, teamIds))
                .orderBy(desc(projects.createdAt))
                .limit(10);
            return success(
                200,
                "Dashboard Projects fetched successfully",
                results
            );
        } catch {
            return failure(500, "Failed to fetch Dashboard Projects");
        }
    },
    getRecentTasks: async (teamIds: string[]) => {
        try {
            const results = await db
                // "[assigneeName] has been assigned to a task, [taskName]"
                // if no assigned, "[projectName] has a new task, [taskName]"
                // (then show the task card): taskTitle, taskDescription
                .selectDistinct({
                    id: tasks.id,
                    title: tasks.title,
                    description: tasks.description,
                    projectName: projects.name,
                    assigneeName: users.name,
                    assigneeUsername: users.username,
                    assigneeDisplayPicture: users.displayPictureLink,
                    slug: tasks.slug,
                    createdAt: tasks.createdAt,
                })
                .from(tasks)
                .innerJoin(projects, eq(tasks.projectId, projects.id))
                .innerJoin(teamMembers, eq(teamMembers.teamId, projects.teamId))
                .leftJoin(users, eq(tasks.assigneeId, users.id))
                .where(inArray(teamMembers.teamId, teamIds))
                .orderBy(desc(tasks.createdAt))
                .limit(10);
            return success(
                200,
                "Dashboard Tasks fetched successfully",
                results
            );
        } catch {
            return failure(500, "Failed to fetch Dashboard Tasks");
        }
    },
    getRecentComments: async (teamIds: string[]) => {
        try {
            const results = await db
                // "[author] has commented to [taskName],"
                // (then show comment card) author, username, displayPicture, comment, and taskTitle
                .selectDistinct({
                    id: comments.id,
                    content: comments.content,
                    taskName: tasks.title,
                    projectName: projects.name,
                    authorName: users.name,
                    authorUsername: users.username,
                    authorDisplayPicture: users.displayPictureLink,
                    createdAt: comments.createdAt,
                })
                .from(comments)
                .innerJoin(tasks, eq(comments.taskId, tasks.id))
                .innerJoin(projects, eq(tasks.projectId, projects.id))
                .innerJoin(teamMembers, eq(teamMembers.teamId, projects.teamId))
                .innerJoin(users, eq(comments.authorId, users.id))
                .where(inArray(teamMembers.teamId, teamIds))
                .orderBy(desc(comments.createdAt))
                .limit(10);
            return success(
                200,
                "Dashboard Comments fetched successfully",
                results
            );
        } catch {
            return failure(500, "Failed to fetch Dashboard Comments");
        }
    },
    getRecentTeamMembers: async (teamIds: string[]) => {
        try {
            const results = await db
                // "[user] has joined [teamName]"
                // (then show card): userName, userUsername, userDisplayPicture, teamName
                .selectDistinct({
                    id: teamMembers.id,
                    teamName: teams.name,
                    userName: users.name,
                    userUsername: users.username,
                    userDisplayPicture: users.displayPictureLink,
                    createdAt: teamMembers.createdAt,
                })
                .from(teamMembers)
                .innerJoin(teams, eq(teamMembers.teamId, teams.id))
                .innerJoin(users, eq(teamMembers.userId, users.id))
                .where(
                    and(
                        inArray(teamMembers.teamId, teamIds),
                        eq(teamMembers.inviteConfirmed, true)
                    )
                )
                .orderBy(desc(teamMembers.createdAt))
                .limit(10);
            return success(
                200,
                "Dashboard Team Members fetched successfully",
                results
            );
        } catch {
            return failure(500, "Failed to fetch Dashboard Team Members");
        }
    },
};
