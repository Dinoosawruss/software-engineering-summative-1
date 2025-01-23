import Home from "../src/app/page";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";
import axios from "axios";

jest.mock("axios");

beforeEach(() => {
  jest.clearAllMocks();
});

window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: query === '(prefers-color-scheme: dark)',
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

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
      expect(axios.post).toHaveBeenCalledWith("undefined/render", {
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
      expect(axios.post).toHaveBeenCalledWith("undefined/render", {
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
      expect(axios.post).toHaveBeenCalledWith("undefined/render", {
        markdown: "Malicious",
      });

      expect(preview.innerHTML).not.toContain("src=\"x\"");
      expect(preview.innerHTML).not.toContain("onerror");
    });
  });

  test("that the page renders the Save Markdown button", () => {
    render(<Home />);
    const saveMarkdown = screen.getByText("Save Markdown");
    expect(saveMarkdown).toBeInTheDocument();
  });

  test("that the page renders the Load Markdown button", () => {
    render(<Home />);
    const loadMarkdown = screen.getByText("Load Markdown");
    expect(loadMarkdown).toBeInTheDocument();
  });

  test("that the page renders the Clear Markdown button", () => {
    render(<Home />);
    const clearMarkdown = screen.getByText("Clear Markdown");
    expect(clearMarkdown).toBeInTheDocument();
  });

  test("that the Clear Markdown button clears the text in the textarea after confirmation", () => {
    render(<Home />);
    const clearMarkdown = screen.getByText("Clear Markdown");
    const textarea = screen.getByTestId("markdown-editor");

    fireEvent.change(textarea, { target: { value: "Hello" } });
    expect(textarea.value).toBe("Hello");

    fireEvent.click(clearMarkdown);
    expect(textarea.value).toBe("Hello");

    fireEvent.click(clearMarkdown);
    expect(textarea.value).toBe("");
  });

  test("that the Clear Markdown button does not clear the text in the textarea if not confirmed", () => {
    render(<Home />);
    const clearMarkdown = screen.getByText("Clear Markdown");
    const textarea = screen.getByTestId("markdown-editor");

    fireEvent.change(textarea, { target: { value: "Hello" } });
    expect(textarea.value).toBe("Hello");

    fireEvent.click(clearMarkdown);
    expect(textarea.value).toBe("Hello");
  });

  test("that the Clear Markdown button background colour changes on first click and returns after clear", () => {
    render(<Home />);
    const clearMarkdown = screen.getByText("Clear Markdown");
    const textarea = screen.getByTestId("markdown-editor");

    fireEvent.change(textarea, { target: { value: "Hello" } });
    expect(clearMarkdown.className).toContain("noConfirm");
    expect(clearMarkdown.innerHTML).toBe("Clear Markdown");

    fireEvent.click(clearMarkdown);
    expect(clearMarkdown.className).toContain("confirm");
    expect(clearMarkdown.innerHTML).toBe("Confirm Clear?");

    fireEvent.click(clearMarkdown);
    expect(clearMarkdown.className).toContain("noConfirm");
    expect(clearMarkdown.innerHTML).toBe("Clear Markdown");
  });

  test("that the Clear Markdown button returns to Clear Markdown if textarea is edited", () => {
    render(<Home />);
    const clearMarkdown = screen.getByText("Clear Markdown");
    const textarea = screen.getByTestId("markdown-editor");

    fireEvent.change(textarea, { target: { value: "Hello" } });

    expect(clearMarkdown.className).toContain("noConfirm");
    expect(clearMarkdown.innerHTML).toBe("Clear Markdown");

    fireEvent.click(clearMarkdown);
    expect(clearMarkdown.className).toContain("confirm");
    expect(clearMarkdown.innerHTML).toBe("Confirm Clear?");

    fireEvent.change(textarea, { target: { value: "123" } });
    expect(clearMarkdown.className).toContain("noConfirm");
    expect(clearMarkdown.innerHTML).toBe("Clear Markdown");
  });

  test("that highlighted syntax is rendered for JavaScript code blocks", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        html: "<highlighted>console.log('Hello');</highlighted>",
      },
    });

    render(<Home />);

    const textarea = screen.getByTestId("markdown-editor");
    const preview = screen.getByTestId("markdown-preview");

    fireEvent.change(textarea, {
      target: { value: "```javascript\nconsole.log('Hello');\n```" },
    });

    await waitFor(() => {
      console.log("Mock axios calls:", axios.post.mock.calls);
      expect(axios.post).toHaveBeenCalledWith("undefined/render", {
        markdown: "```javascript\nconsole.log('Hello');\n```",
      });

      expect(preview.innerHTML).toContain("<highlighted>console.log('Hello');</highlighted>");
    });
  });

  test("that highlighted syntax is rendered for Python code blocks", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        html: "<highlighted>print('Hello')</highlighted>",
      },
    });

    render(<Home />);

    const textarea = screen.getByTestId("markdown-editor");
    const preview = screen.getByTestId("markdown-preview");

    fireEvent.change(textarea, {
      target: { value: "```python\nprint('Hello');\n```" },
    });

    await waitFor(() => {
      console.log("Mock axios calls:", axios.post.mock.calls);
      expect(axios.post).toHaveBeenCalledWith("undefined/render", {
        markdown: "```python\nprint('Hello');\n```",
      });

      expect(preview.innerHTML).toContain("<highlighted>print('Hello')</highlighted>");
    });
  });

  test("that plaintext is rendered for unsupported languages", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        html: "<highlighted>Some text</highlighted>",
      },
    });

    render(<Home />);

    const textarea = screen.getByTestId("markdown-editor");
    const preview = screen.getByTestId("markdown-preview");

    fireEvent.change(textarea, {
      target: { value: "```unknown\nSome text\n```" },
    });

    await waitFor(() => {
      console.log("Mock axios calls:", axios.post.mock.calls);
      expect(axios.post).toHaveBeenCalledWith("undefined/render", {
        markdown: "```unknown\nSome text\n```",
      });

      expect(preview.innerHTML).toContain("<highlighted>Some text</highlighted>");
    });
  });

  test("that the font selector dropdown is populated with fonts", async () => {
    axios.get.mockResolvedValue({
      data: [
        { value: "Courier_Prime", name: "Courier Prime" },
        { value: "Arial", name: "Arial" },
        { value: "Roboto", name: "Roboto" },
      ],
    });

    await act(async () => {
      render(<Home />);
    });

    expect(axios.get).toHaveBeenCalledWith("undefined/fonts");

    const fontSelector = screen.getByTestId("font-selector");
    expect(fontSelector).toBeInTheDocument();

    const fontOptions = screen.getAllByTestId("font-selector-option");
    expect(fontOptions).toHaveLength(3);

    expect(fontOptions[0]).toHaveTextContent("Courier Prime");
    expect(fontOptions[1]).toHaveTextContent("Arial");
    expect(fontOptions[2]).toHaveTextContent("Roboto");
  });

  test("loads with the correct theme based on system preference", () => {
    render(<Home />);

    const rootElement = document.documentElement;

    expect(rootElement).toHaveAttribute('data-theme', 'dark');
  });
});