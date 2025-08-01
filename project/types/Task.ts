export interface Task {
    id: string;
    title: string;
    description: string | null;
    projectId: string;
    listId: string;
    assigneeId: string;
    createdBy: string;
    priority: "low" | "medium" | "high";
    dueDate: Date | null;
    position: number;
    createdAt: Date;
    updatedAt: Date;
}
