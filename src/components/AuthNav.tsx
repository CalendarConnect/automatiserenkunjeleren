"use client";

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useViewAwareAdmin } from "@/lib/useViewAwareRole";

interface AuthNavProps {
  showCommunityLink?: boolean;
}

export default function AuthNav({ showCommunityLink = true }: AuthNavProps) {
  const { user } = useCurrentUser();
  const { isAdmin } = useViewAwareAdmin();

  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <SignInButton>
          <Button variant="outline" size="sm">
            Inloggen
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button size="sm">
            Registreren
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        {showCommunityLink && (
          <Link href="/community">
            <Button variant="outline" size="sm">
              Community
            </Button>
          </Link>
        )}
        {isAdmin && (
          <Link href="/beheer">
            <Button variant="outline" size="sm">
              Beheer
            </Button>
          </Link>
        )}
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8"
            }
          }}
        />
      </SignedIn>
    </div>
  );
} 