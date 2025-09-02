import { Metadata } from "next";
import CalendarPage from "./CalendarPage";
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Calendar",
        description: "See due projects and tasks",
    };
}

export default function Page() {
    return <CalendarPage />;
}
