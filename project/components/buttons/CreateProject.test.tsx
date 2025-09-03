import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateProject from "./CreateProject";
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
});
