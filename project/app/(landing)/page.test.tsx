import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LandingPage from "./page";
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

function resizeWindow(width: number, height: number) {
    (window.innerWidth as number) = width;
    (window.innerHeight as number) = height;
    window.dispatchEvent(new Event("resize"));
}

describe("LandingPage", () => {
    test("renders heading and description", () => {
        render(<LandingPage />);
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
            /make your task world manageable/i
        );
        expect(
            screen.getByText(/a simple, open-source kanban board/i)
        ).toBeInTheDocument();
    });

    test("calls redirect on button click", () => {
        render(<LandingPage />);
        screen.getByRole("button", { name: /get started/i }).click();
        expect(redirect).toHaveBeenCalledWith("/sign-in");
    });

    test("shows phone mockup when portrait", () => {
        resizeWindow(400, 800); // portrait
        render(<LandingPage />);
        expect(screen.getByAltText("phone-light")).toBeInTheDocument();
    });

    test("shows laptop mockup when landscape", () => {
        resizeWindow(1200, 800); // landscape
        render(<LandingPage />);
        expect(screen.getByAltText("laptop-light")).toBeInTheDocument();
    });

    test("disables and restores scroll", () => {
        const original = document.body.style.overflow;
        const { unmount } = render(<LandingPage />);

        expect(document.body.style.overflow).toBe("hidden");

        unmount();
        expect(document.body.style.overflow).toBe(original);
    });
});
