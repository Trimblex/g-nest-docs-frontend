import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "银河云文档",
  description: "新一代智能文档协作平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cn">
      <body className={inter.className}>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
