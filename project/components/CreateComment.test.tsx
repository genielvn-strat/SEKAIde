import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateComment from "./CreateComment";
import { FetchTask } from "@/types/ServerResponses";
import { toast } from "sonner";

const mockCreateComment = jest.fn();

jest.mock("@/hooks/useComments", () => ({
    useCommentActions: () => ({
        createComment: mockCreateComment,
    }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockTask = {
    title: "Test Task",
    projectSlug: "project-1",
    slug: "task-1",
} as FetchTask;

describe("CreateComment", () => {
    beforeEach(() => {
        mockCreateComment.mockReset();
        (toast.success as jest.Mock).mockReset();
        (toast.error as jest.Mock).mockReset();
    });

    test("renders textarea and button", () => {
        render(<CreateComment task={mockTask} />);
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /comment/i })
        ).toBeInTheDocument();
    });

    test("submits a comment successfully", async () => {
        mockCreateComment.mockResolvedValueOnce({ success: true });

        render(<CreateComment task={mockTask} />);
        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "This is a test comment" },
        });
        fireEvent.click(screen.getByRole("button", { name: /comment/i }));

        await waitFor(() => {
            expect(mockCreateComment).toHaveBeenCalledWith({
                data: { content: "This is a test comment" },
                projectSlug: "project-1",
                taskSlug: "task-1",
            });
            expect(toast.success).toHaveBeenCalledWith(
                "Comment has been posted successfully."
            );
        });
    });

    test("handles comment failure", async () => {
        mockCreateComment.mockResolvedValueOnce({
            success: false,
            message: "Failed to post",
        });

        render(<CreateComment task={mockTask} />);
        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "Failing comment" },
        });
        fireEvent.click(screen.getByRole("button", { name: /comment/i }));

        await waitFor(() => {
            expect(mockCreateComment).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith("Failed to post");
        });
    });
});
