"use client";

import KanaalSidebar from "@/components/KanaalSidebar";
import ThreadView from "@/components/ThreadView";
import TopNavigation from "@/components/TopNavigation";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function KanaalThreadPage() {
  const { user: currentUser } = useCurrentUser();
  const params = useParams();
  const channelSlug = params.slug as string;
  const threadNumber = parseInt(params.number as string);
  
  // Get thread by channel and thread number
  const thread = useQuery(api.threads.getThreadByChannelAndNumber, { 
    channelSlug: channelSlug,
    threadNumber: threadNumber 
  });

  if (!thread) {
    return (
      <div className="flex flex-col h-screen">
        <TopNavigation />
        <div className="flex flex-1 overflow-hidden">
          <KanaalSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Thread laden...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <TopNavigation />
      <div className="flex flex-1 overflow-hidden">
        <KanaalSidebar />
        
        <div className="flex-1 overflow-auto">
          {/* Breadcrumbs */}
          <div className="bg-background border-b border-border px-6 py-3">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                <Home className="w-4 h-4" />
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link 
                href="/kanalen" 
                className="hover:text-foreground transition-colors"
              >
                Kanalen
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link 
                href={`/kanaal/${channelSlug}`}
                className="hover:text-foreground transition-colors"
              >
                {thread.channel?.naam || channelSlug}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium truncate max-w-xs">
                {thread.titel}
              </span>
            </nav>
          </div>

          <ThreadView 
            threadId={thread._id}
            currentUserId={currentUser?._id}
          />
        </div>
      </div>
    </div>
  );
} 