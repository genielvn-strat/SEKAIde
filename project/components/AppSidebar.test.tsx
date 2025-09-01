import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "./ui/sidebar";

jest.mock("@clerk/nextjs", () => ({
    useSession: () => ({
        session: { user: { fullName: "Test User", imageUrl: "test.png" } },
    }),
    useAuth: () => ({
        signOut: jest.fn(),
    }),
}));

jest.mock("@/hooks/useTeams", () => ({
    useInvitedTeams: jest.fn(() => ({ teams: [] })),
}));

jest.mock("@/stores/recentStores", () => ({
    useRecentStore: jest.fn(() => ({ recents: [] })),
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: { info: jest.fn() },
}));

describe("AppSidebar", () => {
    beforeEach(() => {
        const { useRecentStore } = jest.requireMock("@/stores/recentStores");
        useRecentStore.mockReturnValue({
            recents: [
                {
                    type: "project",
                    title: "Project Alpha",
                    link: "/projects/1",
                },
                { type: "task", title: "Fix Bug", link: "/tasks/1" },
                { type: "team", title: "Dev Team", link: "/teams/1" },
            ],
        });
        const { useInvitedTeams } = jest.requireMock("@/hooks/useTeams");
        (useInvitedTeams as jest.Mock).mockReturnValue({
            teams: [
                {
                    id: "1",
                    name: "Web Development Team",
                    slug: "web-dev",
                    projectCount: 1,
                    memberCount: 5,
                },
            ],
        });
    });
    test("renders recents section when recents exist", () => {
        render(
            <SidebarProvider>
                <AppSidebar />
            </SidebarProvider>
        );

        expect(screen.getByText("Project Alpha")).toBeInTheDocument();
        expect(screen.getByText("Fix Bug")).toBeInTheDocument();
        expect(screen.getByText("Dev Team")).toBeInTheDocument();
    });

    test("check if the bell change when invitation exists", () => {
        render(
            <SidebarProvider>
                <AppSidebar />
            </SidebarProvider>
        );
        const notifications = screen.getByText("Notifications").closest("a");
        expect(notifications).toBeInTheDocument();

        const svgIcon = notifications?.querySelector("svg");
        expect(svgIcon).toBeInTheDocument();

        expect(svgIcon).toHaveClass("lucide-bell-dot");
    });
});
