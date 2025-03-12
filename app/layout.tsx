import type { Metadata } from "next";
import { Questrial } from "next/font/google";
import "./globals.css";

const questrial = Questrial({
  weight: "400",
  variable: "--font-questrial",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Claire - AI Voice Receptionist Demo | AiroDental",
  description: "Compare Elevenlabs and Cartesia voice models for our intelligent dental AI receptionist",
  keywords: "dental AI, voice assistant, AI receptionist, dental practice technology, appointment scheduling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${questrial.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}