export interface Project {
    id: string;
    name: string;
    description: string | undefined;
    slug: string;
    ownerId: string;
    teamId: string;
    createdAt: Date;
    updatedAt: Date;
    dueDate: Date | undefined;
}

export type CreateProject = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type UpdateProject = Partial<
    Omit<Project, "createdAt" | "updatedAt" | "ownerId" | "teamId" | "slug">
>;
