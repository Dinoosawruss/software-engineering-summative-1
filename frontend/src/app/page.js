'use client';

import axios from 'axios';
import React, { useState } from 'react';

export default function Home() {
  const [editorText, setEditorText] = useState('');
  const [renderedText, setRenderedText] = useState('');

  const handleEditorChange = (event) => {
    setEditorText(event.target.value);
    handleRender();
  };

  const handleRender = async () => {
    try {
      const response = await axios.post('http://localhost:5000/render', {
        markdown: editorText,
      });
      console.log(response.data); // Log the API response
      setRenderedText(response.data.html); // Set the raw HTML
    } catch (error) {
      console.error('Error rendering markdown:', error);
    }
  };

  return (
    <div>
      <h1><strong><u>GoodMark</u></strong></h1>
      <textarea
        className="textzone"
        value={editorText}
        onChange={handleEditorChange}
        rows="10"
        cols="50"
        placeholder="Enter markdown here"
        data-testid="markdown-editor"
      />
      <div data-testid="markdown-preview" className="textzone" dangerouslySetInnerHTML={{ __html: renderedText }}/>
    </div>
  );
}
