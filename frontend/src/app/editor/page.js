"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { Courier_Prime } from "next/font/google";
import Prism from "prismjs";
import Image from "next/image";
import "./editor.css";

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-courier-prime",
  weight: ["400"]
});

export default function EditorPage() {
  const [editorText, setEditorText] = useState("");
  const [renderedText, setRenderedText] = useState("");
  const [clearConfirmClass, setClearConfirmClass] = useState("noConfirm");
  const [clearButtonText, setClearText] = useState("Clear Markdown");
  const [activeClear, setActiveClearValue] = useState(false);
  const [clearAria, setClearAria] = useState("Clear the current Markdown content");
  const [fonts, setFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState("\"Courier Prime\" monospace");
  const [currentIcon, setCurrentIcon] = useState("darkMode.svg");
  const [isDarkMode, setIsDarkMode] = useState(true);
  let [hasRunYet, setHasRunYet] = useState(false);

  const fontStyle = selectedFont ? { fontFamily: `${selectedFont}` } : {};

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/fonts`);
        setFonts(response.data);
      } catch (error) {
        console.error("Error fetching fonts:", error);
      }
    };
    fetchFonts();
  }, [backendUrl]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("data-theme");
    console.log(savedTheme);
    if (savedTheme) {
      console.log(savedTheme);
      setIsDarkMode(savedTheme === "dark");
    } else {
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDarkMode);
      localStorage.setItem("data-theme", prefersDarkMode ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      setCurrentIcon("darkMode.svg");
      root.setAttribute("data-theme", "dark");
    } else {
      setCurrentIcon("lightMode.svg");
      root.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);


  const handleEditorChange = (newValue) => {
    localStorage.setItem("markdown", newValue); // Save Markdown first in case of issues
    setEditorText(newValue); // Update the state
    handleRender(newValue);  // Call the function with the latest value
    resetClearMarkdown(); // Reset the clear confirmation back to false
  };

  useEffect(() => {
    if (localStorage.hasOwnProperty("markdown")) {
      handleEditorChange(localStorage.getItem("markdown"));
    } else {
      handleEditorChange(sampleMarkdown);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRender = async (markdown) => {
    if (!markdown) {
      setRenderedText();
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/render`, {
        markdown,
      });

      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data.html, "text/html");

      try {
        doc.querySelectorAll("code").forEach((block) => {
          const languageClass = block.className.match(/language-(\w+)/);
          let language = languageClass ? languageClass[1] : NaN;
          const highlightedCode = Prism.highlight(
            block.textContent,
            Prism.languages[language],
            language
          );
          block.innerHTML = highlightedCode;
        });
      } catch (err) {
        setRenderedText(response.data.html);
      }

      setRenderedText(doc.body.innerHTML);
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
      setClearConfirmClass("confirm");
      setClearText("Confirm Clear?");
      setClearAria("Confirm that the Markdown content should be cleared");

      return;
    }

    setClearConfirmClass("noConfirm");
    setClearText("Clear Markdown");
    setClearAria("Clear the current Markdown content");
  };

  const clearMarkdown = () => {
    if (activeClear) {
      handleEditorChange("");

      setActiveClear(false);
      return;
    }

    setActiveClear(true)
  }

  const resetClearMarkdown = () => {
    setActiveClear(false);
  }

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      toggleTheme();
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      // Prevent default action for Ctrl/Cmd + S and Ctrl/Cmd + O
      if (event.ctrlKey || event.metaKey) {
        if (event.key === "s") {``
          event.preventDefault();
          saveMarkdown();
        } else if (event.key === "o") {
          event.preventDefault();
          loadMarkdown();
        }
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  });

  useEffect(() => {
    const savedFont = localStorage.getItem("selected-font");
    if (savedFont) {
      setSelectedFont(savedFont);
    }
  }, []);

  const handleFontChange = (event) => {
    const newFont = event.target.value;
    setSelectedFont(newFont);
    localStorage.setItem("selected-font", newFont);
  };

  return (
    <div className="main">
      <h1 className="goodmark">
        <Image
          src={currentIcon}
          alt="Icon showing the current dark/light mode setting"
          width="32"
          height="32"
          onClick={toggleTheme}
          aria-label="Toggle the theme between dark and light mode"
          aria-controls="Press [Enter] or [Space] to toggle"
          tabIndex="0"
          onKeyDown={handleKeyPress}
          data-testid="theme-toggle"
        />
        <strong><u>GoodMark</u></strong>
      </h1>
      <div className="container">
        <textarea
          className="textzone"
          value={editorText}
          onChange={(event) => {handleEditorChange(event.target.value)}}
          rows="10"
          cols="50"
          style={fontStyle}
          placeholder="Enter markdown here"
          data-testid="markdown-editor"
          aria-label="Area to edit Markdown input"
        />
        <div className="preview textzone"
          style={fontStyle} data-testid="markdown-preview"
          dangerouslySetInnerHTML={{ __html: renderedText }}
          aria-live="polite"
          aria-atomic="true"
        />
        <div className="buttonContainer">
          <div className="mainButtons">
            <select
              id="fontSelector"
              data-testid="font-selector"
              onChange={(event) => {
                console.log(event.target.value);
                handleFontChange(event);
                console.log(selectedFont)
              }}
              value={selectedFont}
              style={fontStyle}
              aria-label="Select a font"
            >
              {fonts.map((font) => (
                <option
                  data-testid="font-selector-option"
                  key={font.value}
                  value={font.value}
                  aria-label={`Select ${font.name} font`}
                >
                  {font.name}
                </option>
              ))}
            </select>
            <button
              onClick={saveMarkdown}
              aria-label="Save te current Markdown to a file"
            >Save Markdown</button>
            <button
              onClick={loadMarkdown}
              aria-label="Load a Markdown file from your file system"
            >Load Markdown</button>
          </div>
          <button
            className={`${clearConfirmClass} clearButton`}
            onClick={clearMarkdown}
            aria-label={clearAria}
          >{clearButtonText}</button>
        </div>
      </div>
    </div>
  );
}

const sampleMarkdown =
`# Welcome to GoodMark Editor!

This is a Markdown editor where you can edit and preview your content.

## Features

- **Real-time preview**
- **Customizable fonts**
- **Dark/Light mode toggle**

### Markdown allows you to:

1. **Create headings**: # for large headers, ## for medium headers, and ### for smaller ones.
2. **Style text**: You can make text **bold**, *italic*, or even monospace for code (\`\`\`).
3. **Write Code blocks**: Using \`\`\`, you can also specify a language on the first line for syntax highlighting. 

    \`\`\`javascript
    // Example of JavaScript code
    function greet() {
      console.log("Hello, World!");
    }
    \`\`\`

4. **Add Links**: Such as [this one](https://google.com/) to Google

5. **Add Images**:

     ![Markdown Logo](https://cdn.commonmark.org/uploads/default/optimized/2X/3/366f3614de6996d79a131fdf9b41ed7d65cfe181_2_1024x630.png)

---

> GoodMark makes writing Markdown quick and easy
`