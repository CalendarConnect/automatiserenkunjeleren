"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";

export const useCurrentUser = () => {
  const { user: clerkUser, isLoaded } = useUser();
  
  // If we have a Clerk user, try to get the Convex user by Clerk ID
  const result = useQuery(
    api.users.getUserByClerkId, 
    clerkUser ? { clerkId: clerkUser.id } : "skip"
  );
  
  return { 
    user: result, 
    isLoading: (result === undefined && !!clerkUser) || !isLoaded, 
    error: null 
  };
};

export const useIsAdmin = () => {
  const { user, isLoading } = useCurrentUser();
  return { isAdmin: user?.role === "admin", isLoading };
};

export const useIsModerator = () => {
  const { user, isLoading } = useCurrentUser();
  return { isModerator: user?.role === "moderator" || user?.role === "admin", isLoading };
}; 