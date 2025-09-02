import { Metadata } from "next";
import TeamPage from "./TeamPage";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Teams",
        description: "List of your joined teams",
    };
}

export default function Page() {
    return <TeamPage />;
}
