"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import ToolCard from "./ToolCard";
import ToolPostForm from "./ToolPostForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, TrendingUp, Grid3X3 } from "lucide-react";

interface ToolbibliotheekKanaalProps {
  kanaalId: Id<"channels">;
  kanaalSlug: string;
  currentUserId?: Id<"users">;
}

export default function ToolbibliotheekKanaal({ 
  kanaalId, 
  kanaalSlug, 
  currentUserId 
}: ToolbibliotheekKanaalProps) {
  const [sortBy, setSortBy] = useState<"upvotes" | "recent">("upvotes");
  
  // Haal alle threads op voor dit kanaal met auteur informatie
  const threadsWithAuthors = useQuery(api.threads.getThreadsByChannel, { 
    kanaalId 
  });

  const upvoteThread = useMutation(api.threads.upvoteThread);

  const handleUpvote = async (threadId: Id<"threads">) => {
    if (!currentUserId) return;
    
    try {
      await upvoteThread({
        threadId,
        userId: currentUserId,
      });
    } catch (error) {
      console.error("Error upvoting thread:", error);
    }
  };

  if (!threadsWithAuthors) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Filter out sticky posts en sorteer
  const regularThreads = threadsWithAuthors.filter((thread: any) => !thread.sticky);
  
  const sortedThreads = [...regularThreads].sort((a: any, b: any) => {
    if (sortBy === "upvotes") {
      // Sorteer op aantal upvotes (meest eerst), dan op datum
      const upvoteDiff = b.upvotes.length - a.upvotes.length;
      if (upvoteDiff !== 0) return upvoteDiff;
      return b.aangemaaktOp - a.aangemaaktOp;
    } else {
      // Sorteer op datum (nieuwste eerst)
      return b.aangemaaktOp - a.aangemaaktOp;
    }
  });

  return (
    <div className="space-y-6">
      {/* Nieuwe tool toevoegen (alleen voor ingelogde gebruikers) */}
      {currentUserId && (
        <div className="mb-8">
          <ToolPostForm
            kanaalId={kanaalId}
            currentUserId={currentUserId}
            onSuccess={() => {
              // Refresh wordt automatisch gedaan door Convex
            }}
          />
        </div>
      )}

      {/* Sorteer opties en grid info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-700">Sorteer op:</span>
          <div className="flex space-x-1">
            <Button
              variant={sortBy === "upvotes" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("upvotes")}
              className="flex items-center space-x-1"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Meest geupvote</span>
            </Button>
            <Button
              variant={sortBy === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("recent")}
              className="flex items-center space-x-1"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>Nieuwste</span>
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 text-sm text-slate-500">
          <div className="flex items-center space-x-1">
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden sm:inline">Grid weergave</span>
          </div>
          <span>{sortedThreads.length} tool{sortedThreads.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Tool posts in grid layout */}
      <div>
        {sortedThreads.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              Nog geen tools gedeeld
            </h3>
            <p className="text-slate-500 mb-6">
              Wees de eerste om een nuttige tool te delen in dit kanaal!
            </p>
            {currentUserId && (
              <div className="max-w-md mx-auto">
                <ToolPostForm
                  kanaalId={kanaalId}
                  currentUserId={currentUserId}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedThreads.map((thread: any) => (
              <ToolCard
                key={thread._id}
                thread={thread}
                author={thread.author}
                currentUserId={currentUserId}
                onUpvote={handleUpvote}
                channelSlug={kanaalSlug}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 