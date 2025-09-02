import { Metadata } from "next";
import ProjectPage from "./ProjectPage";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Projects",
        description: "List of the projects of your teams",
    };
}

export default function Page() {
    return <ProjectPage />;
}
