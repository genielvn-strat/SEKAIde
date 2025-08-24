export interface DashboardRecent {
    type: "project" | "task" | "comment" | "teamMember";
    data:
        | DashboardRecentProject
        | DashboardRecentTask
        | DashboardRecentComment
        | DashboardRecentTeamMembers;
    date: string | null;
}

export interface DashboardRecentProject {
    name: string;
    description: string | null;
    teamName: string;
    slug: string;
    createdAt: string | null;
}

export interface DashboardRecentTask {
    id: string;
    title: string;
    description: string | null;
    priority: string;
    projectName: string;
    projectSlug: string;
    assigneeName: string | null;
    assigneeUsername: string | null;
    assigneeDisplayPicture: string | null;
    slug: string;
    createdAt: string | null;
}

export interface DashboardRecentComment {
    id: string;
    content: string;
    taskName: string;
    taskSlug: string;
    projectName: string;
    projectSlug: string;
    authorName: string;
    authorUsername: string;
    authorDisplayPicture: string;
    createdAt: string | null;
}

export interface DashboardRecentTeamMembers {
    id: string;
    teamName: string;
    userName: string;
    userUsername: string;
    userDisplayPicture: string;
    createdAt: string | null;
}
