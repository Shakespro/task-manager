import type { Metadata } from "next";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
import { Toaster } from "react-hot-toast";
import UserProvider from "@/providers/UserProvider";
import { Inter } from "next/font/google";
import MiniSidebar from "./Components/MiniSidebar/MiniSidebar";
import Header from "./Components/Header/Header";
import MainContentLayout from "@/providers/MainContentLayout";
import SidebarProvider from "@/providers/SidebarProvider";
import MainLayout from "@/providers/MainLayout";
import CookieBanner from "./Components/CookieBanner/CookieBanner"; // Import CookieBanner
import GTMInitialiser from "@/providers/GTMInitialiser";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GTMInitialiser />
      </head>
      <body className={inter.className}>
        <UserProvider>
          <Toaster position="top-center" />
          
          {/* Include the CookieBanner component */}
          <CookieBanner />

          <div className="h-full flex overflow-hidden">
            <MiniSidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <MainContentLayout>
                <MainLayout>{children}</MainLayout>
                <SidebarProvider />
              </MainContentLayout>
            </div>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
