import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTeam from "./CreateTeam";
import { toast } from "sonner";
import { FetchTeams } from "@/types/ServerResponses";

const mockCreateTeam = jest.fn();

jest.mock("@/hooks/useTeams", () => ({
    useTeamActions: () => ({
        createTeam: mockCreateTeam,
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
    });

    test("successfully create the team", async () => {
        mockCreateTeam.mockResolvedValueOnce({
            success: true,
            data: { slug: "mock-team" },
        });

        render(<CreateTeam />);

        fireEvent.click(screen.getByRole("button", { name: /create team/i }));

        fireEvent.change(screen.getByPlaceholderText(/web development team/i), {
            target: { value: "My Team" },
        });

        fireEvent.click(screen.getByRole("button", { name: /^create$/i }));

        await waitFor(() => {
            expect(mockCreateTeam).toHaveBeenCalledWith({
                name: "My Team",
            });
            expect(toast.success).toHaveBeenCalledWith(
                "Team has been created successfully."
            );
        });
    });

    test("fail to create the project", async () => {
        mockCreateTeam.mockResolvedValueOnce({
            success: false,
            message: "Failed to create team",
        });

        render(<CreateTeam />);
        fireEvent.click(screen.getByRole("button", { name: /create team/i }));

        fireEvent.change(screen.getByPlaceholderText(/web development team/i), {
            target: { value: "My Team" },
        });

        fireEvent.click(screen.getByRole("button", { name: /^create$/i }));

        await waitFor(() => {
            expect(mockCreateTeam).toHaveBeenCalledWith({
                name: "My Team",
            });
            expect(toast.error).toHaveBeenCalledWith("Failed to create team");
        });
    });
});
