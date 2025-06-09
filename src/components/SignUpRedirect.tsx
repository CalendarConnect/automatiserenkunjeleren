"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If user just signed up and is loaded, redirect to onboarding
    if (isLoaded && user) {
      console.log("User signed up, redirecting to onboarding...");
      router.push("/onboarding");
    }
  }, [isLoaded, user, router]);

  return null;
} 