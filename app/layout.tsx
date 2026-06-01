import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "arcy.terminal",
  description: "arcypwn — developer & security researcher",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
