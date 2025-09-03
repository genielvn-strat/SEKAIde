import { Metadata } from "next";
import TeamDetailsPage from "./TeamDetailsPage";
import { FetchTeamDetails } from "@/types/ServerResponses";
import { fetchTeamBySlug } from "@/actions/teamActions";

interface PageProps {
    params: Promise<{
        teamSlug: string;
    }>;
}
export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { teamSlug } = await params;
    const teamDetails: FetchTeamDetails | null =
        (await fetchTeamBySlug(teamSlug)).data ?? null;

    if (!teamDetails) return {};

    return {
        title: teamDetails.name,
    };
}
export default async function Page({ params }: PageProps) {
    const { teamSlug } = await params;
    return <TeamDetailsPage teamSlug={teamSlug} />;
}
