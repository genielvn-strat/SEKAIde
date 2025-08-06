export interface Team {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateTeam = Omit<Team, "id" | "createdAt" | "updatedAt">;
export type UpdateTeam = Partial<
    Omit<Team, "id" | "createdAt" | "updatedAt" | "slug" | "ownerId">
>;
