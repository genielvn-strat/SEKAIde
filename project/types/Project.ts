export interface Project {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    ownerId: string | null;
    teamId: string | null;
    createdAt: Date;
    updatedAt: Date;
    dueDate: Date | null;
}
