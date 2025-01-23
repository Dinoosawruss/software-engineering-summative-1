import Home from "../src/app/page";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("Markdown Editor", () => {
  test("renders the textarea element", () => {
    render(<Home />);
    const textarea = screen.getByPlaceholderText("Enter markdown here");
    expect(textarea).toBeInTheDocument();
  });
});
