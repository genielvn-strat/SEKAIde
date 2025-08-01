export interface TeamMember {
    id: string;
    userId: string;
    teamId: string;
    role: "member" | "project_manager" | "admin";
    inviteConfirmed: boolean;
    createdAt: Date;
}
