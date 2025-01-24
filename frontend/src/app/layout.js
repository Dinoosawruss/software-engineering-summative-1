import "prismjs/themes/prism.css";
import "./globals.css";
import Link from "next/link";


export const metadata = {
  title: "GoodMark",
  description: "A better way to write Markdown",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
