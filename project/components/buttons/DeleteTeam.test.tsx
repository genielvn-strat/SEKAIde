import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteTeam from "./DeleteTeam";
import { FetchTeamDetails } from "@/types/ServerResponses";
import { toast } from "sonner";

const mockDeleteTeam = jest.fn();

jest.mock("@/hooks/useTeams", () => ({
    useTeamActions: () => ({
        deleteTeam: mockDeleteTeam,
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

const mockTeamDetails = {
    id: "team-1",
    name: "Mock Team Name",
    slug: "team-1",
} as FetchTeamDetails;

describe("DeleteTeam", () => {
    beforeEach(() => {
        mockDeleteTeam.mockReset();
        (toast.success as jest.Mock).mockReset();
        (toast.error as jest.Mock).mockReset();
    });

    test("no confirmation text", async () => {
        render(<DeleteTeam teamDetails={mockTeamDetails} />);
        fireEvent.click(screen.getByRole("button", { name: /delete team/i }));
        expect(screen.getByRole("button", { name: /delete/i })).toBeDisabled();
    });

    test("successfully delete the team", async () => {
        mockDeleteTeam.mockResolvedValueOnce({ success: true });
        render(<DeleteTeam teamDetails={mockTeamDetails} />);

        // open the dialog
        fireEvent.click(screen.getByRole("button", { name: /delete team/i }));

        // now the confirmation input should exist
        fireEvent.change(
            screen.getByPlaceholderText(/type confirmation text.../i),
            { target: { value: "I am sure to delete this team" } }
        );

        fireEvent.click(screen.getByRole("button", { name: /delete/i }));

        await waitFor(() => {
            expect(mockDeleteTeam).toHaveBeenCalledWith("team-1");
            expect(toast.success).toHaveBeenCalledWith(
                "Team has been deleted successfully."
            );
            expect(mockPush).toHaveBeenCalledWith("/teams/");
        });
    });
    test("fail to delete the team", async () => {
        mockDeleteTeam.mockResolvedValueOnce({
            success: false,
            message: "Failed to delete team",
        });
        render(<DeleteTeam teamDetails={mockTeamDetails} />);
        fireEvent.click(screen.getByRole("button", { name: /delete team/i }));

        fireEvent.change(
            screen.getByPlaceholderText(/type confirmation text.../i),
            { target: { value: "I am sure to delete this team" } }
        );
        fireEvent.click(screen.getByRole("button", { name: /delete/i }));
        await waitFor(() => {
            expect(mockDeleteTeam).toHaveBeenCalledWith("team-1");
            expect(toast.error).toHaveBeenCalledWith("Failed to delete team");
        });
    });
});
