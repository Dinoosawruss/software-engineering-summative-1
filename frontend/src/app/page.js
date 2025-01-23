"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { Courier_Prime } from "next/font/google";
import Prism from "prismjs";
import Image from "next/image";

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-courier-prime",
  weight: ["400"]
});

export default function Home() {
  const [editorText, setEditorText] = useState("");
  const [renderedText, setRenderedText] = useState("");
  const [clearConfirmClass, setClearConfirmClass] = useState("noConfirm");
  const [clearButtonText, setClearText] = useState("Clear Markdown");
  const [activeClear, setActiveClearValue] = useState(false);
  const [fonts, setFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState("\"Courier Prime\" monospace");
  const [currentIcon, setCurrentIcon] = useState("darkMode.svg");
  const [isDarkMode, setIsDarkMode] = useState(true);

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
    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      setCurrentIcon("darkMode.svg");
      root.setAttribute('data-theme', 'dark');
    } else {
      setCurrentIcon("lightMode.svg");
      root.setAttribute('data-theme', 'light');
    }

    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);


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

      return;
    }

    setClearConfirmClass("noConfirm");
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

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="main">
      <h1 className="goodmark">
        <Image
          src={currentIcon}
          alt="Icon showing the current dark/light mode setting"
          width="32"
          height="32"
          onClick={toggleTheme} />
        <strong><u>GoodMark</u></strong>
      </h1>
      <div className="container">
        <textarea
          className="textzone"
          value={editorText}
          onChange={handleEditorChange}
          rows="10"
          cols="50"
          style={fontStyle}
          placeholder="Enter markdown here"
          data-testid="markdown-editor"
        />
        <div className="preview textzone" style={fontStyle} data-testid="markdown-preview" dangerouslySetInnerHTML={{ __html: renderedText }} />
        <div className="buttonContainer">
          <div className="mainButtons">
            <select
              id="fontSelector"
              data-testid="font-selector"
              onChange={(e) => {
                console.log(e.target.value);
                setSelectedFont(e.target.value);
                console.log(selectedFont)
              }}
              value={selectedFont}
              style={fontStyle}
            >
              {fonts.map((font) => (
                <option data-testid="font-selector-option" key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>
            <button
              onClick={saveMarkdown}
            >Save Markdown</button>
            <button
              onClick={loadMarkdown}
            >Load Markdown</button>
          </div>
          <button
            className={clearConfirmClass}
            onClick={clearMarkdown}
          >{clearButtonText}</button>
        </div>
      </div>
    </div>
  );
}
