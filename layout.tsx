import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClaudeGPT — Think together",
  description: "A collaborative AI workspace concept where two AI perspectives work toward one clearer answer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}