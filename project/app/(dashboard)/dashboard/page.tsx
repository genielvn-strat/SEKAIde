import { Metadata } from "next";
import DashboardPage from "./DashboardPage";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Dashboard",
        description: "List of recent activities",
    };
}

export default function Page() {
    return <DashboardPage />;
}
