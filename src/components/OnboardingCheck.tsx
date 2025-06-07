"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useUser } from "@clerk/nextjs";

interface OnboardingCheckProps {
  children: React.ReactNode;
}

export default function OnboardingCheck({ children }: OnboardingCheckProps) {
  const { user: clerkUser, isLoaded } = useUser();
  const { user: convexUser, isLoading: convexLoading } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const [hasChecked, setHasChecked] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Don't check if we're already on the onboarding page
    if (pathname === "/onboarding") {
      setHasChecked(true);
      return;
    }

    // Only check once when both Clerk and Convex are loaded
    if (isLoaded && !convexLoading && clerkUser && convexUser && !hasChecked && !isRedirecting) {
      // Check if user needs onboarding - more strict check
      const needsOnboarding = !convexUser.naam || 
                             !convexUser.functie || 
                             !convexUser.organisatie || 
                             !convexUser.bio ||
                             convexUser.naam.trim() === "" ||
                             convexUser.functie.trim() === "" ||
                             convexUser.organisatie.trim() === "" ||
                             convexUser.bio.trim() === "";
      
      setHasChecked(true);
      
      if (needsOnboarding) {
        setIsRedirecting(true);
        router.push("/onboarding");
      }
    }
  }, [isLoaded, convexLoading, clerkUser, convexUser, hasChecked, isRedirecting, pathname, router]);

  // Show loading while checking
  if (!isLoaded || convexLoading || !hasChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Profiel controleren...</p>
        </div>
      </div>
    );
  }

  // If we're redirecting to onboarding, show loading
  if (isRedirecting) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Doorsturen naar onboarding...</p>
        </div>
      </div>
    );
  }

  // If user has complete profile, render children
  return <>{children}</>;
} 