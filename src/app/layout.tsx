import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AvoLog",
  description: "Track your plant squad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${nunito.className} min-h-full flex flex-col bg-stone-50 `}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
