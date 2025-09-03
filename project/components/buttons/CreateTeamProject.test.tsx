import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTeamProject from "./CreateTeamProject";
import { toast } from "sonner";

const mockCreateProject = jest.fn();
const mockPush = jest.fn();

jest.mock("@/hooks/useProjects", () => ({
    useProjectActions: () => ({
        createProject: mockCreateProject,
    }),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockTeamDetails = {
    id: "team-123",
    name: "My Test Team",
    description: "A mock team",
    slug: "mock-team",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-02",
    projectCount: 0,
    memberCount: 0,
    taskCount: 0
};

describe("CreateTeamProject", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders dialog trigger", () => {
        render(<CreateTeamProject teamDetails={mockTeamDetails} />);
        expect(
            screen.getByRole("button", { name: /create project/i })
        ).toBeInTheDocument();
    });

    test("opens dialog when clicking Create Project", () => {
        render(<CreateTeamProject teamDetails={mockTeamDetails} />);
        fireEvent.click(
            screen.getByRole("button", { name: /create project/i })
        );

        expect(
            screen.getByRole("heading", { name: /create project/i })
        ).toBeInTheDocument();
    });

    test("disables team select and shows correct team name", () => {
        render(<CreateTeamProject teamDetails={mockTeamDetails} />);
        fireEvent.click(
            screen.getByRole("button", { name: /create project/i })
        );

        expect(screen.getByText(mockTeamDetails.name)).toBeInTheDocument();
        expect(
            screen.getByText(mockTeamDetails.name).closest("button")
        ).toHaveAttribute("disabled");
    });

    test("calls createProject and redirects on success", async () => {
        mockCreateProject.mockResolvedValueOnce({
            success: true,
            data: { slug: "new-project" },
        });

        render(<CreateTeamProject teamDetails={mockTeamDetails} />);
        fireEvent.click(
            screen.getByRole("button", { name: /create project/i })
        );

        fireEvent.change(screen.getByPlaceholderText(/hello world project/i), {
            target: { value: "New Project" },
        });

        fireEvent.click(screen.getByRole("button", { name: /^create$/i }));

        await waitFor(() => {
            expect(mockCreateProject).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith(
                "Project has been created successfully."
            );
            expect(mockPush).toHaveBeenCalledWith("/projects/new-project");
        });
    });

    test("shows error when createProject fails", async () => {
        mockCreateProject.mockResolvedValueOnce({
            success: false,
            message: "Failed to create project",
        });

        render(<CreateTeamProject teamDetails={mockTeamDetails} />);
        fireEvent.click(
            screen.getByRole("button", { name: /create project/i })
        );

        fireEvent.change(screen.getByPlaceholderText(/hello world project/i), {
            target: { value: "Bad Project" },
        });

        fireEvent.click(screen.getByRole("button", { name: /^create$/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "Failed to create project"
            );
        });
    });
});
