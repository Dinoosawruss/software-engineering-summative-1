import Home from "../src/app/page";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

describe("Markdown Editor", () => {
  test("that the page renders the textarea element", () => {
    render(<Home />);
    const textarea = screen.getByTestId("markdown-editor");
    expect(textarea).toBeInTheDocument();
  });

  test("that the page renders the preview area", () => {
    render(<Home />);
    const preview = screen.getByTestId("markdown-preview");
    expect(preview).toBeInTheDocument();
  });

  test("that the page renders the heading element", () => {
    render(<Home />);
    const heading = screen.getByText("GoodMark");
    expect(heading).toBeInTheDocument();
  });

  test("that the textarea can be typed in", () => {
    render(<Home />);
    const textarea = screen.getByTestId("markdown-editor");
    fireEvent.change(textarea, { target: { value: "# Hello" } });
    expect(textarea.value).toBe("# Hello");
  });

  test("that the Markdown preview is displayed when Markdown is entered in the textarea", () => {
    render(<Home />);
    const textarea = screen.getByTestId("markdown-editor");
    const preview = screen.getByTestId("markdown-editor");

    expect(preview).toHaveTextContent("");

    fireEvent.change(textarea, { target: { value: "Hello" } });
    expect(preview).toHaveTextContent("Hello");
  });
});
