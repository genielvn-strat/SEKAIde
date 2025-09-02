import { Metadata } from "next";
import SettingsPage from "./SettingsPage";
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Settings",
        description: "See due projects and tasks",
    };
}

export default function Page() {
    return <SettingsPage />;
}
