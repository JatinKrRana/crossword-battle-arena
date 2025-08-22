import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crossword Battle Arena",
  description: "Real-time crossword game vs AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
