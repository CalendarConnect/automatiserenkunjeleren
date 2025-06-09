"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function UserSync() {
  const { user, isLoaded } = useUser();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const createOrSyncUser = useMutation(api.users.createOrSyncUser);
  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      // Wait for both Clerk and Convex to be ready
      if (isLoaded && user && isAuthenticated && !isLoading && !hasSynced) {
        try {
          console.log("Syncing user:", user.id);
          console.log("Convex authenticated:", isAuthenticated);
          
          // Add a small delay to ensure auth is fully established
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const result = await createOrSyncUser({
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            naam: user.fullName || user.firstName || "Nieuwe gebruiker",
            avatarUrl: user.imageUrl,
          });
          
          console.log("User sync result:", result);
          setHasSynced(true);
        } catch (err: unknown) {
          console.error("Error syncing user:", err);
          // Retry after a delay if authentication failed
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (errorMessage.includes("auth") || errorMessage.includes("token")) {
            console.log("Auth error detected, retrying in 2 seconds...");
            setTimeout(() => {
              setHasSynced(false);
            }, 2000);
          }
        }
      }
    };

    syncUser();
  }, [isLoaded, user, isAuthenticated, isLoading, createOrSyncUser, hasSynced]);

  return null; // This component doesn't render anything
} 