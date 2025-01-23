import Home from "../src/app/page";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import axios from "axios";

jest.mock("axios");

beforeEach(() => {
  jest.clearAllMocks();
});

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

  test("that Markdown the preview area is updated when text is entered", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        html: "<p>Hello</p>",
      },
    });

    render(<Home />);
    const textarea = screen.getByTestId("markdown-editor");
    const preview = screen.getByTestId("markdown-preview");

    expect(preview).toHaveTextContent("");

    fireEvent.change(textarea, { target: { value: "Hello" } });

    await waitFor(() => {
      console.log("Mock axios calls:", axios.post.mock.calls);
      expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/render", {
        markdown: "Hello",
      });

      expect(preview.innerHTML).toContain("<p>Hello</p>");
    })
  });

  test("that Markdown formatting is displayed in Markdown preview when Markdown is entered in the textarea", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        html: "<h1>Hello</h1><p><strong>This text is bold</strong></p>",
      },
    });

    render(<Home />);
    const textarea = screen.getByTestId("markdown-editor");
    const preview = screen.getByTestId("markdown-preview");

    expect(preview).toHaveTextContent("");

    fireEvent.change(textarea, { target: { value: "# Hello\n\n**This text is bold**" } });

    await waitFor(() => {
      console.log("Mock axios calls:", axios.post.mock.calls);
      expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/render", {
        markdown: "# Hello\n\n**This text is bold**",
      });

      expect(preview.innerHTML).toContain("<h1>Hello</h1>");
      expect(preview.innerHTML).toContain("<strong>This text is bold</strong>");
    })
  });

  test("that the API is not called when textarea is empty", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        html: "",
      },
    });

    render(<Home />);
    const textarea = screen.getByTestId("markdown-editor");

    fireEvent.change(textarea, { target: { value: "" } });

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  test("that unsafe HTML is not rendered in the preview", async () => {
    const maliciousHTML = "<img src=\"x\" onerror=\"alert(\"Hacked!\")\" />";
    axios.post.mockResolvedValueOnce({
      data: { html: maliciousHTML },
    });

    render(<Home />);
    const textarea = screen.getByTestId("markdown-editor");
    const preview = screen.getByTestId("markdown-preview");

    fireEvent.change(textarea, { target: { value: "Malicious" } });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/render", {
        markdown: "Malicious",
      });

      expect(preview.innerHTML).not.toContain("src=\"x\"");
      expect(preview.innerHTML).not.toContain("onerror");
    });
  });
});
