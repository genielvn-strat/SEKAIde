export interface User {
    id: string;
    clerkId: string;
    email: string;
    name: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateUser = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UpdateUser = Partial<
    Omit<User, "id" | "clerkId" | "createdAt" | "updatedAt">
>;
