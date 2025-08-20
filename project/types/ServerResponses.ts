// Teams

export type FetchTeams = {
    id: string;
    name: string;
    slug: string;
    projectCount: number;
    memberCount: number;
    createdAt: string | null;
    updatedAt: string | null;
};

export type FetchTeamDetails = {
    id: string;
    name: string;
    slug: string;
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
    teamId?: string;
    teamName?: string;
    finishedTaskCount?: number;
    totalTaskCount?: number;
    createdAt: string | null;
    updatedAt: string | null;
    dueDate: string | null;
};

// Team Members

export type FetchTeamMember = {
    userId: string;
    name: string;
    username: string;
    email: string;
    displayPictureLink: string;
    roleName: string;
    roleColor: string;
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
    listId?: string;
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
