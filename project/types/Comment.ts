export interface Comment {
    id: string;
    content: string;
    taskId: string | null;
    authorId: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}
