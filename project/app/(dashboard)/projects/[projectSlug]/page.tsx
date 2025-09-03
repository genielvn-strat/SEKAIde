import { Metadata } from "next";
import ProjectDetailsPage from "./ProjectDetailsPage";
import { FetchProject } from "@/types/ServerResponses";
import { fetchProjectBySlug } from "@/actions/projectActions";

interface PageProps {
    params: Promise<{
        projectSlug: string;
    }>;
}
export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { projectSlug } = await params;
    const projectDetails: FetchProject | null =
        (await fetchProjectBySlug(projectSlug)).data ?? null;

    if (!projectDetails) return {};

    return {
        title: projectDetails.name,
        description: projectDetails.description ?? "",
    };
}
export default async function Page({ params }: PageProps) {
    const { projectSlug } = await params;
    return <ProjectDetailsPage projectSlug={projectSlug} />;
}
