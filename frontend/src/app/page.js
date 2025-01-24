"use client"

import "./index.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function IndexPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentIcon, setCurrentIcon] = useState("darkMode.svg");

  useEffect(() => {
    const savedTheme = localStorage.getItem("data-theme");
    if (savedTheme) {
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

    localStorage.setItem("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleClick = () => {
    console.log("h")
    router.push("/editor");
  }

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
    if (hasVisitedBefore) {
      router.push("/editor");
    } else {
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, [router]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="welcomeContainer">
      <Image
        src={currentIcon}
        alt="Icon showing the current dark/light mode setting"
        width="32"
        height="32"
        aria-label="Toggle the theme between dark and light mode"
        aria-controls="Press [Enter] or [Space] to toggle"
        tabIndex="0"
        onClick={toggleTheme}
        data-testid="theme-toggle"
        className="darkModeIcon"
      />
      <h1 className="goodmarkWelcome">
        <strong><u>GoodMark</u></strong>
      </h1>
      <p className="text">A lightweight, web-based Markdown editor</p>
      <button onClick={handleClick} className="startButton">Start Editing</button>
    </div>
  );
};