import { Metadata } from "next";
import TaskDetailsPage from "./TaskDetailsPage";
import { FetchTask } from "@/types/ServerResponses";
import { fetchTaskBySlug } from "@/actions/taskActions";

interface PageProps {
    params: Promise<{
        projectSlug: string;
        taskSlug: string;
    }>;
}
export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { projectSlug, taskSlug } = await params;
    const taskDetails: FetchTask | null =
        (await fetchTaskBySlug(taskSlug, projectSlug)).data ?? null;

    if (!taskDetails) return {};

    return {
        title: taskDetails.title,
        description: taskDetails.description ?? "",
    };
}
export default async function Page({ params }: PageProps) {
    const { projectSlug, taskSlug } = await params;
    return <TaskDetailsPage projectSlug={projectSlug} taskSlug={taskSlug} />;
}
