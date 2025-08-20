export interface List {
    id: string;
    name: string;
    description?: string | undefined;
    projectId: string;
    position: number;
    isFinal: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export type CreateList = Omit<
    List,
    "id" | "createdAt" | "updatedAt" | "projectId"
>;

export type UpdateList = Partial<
    Pick<List, "name" | "description" | "position">
>;
