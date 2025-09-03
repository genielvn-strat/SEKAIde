import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTaskToList from "./CreateTaskToList";
import { toast } from "sonner";

const mockCreateTask = jest.fn();
const mockMembers = [{ userId: "1", name: "Alice" }];
const mockLists = [
    { id: "list1", name: "Todo", color: "blue", description: "Sample List" },
];
const mockList = {
    id: "list1",
    name: "Todo",
    color: "blue" as const,
    description: "Sample List",
    position: 1,
    isFinal: false,
};

jest.mock("@/hooks/useTasks", () => ({
    useTaskActions: () => ({
        createTask: mockCreateTask,
    }),
}));

jest.mock("@/hooks/useRoles", () => ({
    useAuthRoleByProject: () => ({ permitted: true }),
}));

jest.mock("@/hooks/useTeamMembers", () => ({
    useTeamMembersByProject: () => ({ members: mockMembers }),
}));

jest.mock("@/hooks/useLists", () => ({
    useLists: () => ({ lists: mockLists }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe("CreateTask", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders dialog trigger", () => {
        render(
            <CreateTaskToList projectSlug="test-project" list={mockList} />
        );
        expect(
            screen.getByRole("button", { name: /add task/i })
        ).toBeInTheDocument();
    });

    test("opens dialog when clicking Add Task", () => {
        render(
            <CreateTaskToList projectSlug="test-project" list={mockList} />
        );
        fireEvent.click(screen.getByRole("button", { name: /add task/i }));
        expect(
            screen.getByRole("button", { name: /create task/i })
        ).toBeInTheDocument();
    });
});
