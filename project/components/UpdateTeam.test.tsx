import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateTeam from "./UpdateTeam";
import { toast } from "sonner";
import { FetchTeamDetails } from "@/types/ServerResponses";

const mockUpdateTeam = jest.fn();

jest.mock("@/hooks/useTeams", () => ({
    useTeamActions: () => ({
        updateTeam: mockUpdateTeam,
    }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockTeam = {
    id: "team-1",
    name: "Test Team",
    slug: "team-1",
} as FetchTeamDetails;

describe("UpdateTeam", () => {
    beforeEach(() => {
        mockUpdateTeam.mockReset();
        (toast.success as jest.Mock).mockReset();
        (toast.error as jest.Mock).mockReset();
    });

    test("renders inputs and button", () => {
        render(<UpdateTeam teamDetails={mockTeam} />);
        expect(screen.getByPlaceholderText("Team Name")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /save changes/i })
        ).toBeInTheDocument();
    });

    test("submits update successfully", async () => {
        mockUpdateTeam.mockResolvedValueOnce({ success: true });

        render(<UpdateTeam teamDetails={mockTeam} />);
        fireEvent.change(screen.getByPlaceholderText("Team Name"), {
            target: { value: "Updated Team Name" },
        });
        fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

        await waitFor(() => {
            expect(mockUpdateTeam).toHaveBeenCalledWith({
                teamId: "team-1",
                data: {
                    name: "Updated Team Name",
                },
            });
            expect(toast.success).toHaveBeenCalledWith(
                "Team has been updated successfully."
            );
        });
    });

    test("handles update failure", async () => {
        mockUpdateTeam.mockResolvedValueOnce({
            success: false,
            message: "Failed to update",
        });

        render(<UpdateTeam teamDetails={mockTeam} />);
        fireEvent.change(screen.getByPlaceholderText("Team Name"), {
            target: { value: "Bad Project" },
        });
        fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

        await waitFor(() => {
            expect(mockUpdateTeam).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith("Failed to update");
        });
    });
});
