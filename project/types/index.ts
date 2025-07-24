export interface User {
    id: string;
    clerkId: string;
    email: string;
    name: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Team {
    id: string;
    name: string;
    ownerId: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    dueDate: Date | string | null;
}

export interface TeamMember {
    id: string;
    userId: string;
    teamId: string;
    role: "member" | "project_manager" | "admin";
    inviteConfirmed: boolean;
    createdAt: Date | string;
}

export interface Project {
    id: string;
    name: string;
    description: string | null;
    ownerId: string | null;
    teamId: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    dueDate: Date | string | null;
}

export interface List {
    id: string;
    name: string;
    projectId: string | null;
    position: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Task {
    id: string;
    title: string;
    description: string | null;
    projectId: string | null;
    listId: string | null;
    assigneeId: string | null;
    priority: "low" | "medium" | "high";
    dueDate: Date | string | null;
    position: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Comment {
    id: string;
    content: string;
    taskId: string | null;
    authorId: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}
