"use client";

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

interface AuthNavProps {
  showCommunityLink?: boolean;
}

export default function AuthNav({ showCommunityLink = true }: AuthNavProps) {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render the same width container to prevent layout shift
  return (
    <div className="flex items-center gap-4 min-w-[200px] justify-end">
      {!mounted || !isLoaded ? (
        // Loading state - same dimensions as actual content
        <>
          <div className="h-9 w-20 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-9 w-24 bg-slate-200 rounded animate-pulse"></div>
        </>
      ) : (
        <>
          <SignedOut>
            <SignInButton>
              <Button variant="outline" size="sm" className="border-slate-300 hover:border-blue-300 text-slate-700 hover:text-blue-700">
                Inloggen
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                Registreren
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            {showCommunityLink && (
              <Link href="/community">
                <Button variant="outline" size="sm" className="border-slate-300 hover:border-blue-300 text-slate-700 hover:text-blue-700">
                  Community
                </Button>
              </Link>
            )}
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 ring-2 ring-blue-100 hover:ring-blue-200 transition-all",
                  userButtonPopoverCard: "bg-white border border-slate-200 shadow-xl rounded-xl",
                  userButtonPopoverActionButton: "text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all",
                  userButtonPopoverActionButtonText: "text-sm font-medium",
                  userButtonPopoverFooter: "border-t border-slate-100 pt-2 mt-2",
                }
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Mijn Profiel"
                  labelIcon={<User className="w-4 h-4" />}
                  href="/profiel"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </>
      )}
    </div>
  );
} 