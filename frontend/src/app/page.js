'use client';

import React from 'react';

export default function Home() {
  return (
    <div>
      <h1><strong><u>GoodMark</u></strong></h1>
      <textarea
        className="textzone"
        rows="10"
        cols="50"
        placeholder="Enter markdown here"
        data-testid="markdown-editor"
      />
      <div data-testid="markdown-preview" className="textzone"/>
    </div>
  );
}
