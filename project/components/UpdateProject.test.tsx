import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateProject from "./UpdateProject";
import { toast } from "sonner";
import { FetchProject } from "@/types/ServerResponses";

const mockUpdateProject = jest.fn();

jest.mock("@/hooks/useProjects", () => ({
    useProjectActions: () => ({
        updateProject: mockUpdateProject,
    }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockProject = {
    name: "Test Project",
    description: "Project Description",
    slug: "project-1",
} as FetchProject;

describe("UpdateProject", () => {
    beforeEach(() => {
        mockUpdateProject.mockReset();
        (toast.success as jest.Mock).mockReset();
        (toast.error as jest.Mock).mockReset();
    });

    test("renders inputs and button", () => {
        render(<UpdateProject project={mockProject} />);
        expect(
            screen.getByPlaceholderText("Hello World Project")
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /save changes/i })
        ).toBeInTheDocument();
    });

    test("submits update successfully", async () => {
        mockUpdateProject.mockResolvedValueOnce({ success: true });

        render(<UpdateProject project={mockProject} />);
        fireEvent.change(screen.getByPlaceholderText("Hello World Project"), {
            target: { value: "Updated Project Name" },
        });
        fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

        await waitFor(() => {
            expect(mockUpdateProject).toHaveBeenCalledWith({
                projectSlug: "project-1",
                data: {
                    name: "Updated Project Name",
                    description: "Project Description",
                    dueDate: undefined,
                },
            });
            expect(toast.success).toHaveBeenCalledWith(
                "Project has been updated successfully."
            );
        });
    });

    test("handles update failure", async () => {
        mockUpdateProject.mockResolvedValueOnce({
            success: false,
            message: "Failed to update",
        });

        render(<UpdateProject project={mockProject} />);
        fireEvent.change(screen.getByPlaceholderText("Hello World Project"), {
            target: { value: "Bad Project" },
        });
        fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

        await waitFor(() => {
            expect(mockUpdateProject).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith("Failed to update");
        });
    });
});
