
export interface TeamMember {
    id: string;
    userId: string;
    teamId: string;
    roleId: string;
    roleColor: string;
    inviteConfirmed: boolean;
    createdAt: Date;
}

export type CreateTeamMember = Omit<TeamMember, "id" | "createdAt">;
export type UpdateTeamMember = Partial<Omit<TeamMember, "id" | "createdAt">>;
