"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import UserSync from "./UserSync";

interface ConvexWrapperProps {
  children: ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is required");
}

const convex = new ConvexReactClient(convexUrl);

export default function ConvexWrapper({ children }: ConvexWrapperProps) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ViewModeProvider>
        <UserSync />
        {children}
      </ViewModeProvider>
    </ConvexProviderWithClerk>
  );
} 