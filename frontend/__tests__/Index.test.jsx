import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import IndexPage from "../src/app/page";
import React from "react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: query === "(prefers-color-scheme: dark)",
    addListener: jest.fn(),
    removeListener: jest.fn(),
}));

beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
});

describe("IndexPage", () => {
    it("should render the Image component", () => {
        render(<IndexPage />);
        const image = screen.getByAltText(/Icon showing the current dark\/light mode setting/i);
        expect(image).toBeInTheDocument();
    });

    it("should render the header (h1)", () => {
        render(<IndexPage />);
        const header = screen.getByRole("heading", { name: /GoodMark/i });
        expect(header).toBeInTheDocument();
    });

    it("should render the paragraph", () => {
        render(<IndexPage />);
        const paragraph = screen.getByText(/A lightweight, web-based Markdown editor/i);
        expect(paragraph).toBeInTheDocument();
    });

    it("should render the Start Editing button", () => {
        render(<IndexPage />);
        const button = screen.getByRole("button", { name: /Start Editing/i });
        expect(button).toBeInTheDocument();
    });

    it("should redirect you to editor when Start Editing is pressed", async () => {
        const mockPush = jest.fn();
        useRouter.mockReturnValue({
            push: mockPush,
        });

        render(<IndexPage />);
        const button = screen.getByRole("button", { name: /Start Editing/i });
        fireEvent.click(button);

        await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/editor"));
    });

    it("should redirect to /editor if user has visited before", async () => {
        const mockPush = jest.fn();
        localStorage.setItem("hasVisitedBefore", "true");
        useRouter.mockReturnValue({
            push: mockPush,
        });

        render(<IndexPage />);

        await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/editor"));
    });

    it("should set localStorage and not redirect if user has not visited before", async () => {
        const mockPush = jest.fn();
        useRouter.mockReturnValue({
            push: mockPush,
        });

        render(<IndexPage />);

        const button = screen.getByRole("button", { name: /Start Editing/i });
        fireEvent.click(button);

        await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/editor"));
        expect(localStorage.setItem).toHaveBeenCalledWith("hasVisitedBefore", "true");
    });

    test("loads with the correct theme based on system preference", () => {
        render(<IndexPage />);

        const rootElement = document.documentElement;

        expect(rootElement).toHaveAttribute("data-theme", "dark");
    });

    test("dark mode toggle should switch the page to light mode and update data-theme", () => {
        render(<IndexPage />);

        const themeToggle = screen.getByTestId("theme-toggle");

        const rootElement = document.documentElement;
        expect(rootElement).toHaveAttribute("data-theme", "dark");

        fireEvent.click(themeToggle);

        expect(rootElement).toHaveAttribute("data-theme", "light");
    });
});
