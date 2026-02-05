import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import HeaderWrapper from "@/components/header-wrapper";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Ichibot Store - Official",
  description: "Mirroring WooCommerce with speed and style in Light Theme.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={rubik.className}>
      <body>
        <Suspense fallback={null}>
          <HeaderWrapper />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
