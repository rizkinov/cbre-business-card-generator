import type { Metadata } from "next";
import "./globals.css";
import { financierDisplay, calibre } from "./fonts";

export const metadata: Metadata = {
  title: "CBRE Business Card Generator",
  description: "Professional business card generator for CBRE employees - create print-ready CMYK PDFs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${financierDisplay.variable} ${calibre.variable} antialiased`}
      >
        {children}
        <div id="dropdown-portal-container" style={{ position: 'fixed', zIndex: 9999 }}></div>
      </body>
    </html>
  );
}
