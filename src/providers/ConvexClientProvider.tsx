"use client";

import { ReactNode, useState, useEffect } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ViewModeProvider } from "@/contexts/ViewModeContext";

interface ConvexClientProviderProps {
  children: ReactNode;
}

// Loading wrapper to prevent layout shifts
function LoadingWrapper({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Small delay to prevent layout shift during auth initialization
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isClient || !showContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Skeleton that matches the homepage structure */}
        <div className="animate-pulse">
          {/* Navigation skeleton */}
          <nav className="px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                <div className="w-64 h-6 bg-slate-200 rounded"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-9 w-20 bg-slate-200 rounded"></div>
                <div className="h-9 w-24 bg-slate-200 rounded"></div>
              </div>
            </div>
          </nav>
          
          {/* Hero content skeleton */}
          <div className="px-6 pt-20 pb-32">
            <div className="max-w-7xl mx-auto text-center">
              <div className="w-80 h-8 bg-slate-200 rounded mx-auto mb-8"></div>
              <div className="w-full max-w-4xl h-20 bg-slate-200 rounded mx-auto mb-8"></div>
              <div className="w-full max-w-3xl h-16 bg-slate-200 rounded mx-auto mb-8"></div>
              <div className="w-full max-w-5xl h-12 bg-slate-200 rounded mx-auto mb-12"></div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <div className="w-80 h-14 bg-slate-200 rounded-2xl"></div>
                <div className="w-64 h-14 bg-slate-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Environment variable validation with runtime safety
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is required");
}

if (!clerkPublishableKey) {
  throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable is required");
}

const convex = new ConvexReactClient(convexUrl);

// Custom Clerk appearance to match "Automatiseren Kun Je Leren" branding
const clerkAppearance = {
  layout: {
    socialButtonsVariant: "blockButton" as const,
    socialButtonsPlacement: "top" as const,
    showOptionalFields: true,
  },
  variables: {
    // Color scheme matching the homepage
    colorPrimary: "#2563eb", // Blue-600
    colorBackground: "#ffffff",
    colorInputBackground: "#f8fafc", // Slate-50
    colorInputText: "#1e293b", // Slate-800
    colorText: "#1e293b", // Slate-800
    colorTextSecondary: "#64748b", // Slate-500
    colorTextOnPrimaryBackground: "#ffffff",
    colorDanger: "#dc2626", // Red-600
    colorSuccess: "#16a34a", // Green-600
    colorWarning: "#d97706", // Amber-600
    colorNeutral: "#64748b", // Slate-500
    
    // Typography matching Inter font
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    // Border radius matching the design system
    borderRadius: "0.75rem", // 12px, matching --radius
    
    // Spacing
    spacingUnit: "1rem",
  },
  elements: {
    // Root card styling - remove blue background
    rootBox: {
      background: "transparent",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
    },
    card: {
      background: "#ffffff",
      borderRadius: "1.5rem",
      border: "1px solid #e2e8f0",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)",
      padding: "2.5rem",
      maxWidth: "28rem",
      width: "100%",
    },
    
    // Header styling with custom branding
    headerTitle: {
      fontSize: "1.875rem",
      fontWeight: "700",
      background: "linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #4338ca 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
      marginBottom: "0.5rem",
      textAlign: "center",
    },
    headerSubtitle: {
      color: "#64748b",
      fontSize: "1rem",
      textAlign: "center",
      marginBottom: "2rem",
    },
    
    // Custom logo/branding area
    logoBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "1.5rem",
    },
    logoImage: {
      width: "3rem",
      height: "3rem",
      borderRadius: "0.75rem",
      background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    },
    
    // Form elements
    formFieldInput: {
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "0.75rem",
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      transition: "all 0.2s ease",
      "&:focus": {
        borderColor: "#2563eb",
        boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
        outline: "none",
        backgroundColor: "#ffffff",
      },
      "&:hover": {
        borderColor: "#cbd5e1",
      },
    },
    formFieldLabel: {
      color: "#374151",
      fontSize: "0.875rem",
      fontWeight: "500",
      marginBottom: "0.5rem",
    },
    
    // Primary button (matching homepage CTA buttons)
    formButtonPrimary: {
      background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
      borderRadius: "1rem",
      padding: "0.875rem 1.5rem",
      fontSize: "1rem",
      fontWeight: "600",
      border: "none",
      boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.2), 0 4px 6px -2px rgba(37, 99, 235, 0.1)",
      transition: "all 0.2s ease",
      "&:hover": {
        background: "linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)",
        transform: "translateY(-1px)",
        boxShadow: "0 20px 25px -5px rgba(37, 99, 235, 0.3), 0 10px 10px -5px rgba(37, 99, 235, 0.1)",
      },
      "&:active": {
        transform: "translateY(0)",
      },
      "&:disabled": {
        background: "#94a3b8",
        transform: "none",
        boxShadow: "none",
        cursor: "not-allowed",
      },
    },
    
    // Social buttons
    socialButtonsBlockButton: {
      border: "1px solid #e2e8f0",
      borderRadius: "0.75rem",
      padding: "0.75rem 1rem",
      fontSize: "0.875rem",
      fontWeight: "500",
      transition: "all 0.2s ease",
      backgroundColor: "#ffffff",
      "&:hover": {
        borderColor: "#cbd5e1",
        backgroundColor: "#f8fafc",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
      },
    },
    
    // Links
    footerActionLink: {
      color: "#2563eb",
      textDecoration: "none",
      fontWeight: "500",
      "&:hover": {
        color: "#1d4ed8",
        textDecoration: "underline",
      },
    },
    
    // Divider
    dividerLine: {
      backgroundColor: "#e2e8f0",
      height: "1px",
      margin: "1.5rem 0",
    },
    dividerText: {
      color: "#64748b",
      fontSize: "0.875rem",
      backgroundColor: "#ffffff",
      padding: "0 1rem",
      fontWeight: "500",
    },
    
    // Error messages
    formFieldErrorText: {
      color: "#dc2626",
      fontSize: "0.875rem",
      marginTop: "0.25rem",
      fontWeight: "500",
    },
    
    // Success messages
    formFieldSuccessText: {
      color: "#16a34a",
      fontSize: "0.875rem",
      marginTop: "0.25rem",
      fontWeight: "500",
    },
    
    // Loading spinner
    spinner: {
      color: "#2563eb",
    },
    
    // Footer - hide Clerk branding completely
    footer: {
      display: "none !important",
    },
    footerText: {
      display: "none !important",
    },
    
    // Hide Clerk branding elements
    footerPages: {
      display: "none !important",
    },
    footerPagesLink: {
      display: "none !important",
    },
    
    // Hide development mode banner
    "__internal_clerk_branding": {
      display: "none !important",
    },
    
    // Hide any powered by text
    poweredBy: {
      display: "none !important",
    },
    
    // Hide clerk badge/branding
    clerkBranding: {
      display: "none !important",
    },
    
    // Alert/notification styling
    alert: {
      borderRadius: "0.75rem",
      padding: "1rem",
      marginBottom: "1rem",
      border: "1px solid #e2e8f0",
    },
    alertText: {
      fontSize: "0.875rem",
      fontWeight: "500",
    },
    
    // Form field wrapper
    formField: {
      marginBottom: "1.5rem",
    },
    
    // Checkbox styling
    formFieldInputCheckbox: {
      accentColor: "#2563eb",
      transform: "scale(1.1)",
    },
    
    // Additional branding elements
    identityPreview: {
      borderRadius: "0.75rem",
      border: "1px solid #e2e8f0",
      padding: "1rem",
      backgroundColor: "#f8fafc",
    },
    
    // Modal styling for additional screens
    modalContent: {
      borderRadius: "1.5rem",
      border: "1px solid #e2e8f0",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
  },
};

export default function ConvexClientProvider({
  children,
}: ConvexClientProviderProps) {
  return (
    <ClerkProvider 
      publishableKey={clerkPublishableKey}
      appearance={clerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/community"
      afterSignUpUrl="/onboarding"
      redirectUrl="/onboarding"
      signInFallbackRedirectUrl="/community"
      signUpFallbackRedirectUrl="/onboarding"
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
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ViewModeProvider>
          <LoadingWrapper>
            {children}
          </LoadingWrapper>
        </ViewModeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
} 