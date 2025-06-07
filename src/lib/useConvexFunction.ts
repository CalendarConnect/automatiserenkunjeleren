"use client";

import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { FunctionReference } from "convex/server";

// Custom hook to safely use Convex functions
export function useConvexQuery(functionName: string, args?: any) {
  return useQuery(functionName as any, args);
}

export function useConvexMutation(functionName: string) {
  return useMutation(functionName as any);
}

// Specific hooks for admin functions
export function useGetAllUsersWithRoles(enabled: boolean = true) {
  // If enabled is true, it means the calling component has verified admin status
  return useQuery(enabled === true ? "users:getAllUsersWithRoles" as any : "skip");
}

export function useUpdateUserRole() {
  return useMutation("users:updateUserRole" as any);
}

export function useDeleteUser() {
  return useMutation("users:deleteUser" as any);
} 