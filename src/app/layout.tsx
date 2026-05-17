import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import LoadingLink from "../components/LoadingLink";
import Footer from "../components/Footer";

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
        className={`${nunito.className} min-h-90 flex flex-col bg-stone-50 `}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
