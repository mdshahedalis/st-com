import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ST Comp Holdings Sdn Bhd",
  description: "Manage specialists, appointments, and other administrative tasks for ST Comp Holdings Sdn Bhd.",
  icons: {
    icon: "https://images.squarespace-cdn.com/content/v1/67943d2b5b33580f701fcae6/d358d0fa-5c65-40d9-9451-bf34e291c288/favicon.ico?format=100w",
  },  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

      </body>
    </html>
  );
}
