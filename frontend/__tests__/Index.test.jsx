import { render, screen } from "@testing-library/react";
import IndexPage from "../src/app/page";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));


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

        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/editor'));
    });
});
