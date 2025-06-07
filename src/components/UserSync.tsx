"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function UserSync() {
  const { user, isLoaded } = useUser();
  const createOrSyncUser = useMutation(api.users.createOrSyncUser);

  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && user) {
        try {
          console.log("Syncing user:", user.id);
          const result = await createOrSyncUser({
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            naam: user.fullName || user.firstName || "Nieuwe gebruiker",
            avatarUrl: user.imageUrl,
          });
          console.log("User sync result:", result);
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }
    };

    syncUser();
  }, [isLoaded, user, createOrSyncUser]);

  return null; // This component doesn't render anything
} 