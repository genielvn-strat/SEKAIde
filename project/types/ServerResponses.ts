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
    role: string | null;
    inviteConfirmed: boolean | null;
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
    slug: string;
    description: string | null;
    ownerId: string | null;
    teamId: string | null;
    teamName: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    dueDate: string | null;
};
