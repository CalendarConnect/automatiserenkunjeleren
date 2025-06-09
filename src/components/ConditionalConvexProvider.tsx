"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import ConvexWrapper from "./ConvexWrapper";

interface ConditionalConvexProviderProps {
  children: ReactNode;
}

export default function ConditionalConvexProvider({ children }: ConditionalConvexProviderProps) {
  const pathname = usePathname();
  
  // Pages that DON'T need Convex (homepage, auth pages)
  const pagesWithoutConvex = ['/', '/sign-in', '/sign-up'];
  
  // Check if current page needs Convex
  const needsConvex = !pagesWithoutConvex.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  if (needsConvex) {
    return (
      <ConvexWrapper>
        {children}
      </ConvexWrapper>
    );
  }
  
  // For homepage and auth pages, just return children without Convex
  return <>{children}</>;
} 