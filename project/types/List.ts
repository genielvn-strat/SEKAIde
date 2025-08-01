export interface List {
    id: string;
    name: string;
    projectId: string | null;
    position: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}
