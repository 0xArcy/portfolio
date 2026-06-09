import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "arcy.terminal",
  description:
    "[ PAYLOAD INJECTED ] 0xDEADBEEF :: kernel32.dll → ACCESS_VIOLATION ░▒█ root@arcypwn:~# rm -rf / --no-preserve-root █▒░ CVE-2024-???? :: RCE via heap overflow · arcypwn — developer & security researcher",
  authors: [{ name: "arcypwn" }],
  creator: "arcypwn",
  metadataBase: new URL("https://arcypwn.dev"),
  openGraph: {
    title: "arcy.terminal",
    description: "[ SYSTEM COMPROMISED ] — arcypwn · security researcher · CTF player",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
