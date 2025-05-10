import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header"; // Component names should start with uppercase
import Footer from "@/components/layout/footer"; // Component names should start with uppercase
import { ThemeProvider } from "@/components/layout/theme-provider";
import {
  ClerkProvider,
} from '@clerk/nextjs';
import { icons } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pin IT",
  description: "student adapative learning platform",
  icons: {
    icon: "/image.png",
    
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <body>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
