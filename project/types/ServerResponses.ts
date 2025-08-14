// Teams
export type FetchOwnedTeams = {
    id: string;
    teamName: string;
    slug: string;
    createdAt: string | null;
    updatedAt: string | null;
};

export type FetchJoinedTeams = {
    id: string;
    teamName: string;
    slug: string;
    role: string;
    inviteConfirmed: boolean;
    createdAt: string | null;
    updatedAt: string | null;
};
export type FetchTeams = {
    owned: FetchOwnedTeams[];
    joined: FetchJoinedTeams[];
};

export type FetchTeamDetails = {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    createdAt: string | null;
    updatedAt: string | null;
};

// Projects

export type FetchProject = {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    ownerId: string;
    teamId: string;
    teamName: string;
    createdAt: string | null;
    updatedAt: string | null;
    dueDate: string | null;
};

// Team Members

export type FetchTeamMember = {
    userId: string;
    name: string;
    username: string;
    role: "admin" | "project_manager" | "member";
    inviteConfirmed: boolean;
};

// Tasks
export type FetchTask = {
    id: string;
    title: string;
    description: string | null;
    priority: "low" | "medium" | "high";
    dueDate: string | null;
    position: number;
    slug: string;
    assigneeName: string;
    assigneeUsername: string;
    projectName: string;
    projectSlug: string;
    listName: string;
};

// Lists
export type FetchList = {
    id: string;
    name: string;
    description: string | null;
    position: number;
};

// Comment
export type FetchComment = {
    id: string;
    content: string;
    taskId: string;
    authorId: string;
    authorName: string;
    authorUsername: string;
    createdAt: string | null;
    updatedAt: string | null;
};
