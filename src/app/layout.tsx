import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ErrorBoundary from "@/components/ErrorBoundary";
import ConditionalConvexProvider from "@/components/ConditionalConvexProvider";

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
          <ClerkProvider 
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
            afterSignInUrl="/community"
            afterSignUpUrl="/onboarding"
            appearance={{
              elements: {
                footer: { display: "none !important" },
                footerText: { display: "none !important" },
                footerPages: { display: "none !important" },
                footerPagesLink: { display: "none !important" },
                poweredBy: { display: "none !important" },
                clerkBranding: { display: "none !important" },
              }
            }}
            localization={{
              signUp: {
                start: {
                  title: "Word lid van Automatiseren kun je leren",
                  subtitle: "Sluit je aan bij onze community en leer samen automatiseren",
                  actionText: "Heb je al een account?",
                  actionLink: "Inloggen",
                },
              },
              signIn: {
                start: {
                  title: "Welkom terug bij Automatiseren kun je leren",
                  subtitle: "Log in om door te gaan naar de community",
                  actionText: "Nog geen account?",
                  actionLink: "Registreren",
                },
              },
            }}
          >
            <ConditionalConvexProvider>
              {children}
            </ConditionalConvexProvider>
          </ClerkProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
