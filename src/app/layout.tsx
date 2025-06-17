import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { DonationProvider } from "@/context/DonationContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Donation System",
  description: "Manage donations efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DonationProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-900">
            {children}
          </main>
          <Toaster position="top-right" />
        </DonationProvider>
      </body>
    </html>
  );
}
