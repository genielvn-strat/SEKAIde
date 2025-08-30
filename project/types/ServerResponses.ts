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
    projectCount: number;
    memberCount: number;
    taskCount: number;
    createdAt: string | null;
    updatedAt: string | null;
};

export type FetchInvitedTeams = {
    teamMemberId: string;
    teamName: string;
    teamId: string;
    roleName: string;
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
    roleId: string;
    roleName: string;
    roleColor?: string | null;
    inviteConfirmed: boolean;
    allowKick?: boolean;
    allowUpdate?: boolean;
};

export type FetchTeamActivity = {
    userFullName: string | null;
    userName: string | null;
    userDisplayPicture: string | null;
    permissionName: string;
    description: string | null;
    createdAt: string | null;
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
    assigneeId: string;
    assigneeName: string;
    assigneeUsername: string;
    assigneeDisplayPicture: string;
    projectName: string;
    projectSlug: string;
    listId?: string | null;
    listName?: string | null;
    listColor?:
        | "red"
        | "orange"
        | "yellow"
        | "green"
        | "blue"
        | "violet"
        | null;
    finished: boolean;
    allowUpdate?: boolean;
    finishedAt: string | null;
};

// Lists
export type FetchList = {
    id: string;
    name: string;
    description: string | null;
    position: number;
    color?: "red" | "orange" | "yellow" | "green" | "blue" | "violet" | null;
    isFinal: boolean;
};

// Comment
export type FetchComment = {
    id: string;
    content: string;
    taskId: string;
    authorId: string;
    authorName: string;
    authorUsername: string;
    authorDisplayPicture: string;
    createdAt: string | null;
    updatedAt: string | null;
    allowUpdate: boolean;
};

export type FetchUserSession = {
    id: string;
    status: string;
    lastActiveAt: string | null;
    createdAt?: string;
    updatedAt?: string;
    latestActivity?: {
        isMobile: boolean;
        ipAddress: string;
        city: string;
        country: string;
        browserVersion: string;
        browserName: string;
        deviceType: string;
    };
};
