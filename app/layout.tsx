import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "layoutd — Account migrations you can prove safe",
  description:
    "layoutd reads two versions of your Anchor account struct, diffs the byte layout, generates the safe migration, and blocks unsafe upgrades in CI. Security oracle for Solana programs.",
  keywords: [
    "Solana",
    "Anchor",
    "smart contract",
    "account migration",
    "CLI",
    "Rust",
    "blockchain",
    "security",
  ],
  openGraph: {
    title: "layoutd — Account migrations you can prove safe",
    description:
      "A Rust CLI that diffs Anchor account layouts, generates migration code, and blocks unsafe upgrades in CI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
