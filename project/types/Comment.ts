export interface Comment {
    id: string;
    content: string;
    taskId: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateComment = Pick<Comment, "content">;
export type UpdateComment = Partial<Pick<Comment, "content">>;
