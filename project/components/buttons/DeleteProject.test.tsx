import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteProject from "./DeleteProject";
import { FetchProject } from "@/types/ServerResponses";
import { toast } from "sonner";

const mockDeleteProject = jest.fn();

jest.mock("@/hooks/useProjects", () => ({
    useProjectActions: () => ({
        deleteProject: mockDeleteProject,
        isDeleting: false,
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

const mockProjectDetails = {
    id: "project-1",
    name: "Mock Project Name",
    slug: "project-1",
} as FetchProject;

describe("DeleteProject", () => {
    beforeEach(() => {
        mockDeleteProject.mockReset();
        (toast.success as jest.Mock).mockReset();
        (toast.error as jest.Mock).mockReset();
    });

    test("no confirmation text", async () => {
        render(<DeleteProject projectDetails={mockProjectDetails} />);
        fireEvent.click(
            screen.getByRole("button", { name: /delete project/i })
        );
        expect(screen.getByRole("button", { name: /delete/i })).toBeDisabled();
    });

    test("successfully delete the project", async () => {
        mockDeleteProject.mockResolvedValueOnce({ success: true });
        render(<DeleteProject projectDetails={mockProjectDetails} />);

        fireEvent.click(
            screen.getByRole("button", { name: /delete project/i })
        );

        fireEvent.change(
            screen.getByPlaceholderText(/type confirmation text.../i),
            { target: { value: "I am sure to delete this project" } }
        );

        fireEvent.click(screen.getByRole("button", { name: /delete/i }));

        await waitFor(() => {
            expect(mockDeleteProject).toHaveBeenCalledWith({ id: "project-1" });
            expect(toast.success).toHaveBeenCalledWith(
                "Project has been deleted successfully."
            );
            expect(mockPush).toHaveBeenCalledWith("/projects/")
        });
    });
    test("fail to delete the project", async () => {
        mockDeleteProject.mockResolvedValueOnce({
            success: false,
            message: "Failed to delete project",
        });
        render(<DeleteProject projectDetails={mockProjectDetails} />);
        fireEvent.click(
            screen.getByRole("button", { name: /delete project/i })
        );

        fireEvent.change(
            screen.getByPlaceholderText(/type confirmation text.../i),
            { target: { value: "I am sure to delete this project" } }
        );
        fireEvent.click(screen.getByRole("button", { name: /delete/i }));
        await waitFor(() => {
            expect(mockDeleteProject).toHaveBeenCalledWith({ id: "project-1" });
            expect(toast.error).toHaveBeenCalledWith(
                "Failed to delete project"
            );
        });
    });
});
