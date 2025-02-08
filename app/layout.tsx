"use client";  // Ensure this is a client component

import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner"; // Import Sonner
import "./globals.css";
import { metadata } from "./metadata"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <Toaster position="top-right" richColors /> {/* Add Toaster here */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
