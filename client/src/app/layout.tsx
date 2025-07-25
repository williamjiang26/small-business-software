import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "TDC",
  description: "Manage your small business operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
