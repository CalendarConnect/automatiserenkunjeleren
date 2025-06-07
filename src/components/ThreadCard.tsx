"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowUp, MessageCircle, Hash, FileText, BookOpen, Clock, User, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { createThreadUrl } from "../../convex/lib/utils";
import PollDisplay from "./PollDisplay";
import HtmlRenderer from "./HtmlRenderer";
import { useViewAwareAdmin } from "@/lib/useViewAwareRole";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Pin, PinOff } from "lucide-react";

interface ThreadCardProps {
  thread: {
    _id: string;
    titel: string;
    slug?: string;
    threadNumber?: number;
    inhoud?: string;
    upvotes: string[];
    sticky: boolean;
    aangemaaktOp: number;
    afbeelding?: string;
    type?: "text" | "poll";
    author?: {
      naam: string;
      avatarUrl?: string;
    };
    kanaal?: {
      naam: string;
      slug: string;
      type: string;
    };
    channel?: {
      naam: string;
      slug: string;
      type: string;
    };
    poll?: {
      vraag: string;
      opties: string[];
      voteCounts: number[];
      totalVotes: number;
    };
    _creationTime: number;
  };
  showChannel?: boolean;
  currentUserId?: string;
  enableUpvoting?: boolean;
}

export default function ThreadCard({ 
  thread, 
  showChannel = false, 
  currentUserId,
  enableUpvoting = false 
}: ThreadCardProps) {
  const { isAdmin } = useViewAwareAdmin();
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const upvoteThread = useMutation(api.threads.upvoteThread);
  const deleteThread = useMutation(api.threads.deleteThread);
  const toggleSticky = useMutation(api.threads.toggleStickyThread);
  
  const hasUpvoted = currentUserId ? thread.upvotes.includes(currentUserId) : false;
  const isVoorstellenChannel = (thread.kanaal?.slug || thread.channel?.slug) === "voorstellen-uitbreiding";
  
  // Generate thread URL
  const threadUrl = thread.slug && thread.threadNumber 
    ? `/thread/${createThreadUrl(thread.slug, thread.threadNumber)}`
    : `/thread/${thread._id}`;
  
  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUserId || !enableUpvoting) return;
    
    try {
      await upvoteThread({
        threadId: thread._id as any,
        userId: currentUserId as any,
      });
    } catch (error) {
      console.error("Error upvoting thread:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUserId || !isAdmin) return;
    
    const confirmed = window.confirm(
      `Weet je zeker dat je de thread "${thread.titel}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`
    );
    
    if (!confirmed) return;
    
    setIsDeleting(true);
    try {
      await deleteThread({
        threadId: thread._id as any,
        userId: currentUserId as any,
      });
      // Thread will be removed from UI automatically via Convex reactivity
    } catch (error) {
      console.error("Error deleting thread:", error);
      alert("Er is een fout opgetreden bij het verwijderen van de thread.");
    } finally {
      setIsDeleting(false);
      setShowAdminMenu(false);
    }
  };

  const handleToggleSticky = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUserId || !isAdmin) return;
    
    try {
      await toggleSticky({
        threadId: thread._id as any,
      });
      setShowAdminMenu(false);
    } catch (error) {
      console.error("Error toggling sticky:", error);
    }
  };
  
  const getChannelIcon = (type?: string) => {
    switch (type) {
      case "discussie":
        return <Hash className="w-3.5 h-3.5" />;
      case "templates":
        return <FileText className="w-3.5 h-3.5" />;
      case "modules":
        return <BookOpen className="w-3.5 h-3.5" />;
      default:
        return <Hash className="w-3.5 h-3.5" />;
    }
  };

  const getChannelColorClass = (slug?: string) => {
    if (!slug) return '';
    
    if (['welkom', 'toegang-krijgen', 'voorstellen'].includes(slug)) {
      return 'category-startpunt';
    }
    if (['vps-installatie', 'open-webui-modellen', 'n8n-automatisering', 'beveiliging-hosting', 'debugging'].includes(slug)) {
      return 'category-infrastructuur';
    }
    if (['marketing-content', 'zorg-welzijn', 'onderwijs-training', 'mkb'].includes(slug)) {
      return 'category-sectoren';
    }
    if (['eigen-beheer-uitbesteden', 'wetgeving-ethiek', 'model-keuzes', 'toekomst-agents'].includes(slug)) {
      return 'category-strategie';
    }
    if (['werkende-voorbeelden', 'n8n-flows', 'dockerfiles-scripts', 'prompt-voorbeelden'].includes(slug)) {
      return 'category-templates';
    }
    if (['feedback-gevraagd', 'vraag-antwoord', 'community-updates', 'voorstellen-uitbreiding'].includes(slug)) {
      return 'category-organisatie';
    }
    
    return '';
  };

  return (
    <div className="thread-card-modern group">
      {/* Header met metadata */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">
              {thread.author?.naam || "Anoniem"}
            </span>
          </div>
          
          {/* Time */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <time>
              {formatDistanceToNow(new Date(thread.aangemaaktOp || thread._creationTime), {
                addSuffix: true,
                locale: nl,
              })}
            </time>
          </div>
          
          {/* Thread type indicator */}
          {thread.type === "poll" && (
            <div className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              <BarChart3 className="w-3 h-3" />
              <span>Poll</span>
            </div>
          )}
          
          {/* Channel badge if needed */}
          {showChannel && (thread.kanaal || thread.channel) && (
            <div className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border",
              getChannelColorClass((thread.kanaal || thread.channel)?.slug)
            )}>
              {getChannelIcon((thread.kanaal || thread.channel)?.type)}
              <span>{(thread.kanaal || thread.channel)?.naam}</span>
            </div>
          )}
        </div>
        
        {/* Sticky indicator */}
        {thread.sticky && (
          <div className="flex items-center gap-1 text-primary">
            <Pin className="w-4 h-4" />
            <span className="text-xs font-medium">Vastgepind</span>
          </div>
        )}

        {/* Admin menu */}
        {isAdmin && currentUserId && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAdminMenu(!showAdminMenu);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>

            {showAdminMenu && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowAdminMenu(false)}
                />
                
                {/* Menu */}
                <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                  <button
                    onClick={handleToggleSticky}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    {thread.sticky ? (
                      <>
                        <PinOff className="w-4 h-4" />
                        Unpin thread
                      </>
                    ) : (
                      <>
                        <Pin className="w-4 h-4" />
                        Pin thread
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? "Verwijderen..." : "Verwijder thread"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <Link href={threadUrl}>
        <div className="space-y-3 cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {thread.titel}
          </h3>
          
          {/* Thread afbeelding */}
          {thread.afbeelding && (
            <div className="rounded-lg overflow-hidden border">
              <img
                src={thread.afbeelding}
                alt={thread.titel}
                className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          )}
          
          {/* Text content or Poll */}
          {thread.type === "poll" && thread.poll ? (
            <div onClick={(e) => e.preventDefault()}>
              <PollDisplay 
                threadId={thread._id} 
                currentUserId={currentUserId}
                compact={true}
              />
            </div>
          ) : thread.inhoud && (
            <HtmlRenderer 
              content={thread.inhoud}
              preview={true}
              maxLength={250}
            />
          )}
        </div>
      </Link>

      {/* Footer met interactie */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
        {/* Upvotes - enhanced for voorstellen channel */}
        <button 
          className={cn(
            "flex items-center gap-2 text-sm group/upvote transition-all",
            enableUpvoting && currentUserId ? "hover:scale-105" : "cursor-default"
          )}
          onClick={handleUpvote}
          disabled={!enableUpvoting || !currentUserId}
        >
          <div className={cn(
            "p-1.5 rounded-lg transition-all",
            hasUpvoted
              ? "bg-primary text-white shadow-md" 
              : enableUpvoting && currentUserId
                ? "bg-gray-100 text-gray-600 group-hover/upvote:bg-primary group-hover/upvote:text-white"
                : "bg-gray-100 text-gray-600"
          )}>
            <ArrowUp className="w-4 h-4" />
          </div>
          <span className={cn(
            "font-medium",
            hasUpvoted ? "text-primary" : "text-gray-600"
          )}>
            {thread.upvotes?.length || 0}
          </span>
          {isVoorstellenChannel && enableUpvoting && (
            <span className="text-xs text-gray-500">
              {hasUpvoted ? "Gesteund" : "Steun dit idee"}
            </span>
          )}
        </button>

        {/* Comments placeholder */}
        <Link href={threadUrl}>
          <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
            <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-primary/10">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="font-medium">Reageer</span>
          </div>
        </Link>

        {/* Read more indicator */}
        <Link href={threadUrl}>
          <div className="ml-auto text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            {thread.type === "poll" ? "Bekijk poll →" : "Lees meer →"}
          </div>
        </Link>
      </div>
    </div>
  );
} 