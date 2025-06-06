import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import UserSync from "@/components/UserSync";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import AdminViewModeBar from "@/components/AdminViewModeBar";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Keyspace - Automatiseren Kun Je Leren",
  description: "Community platform voor AI-implementatie discussies - Automatiseren kun je leren",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        <ErrorBoundary>
          <ConvexClientProvider>
            <ViewModeProvider>
              <UserSync />
              <AdminViewModeBar />
              {children}
            </ViewModeProvider>
          </ConvexClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
