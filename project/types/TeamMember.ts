import { Team } from "./Team";

export interface TeamMember {
    id: string;
    userId: string;
    teamId: string;
    role: "member" | "project_manager" | "admin";
    inviteConfirmed: boolean;
    createdAt: Date;
}

export type CreateTeamMember = Omit<TeamMember, "id" | "createdAt">;
export type UpdateTeamMember = Partial<Omit<TeamMember, "id" | "createdAt">>;
