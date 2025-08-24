export interface Task {
    id: string;
    title: string;
    description?: string;
    projectId: string;
    listId: string | null;
    assigneeId?: string;
    slug: string;
    finished: boolean;
    priority: "low" | "medium" | "high";
    dueDate?: Date;
    position: number;
    createdAt: Date;
    updatedAt: Date;
    finishedAt: Date | null;
}

export type CreateTask = Omit<
    Task,
    "id" | "createdAt" | "updatedAt" | "finishedAt" | "projectId"
>;

export type UpdateTask = Partial<
    Omit<
        Task,
        "id" | "createdAt" | "updatedAt" | "finishedAt" | "projectId" | "slug"
    >
>;

export type ArrangeTask = Pick<Task, "id" | "listId" | "position">;
