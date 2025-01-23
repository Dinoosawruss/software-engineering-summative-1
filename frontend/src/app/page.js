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
      const response = await axios.post("http://localhost:5000/render", {
        markdown,
      });
      setRenderedText(response.data.html); // Set the raw HTML
    } catch (error) {
      console.error("Error rendering markdown:", error);
    }
  };

  return (
    <div>
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
      </div>
    </div>
  );
}
