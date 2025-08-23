"use server";
import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";
import { success } from "@/types/Response";
import { DashboardRecent } from "@/types/Dashboard";

export const fetchDashboard = async () => {
    const userId = await getUserDbId();
    const teams = await queries.teams
        .getJoinedTeamsNoDetails(userId)
        .then((res) => res.data ?? []);

    const [recentProjects, recentTasks, recentComments, recentTeamMembers] =
        await Promise.all([
            queries.dashboard
                .getRecentProjects(teams)
                .then((res) => res.data ?? []),
            queries.dashboard
                .getRecentTasks(teams)
                .then((res) => res.data ?? []),
            queries.dashboard
                .getRecentComments(teams)
                .then((res) => res.data ?? []),
            queries.dashboard
                .getRecentTeamMembers(teams)
                .then((res) => res.data ?? []),
        ]);
    const merged: DashboardRecent[] = [
        ...recentProjects.map((p) => ({
            data: { ...p },
            type: "project" as const,
            date: p.createdAt,
        })),
        ...recentTasks.map((t) => ({
            data: { ...t },
            type: "task" as const,
            date: t.createdAt,
        })),
        ...recentComments.map((c) => ({
            data: { ...c },
            type: "comment" as const,
            date: c.createdAt,
        })),
        ...recentTeamMembers.map((m) => ({
            data: { ...m },
            type: "teamMember" as const,
            date: m.createdAt,
        })),
    ];

    merged.sort(
        (a, b) =>
            new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
    );
    return success(200, "Dashboard fetched successfully", merged);
};
