"use client";

import axios from "axios";
import React, { useState } from "react";
import { Courier_Prime } from 'next/font/google';

const courierPrime = Courier_Prime({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-courier-prime',
  weight: ['400']
});

export default function Home() {
  const [editorText, setEditorText] = useState("");
  const [renderedText, setRenderedText] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleEditorChange = (event) => {
    const newValue = event.target.value;
    setEditorText(newValue); // Update the state
    handleRender(newValue);  // Call the function with the latest value
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
      console.error("Error rendering markdown:", error);
    }
  };

  const saveMarkdown = (event) => { };

  const loadMarkdown = (event) => { };

  const clearMarkdown = (event) => {
    setEditorText("");
  };

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
            onClick={clearMarkdown}
          >Clear Markdown</button>
        </div>
      </div>
    </div>
  );
}
