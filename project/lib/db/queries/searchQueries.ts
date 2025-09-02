import { projects, tasks, teamMembers, teams } from "@/migrations/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { success } from "@/types/Response";

export const searchQueries = {
    fetchItems: async (userId: string) => {
        const result = await db
            .select({
                teamId: teams.id,
                teamName: teams.name,
                teamSlug: teams.slug,
                projectId: projects.id,
                projectName: projects.name,
                projectSlug: projects.slug,
                taskId: tasks.id,
                taskTitle: tasks.title,
                taskPriority: tasks.priority,
                taskFinished: tasks.finished,
                taskSlug: tasks.slug,
            })
            .from(teamMembers)
            .innerJoin(teams, eq(teams.id, teamMembers.teamId))
            .leftJoin(projects, eq(projects.teamId, teams.id))
            .leftJoin(tasks, eq(tasks.projectId, projects.id))
            .where(eq(teamMembers.userId, userId));
        const teamsList = new Map<
            string,
            { id: string; name: string; slug: string }
        >();
        const projectsList = new Map<
            string,
            { id: string; name: string; slug: string }
        >();
        const tasksList = new Map<
            string,
            {
                id: string;
                title: string;
                priority: string;
                finished: boolean;
                slug: string;
            }
        >();

        for (const row of result) {
            if (row.teamId) {
                teamsList.set(row.teamId, {
                    id: row.teamId,
                    name: row.teamName,
                    slug: `/teams/${row.teamSlug}`,
                });
            }
            if (row.projectId && row.projectName) {
                projectsList.set(row.projectId, {
                    id: row.projectId,
                    name: row.projectName,
                    slug: `/projects/${row.projectSlug}/`,
                });
            }
            if (
                row.taskId &&
                row.taskTitle &&
                row.taskFinished !== undefined &&
                row.taskFinished !== null &&
                row.taskPriority
            ) {
                tasksList.set(row.taskId, {
                    id: row.taskId,
                    title: row.taskTitle,
                    priority: row.taskPriority,
                    finished: row.taskFinished,
                    slug: `/projects/${row.projectSlug}/${row.taskSlug}`,
                });
            }
        }

        return success(200, "Search Items fetched successfully", {
            teams: Array.from(teamsList.values()),
            projects: Array.from(projectsList.values()),
            tasks: Array.from(tasksList.values()),
        });
    },
};
