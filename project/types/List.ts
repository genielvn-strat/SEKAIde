export interface List {
    id: string;
    name: string;
    description?: string | undefined;
    projectId: string;
    position: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export type CreateList = Omit<List, "id" | "createdAt" | "updatedAt">;
