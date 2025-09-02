import { Metadata } from "next";
import NotificationsPage from "./NotificationsPage";
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Notifications",
        description: "See invited teams",
    };
}

export default function Page() {
    return <NotificationsPage />;
}
