import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import UserSync from "@/components/UserSync";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import AdminViewModeBar from "@/components/AdminViewModeBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Keyspace - Keyholders Community",
  description: "Open community platform voor AI-implementatie discussies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        <ConvexClientProvider>
          <ViewModeProvider>
            <UserSync />
            <AdminViewModeBar />
            {children}
          </ViewModeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
