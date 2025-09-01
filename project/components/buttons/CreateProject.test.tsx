import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateProject from "./CreateProject";
import { toast } from "sonner";
import { FetchTeams } from "@/types/ServerResponses";

const mockCreateProject = jest.fn();
let mockTeams: FetchTeams[] = [];

jest.mock("@/hooks/useTeams", () => ({
    useTeamWithCreateProject: () => ({
        teams: mockTeams,
        isLoading: false,
        isError: false,
    }),
}));

jest.mock("@/hooks/useProjects", () => ({
    useProjectActions: () => ({
        createProject: mockCreateProject,
    }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
        replace: jest.fn(),
        refresh: jest.fn(),
    }),
}));

describe("CreateProject", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockTeams = [];
    });

    test("no teams available", () => {
        render(<CreateProject />);
        fireEvent.click(
            screen.getByRole("button", { name: /create project/i })
        );

        expect(screen.getByText(/no teams available/i)).toBeInTheDocument();
    });

    // test("successfully create the project", async () => {
    //     mockTeams = [
    //         {
    //             id: "team-1",
    //             name: "Mock Team",
    //             slug: "mock-team",
    //         } as FetchTeams,
    //     ];

    //     mockCreateProject.mockResolvedValueOnce({
    //         success: true,
    //         data: { slug: "mock-project" },
    //     });

    //     render(<CreateProject />);

    //     fireEvent.click(
    //         screen.getByRole("button", { name: /create project/i })
    //     );

    //     fireEvent.change(screen.getByPlaceholderText(/hello world project/i), {
    //         target: { value: "My Project" },
    //     });

    //     fireEvent.change(
    //         screen.getByPlaceholderText(
    //             /a project that displays hello world to everyone./i
    //         ),
    //         {
    //             target: { value: "My description" },
    //         }
    //     );

    //     fireEvent.mouseDown(screen.getByText(/select a team/i));
    //     fireEvent.click(screen.getByText(/mock team/i));

    //     fireEvent.click(screen.getByRole("button", { name: /^create$/i }));

    //     await waitFor(() => {
    //         expect(mockCreateProject).toHaveBeenCalledWith({
    //             name: "My Project",
    //             description: "My description",
    //             dueDate: undefined,
    //             teamId: "mock-project",
    //         });
    //         expect(toast.success).toHaveBeenCalledWith(
    //             "Project has been created successfully."
    //         );
    //         expect(mockPush).toHaveBeenCalledWith("/projects/mock-project");
    //     });
    // });

    // test("fail to create the project", async () => {
    //     mockTeams = [
    //         {
    //             id: "team-1",
    //             name: "Mock Team",
    //             slug: "mock-team",
    //         } as FetchTeams,
    //     ];

    //     mockCreateProject.mockResolvedValueOnce({
    //         success: false,
    //         message: "Failed to create project",
    //     });

    //     render(<CreateProject />);
    //     fireEvent.click(
    //         screen.getByRole("button", { name: /create project/i })
    //     );

    //     fireEvent.change(screen.getByPlaceholderText(/hello world project/i), {
    //         target: { value: "My Project" },
    //     });

    //     fireEvent.mouseDown(screen.getByText(/select a team/i));
    //     fireEvent.click(screen.getByText(/mock team/i));

    //     await waitFor(() => {
    //         expect(mockCreateProject).toHaveBeenCalled();
    //         expect(toast.error).toHaveBeenCalledWith(
    //             "Failed to create project"
    //         );
    //     });
    // });
});
