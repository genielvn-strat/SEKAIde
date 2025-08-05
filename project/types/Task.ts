export interface Task {
    id: string;
    title: string;
    description?: string;
    projectId: string;
    listId: string;
    assigneeId?: string;
    priority: "low" | "medium" | "high";
    dueDate?: Date;
    position: number;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateTask = Omit<
    Task,
    "id" | "createdAt" | "updatedAt" | "projectId"
>;

export type UpdateTask = Partial<Omit<
    Task,
    "id" | "createdAt" | "updatedAt" | "projectId"
>>;
