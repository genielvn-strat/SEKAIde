export interface Team {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}
