import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KrishiSetu | DoCA Procurement & Queue Management Portal (SIH 2026)",
  description: "Smart procurement schedule & queue optimization platform for farmers. Smart slot booking, live queue ticker, automated SMS alerts, quality inspection & DBT payment tracking.",
  keywords: ["Department of Consumer Affairs", "DoCA", "KrishiSetu", "Farmer Slot Booking", "Queue Management"],
  authors: [{ name: "KrishiSetu Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
