"use client"

import "./index.css";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import React, { useEffect } from "react";

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'dark');
  });

  const handleClick = () => {
    console.log("h")
    router.push('/editor');
  }

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
    if (hasVisitedBefore) {
      router.push("/editor");
    } else {
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, [router]);

  return (
    <div>
      <Image
        src={"darkMode.svg"}
        alt="Icon showing the current dark/light mode setting"
        width="32"
        height="32"
        aria-label="Toggle the theme between dark and light mode"
        aria-controls="Press [Enter] or [Space] to toggle"
        tabIndex="0"
      />
      <h1 className="goodmark">
        <strong><u>GoodMark</u></strong>
      </h1>
      <p>A lightweight, web-based Markdown editor</p>
      <button onClick={handleClick}>Start Editing</button>
    </div>
  );
};