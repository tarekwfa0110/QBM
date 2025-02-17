import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QBM - Question Bank Manager",
  description: "Generate and manage questions from PDF documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <QueryProvider>
          <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="text-white hover:text-gray-300">Home</Link>
              </li>
            <li>
                <Link href="/questions" className="text-white hover:text-gray-300">Questions</Link>
              </li>
            </ul>
          </nav>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}