"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function UserSync() {
  const { user, isLoaded } = useUser();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const createOrSyncUser = useMutation(api.users.createOrSyncUser);
  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const syncUser = async () => {
      // Wait for both Clerk and Convex to be ready
      // Only sync if we haven't synced this specific user yet
      if (isLoaded && user && isAuthenticated && !isLoading && syncedUserId !== user.id) {
        try {
          console.log("🔄 UserSync: Starting sync for user:", user.id);
          console.log("🔄 UserSync: Convex authenticated:", isAuthenticated);
          console.log("🔄 UserSync: Retry count:", retryCount);
          console.log("🔄 UserSync: User data:", {
            fullName: user.fullName,
            firstName: user.firstName,
            email: user.emailAddresses[0]?.emailAddress,
            imageUrl: user.imageUrl
          });
          
          // Add a delay to ensure auth is fully established
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const result = await createOrSyncUser({
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            naam: user.fullName || user.firstName || user.lastName || "Nieuwe gebruiker",
            avatarUrl: user.imageUrl || "",
          });
          
          console.log("✅ UserSync: Success! User synced:", result);
          setSyncedUserId(user.id);
          setRetryCount(0); // Reset retry count on success
        } catch (err: unknown) {
          console.error("❌ UserSync: Error syncing user:", err);
          const errorMessage = err instanceof Error ? err.message : String(err);
          
          // Retry up to 5 times with increasing delays (more attempts for LinkedIn OAuth)
          if (retryCount < 5) {
            const delay = (retryCount + 1) * 2000; // 2s, 4s, 6s, 8s, 10s
            console.log(`🔄 UserSync: Retrying in ${delay/1000} seconds... (attempt ${retryCount + 1}/5)`);
            console.log(`🔄 UserSync: Error was: ${errorMessage}`);
            
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              // Don't reset syncedUserId to trigger retry
            }, delay);
          } else {
            console.error("❌ UserSync: Max retries reached, user sync failed permanently");
            // Mark as attempted to prevent infinite loops
            setSyncedUserId(user.id);
          }
        }
      }
    };

    syncUser();
  }, [isLoaded, user, isAuthenticated, isLoading, createOrSyncUser, syncedUserId, retryCount]);

  // Reset sync state when user changes
  useEffect(() => {
    if (user?.id && syncedUserId !== user.id) {
      console.log("🔄 UserSync: New user detected, resetting sync state");
      setSyncedUserId(null);
      setRetryCount(0);
    }
  }, [user?.id, syncedUserId]);

  return null; // This component doesn't render anything
} 