import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Candidate Screening Dashboard",
  description: "AI-assisted candidate screening dashboard for HR teams"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
