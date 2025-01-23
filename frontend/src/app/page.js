"use client";

import axios from "axios";
import React, { useState } from "react";
import { Courier_Prime } from "next/font/google";

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-courier-prime",
  weight: ["400"]
});

export default function Home() {
  const [editorText, setEditorText] = useState("");
  const [renderedText, setRenderedText] = useState("");
  const [clearButtonColour, setClearColour] = useState("#3D444D");
  const [clearButtonText, setClearText] = useState("Clear Markdown")
  const [activeClear, setActiveClearValue] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleEditorChange = (event) => {
    const newValue = event.target.value;
    setEditorText(newValue); // Update the state
    handleRender(newValue);  // Call the function with the latest value
    resetClearMarkdown(); // Reset the clear confirmation back to false
  };

  const handleRender = async (markdown) => {
    if (!markdown) {
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/render`, {
        markdown,
      });
      setRenderedText(response.data.html); // Set the raw HTML
    } catch (error) {
      console.error("Error rendering Markdown:", error);
    }
  };

  const saveMarkdown = async () => {
    try {
      if (window.showSaveFilePicker) {
        saveWindow();
      } else {
        saveLink();
      }
    } catch (error) {
      console.error("Error saving Markdown file:", error);
    }
  };

  const saveWindow = async () => {
    const options = {
      types: [
        {
          description: "Markdown File",
          accept: { "text/markdown": [".md", ".txt"] }
        }
      ]
    };

    const handle = await window.showSaveFilePicker(options);

    const writableStream = await handle.createWritable();
    await writableStream.write(new Blob([editorText], { type: "text/markdown" }));

    await writableStream.close();
  }

  const saveLink = () => {
    const link = document.createElement("a");

    link.href = URL.createObjectURL(new Blob([editorText], { type: "text/markdown" }));
    link.download = "markdown.md";

    link.click();
  }

  const loadMarkdown = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".md,.txt";

      input.onchange = () => {
        const file = input.files[0];
        const fileReader = new FileReader();

        fileReader.onload = (event) => {
          setEditorText(event.target.result);
        };

        fileReader.readAsText(file);
      };

      input.click();
    } catch (error) {
      console.error("Error loading Markdown file:", error);
    }
  };

  const setActiveClear = (value) => {
    setActiveClearValue(value);

    if (value) {
      setClearColour("#F28260");
      setClearText("Confirm Clear?");

      return;
    }

    setClearColour("#3D444D");
    setClearText("Clear Markdown");
  };

  const clearMarkdown = () => {
    if (activeClear) {
      setEditorText("");

      setActiveClear(false);
      return;
    }

    setActiveClear(true)
  }

  const resetClearMarkdown = () => {
    setActiveClear(false);
  }

  return (
    <div className="main">
      <h1 className="goodmark"><strong><u>GoodMark</u></strong></h1>
      <div className="container">
        <textarea
          className="textzone"
          value={editorText}
          onChange={handleEditorChange}
          rows="10"
          cols="50"
          placeholder="Enter markdown here"
          data-testid="markdown-editor"
        />
        <div className="preview textzone" data-testid="markdown-preview" dangerouslySetInnerHTML={{ __html: renderedText }} />
        <div className="buttonContainer">
          <div className="mainButtons">
            <button
              onClick={saveMarkdown}
            >Save Markdown</button>
            <button
              onClick={loadMarkdown}
            >Load Markdown</button>
          </div>
          <button
            style={{ backgroundColor: clearButtonColour }}
            onClick={clearMarkdown}
          >{clearButtonText}</button>
        </div>
      </div>
    </div>
  );
}
