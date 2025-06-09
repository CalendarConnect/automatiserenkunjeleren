"use client";

import { Brain, EyeOff } from "lucide-react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useViewMode } from "@/contexts/ViewModeContext";
import { useViewAwareAdmin } from "@/lib/useViewAwareRole";

interface TopNavigationProps {
  showCommunityLink?: boolean;
}

export default function TopNavigation({ showCommunityLink = true }: TopNavigationProps) {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const { isViewingAsMember, setViewingAsMember } = useViewMode();
  const { isActualAdmin } = useViewAwareAdmin();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
      <div className="flex justify-between items-center">
        <Link href="/community" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Automatiseren Kun Je Leren
          </span>
        </Link>
        
        {/* Auth Navigation with ViewMode */}
        <div className="flex items-center gap-4 min-w-[200px] justify-end">
          {!mounted || !isLoaded ? (
            // Loading state
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
                {/* View Mode Toggle - only show for actual admins */}
                {isActualAdmin && isViewingAsMember && (
                  <Button
                    onClick={() => setViewingAsMember(false)}
                    variant="outline"
                    size="sm"
                    className="border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:border-orange-400 flex items-center gap-2"
                    title="Terug naar admin modus"
                  >
                    <EyeOff className="w-4 h-4" />
                    Admin Modus
                  </Button>
                )}
                
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
      </div>
    </nav>
  );
} 