"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowUp, Heart, MessageCircle, MoreHorizontal, BarChart3 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import { useState } from "react";
import PollDisplay from "./PollDisplay";
import HtmlRenderer from "./HtmlRenderer";
import { useViewAwareAdmin } from "@/lib/useViewAwareRole";
import { useRouter } from "next/navigation";
import { Trash2, Pin, PinOff } from "lucide-react";

interface ThreadViewProps {
  threadId: string;
  currentUserId?: string;
}

export default function ThreadView({ threadId, currentUserId }: ThreadViewProps) {
  const { isAdmin } = useViewAwareAdmin();
  const router = useRouter();
  
  const thread = useQuery(api.threads.getThreadById, { threadId: threadId as any });
  const comments = useQuery(api.comments.getCommentsByThread, { threadId: threadId as any });
  const [newComment, setNewComment] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  

  const likeComment = useMutation(api.comments.likeComment);
  const postComment = useMutation(api.comments.postComment);
  const deleteThread = useMutation(api.threads.deleteThread);
  const toggleSticky = useMutation(api.threads.toggleStickyThread);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };



  const handleLikeComment = async (commentId: string) => {
    if (!currentUserId) return;
    await likeComment({
      commentId: commentId as any,
      userId: currentUserId as any,
    });
  };

  const handlePostComment = async () => {
    if (!currentUserId || !newComment.trim()) return;
    await postComment({
      threadId: threadId as any,
      auteurId: currentUserId as any,
      inhoud: newComment.trim(),
    });
    setNewComment("");
  };

  const handleDeleteThread = async () => {
    if (!currentUserId || !isAdmin || !thread) return;
    
    const confirmed = window.confirm(
      `Weet je zeker dat je de thread "${thread.titel}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`
    );
    
    if (!confirmed) return;
    
    setIsDeleting(true);
    try {
      await deleteThread({
        threadId: threadId as any,
        userId: currentUserId as any,
      });
      
      // Navigate back to kanalen page after deletion
      router.push('/kanalen');
    } catch (error) {
      console.error("Error deleting thread:", error);
      alert("Er is een fout opgetreden bij het verwijderen van de thread.");
      setIsDeleting(false);
    }
  };

  const handleToggleSticky = async () => {
    if (!currentUserId || !isAdmin) return;
    
    try {
      await toggleSticky({
        threadId: threadId as any,
      });
    } catch (error) {
      console.error("Error toggling sticky:", error);
    }
  };

  if (!thread) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
          <div className="h-32 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }



  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Main Thread */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={thread.author?.avatarUrl} />
            <AvatarFallback>
              {thread.author ? getInitials(thread.author.naam) : "SYS"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {thread.sticky && (
                <Pin className="w-4 h-4 text-primary" />
              )}
              {thread.type === "poll" && (
                <div className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  <BarChart3 className="w-3 h-3" />
                  <span>Poll</span>
                </div>
              )}
              <h1 className="text-xl font-bold text-foreground">
                {thread.titel}
              </h1>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>
                {thread.author?.naam || "Systeem"} • {thread.author?.functie || "Automatisch gegenereerd"}
              </span>
              <span>
                {formatDistanceToNow(new Date(thread.aangemaaktOp), {
                  addSuffix: true,
                  locale: nl,
                })}
              </span>
            </div>

            {/* Content - either text or poll */}
            {thread.type === "poll" ? (
              <div className="mb-4">
                <PollDisplay 
                  threadId={threadId} 
                  currentUserId={currentUserId}
                  compact={false}
                />
              </div>
            ) : thread.inhoud && (
              <div className="mb-4">
                <HtmlRenderer 
                  content={thread.inhoud}
                  preview={false}
                />
              </div>
            )}

            {/* Thread image */}
            {thread.afbeelding && (
              <div className="mb-4 rounded-lg overflow-hidden border">
                <img
                  src={thread.afbeelding}
                  alt={thread.titel}
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowUp className="w-4 h-4" />
                <span>{thread.upvotes.length} upvotes</span>
              </div>

              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{comments?.length || 0} reacties</span>
              </Button>

              {/* Admin controls */}
              {isAdmin && currentUserId && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleSticky}
                    className="flex items-center gap-2"
                  >
                    {thread.sticky ? (
                      <>
                        <PinOff className="w-4 h-4" />
                        Unpin
                      </>
                    ) : (
                      <>
                        <Pin className="w-4 h-4" />
                        Pin
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteThread}
                    disabled={isDeleting}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? "Verwijderen..." : "Verwijderen"}
                  </Button>
                </>
              )}

              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      {currentUserId ? (
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Schrijf een reactie..."
                className="w-full min-h-[80px] p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex justify-end mt-2">
                <Button 
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  Reageer
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6 text-center">
          <p className="text-muted-foreground">
            Log in om te kunnen reageren
          </p>
        </div>
      )}

      {/* Comments */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Reacties ({comments?.length || 0})
        </h2>

        {comments?.map((comment) => (
          <div key={comment._id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment.author?.avatarUrl} />
                <AvatarFallback>
                  {comment.author ? getInitials(comment.author.naam) : "SYS"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground">
                    {comment.author?.naam || "Systeem"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {comment.author?.functie}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.aangemaaktOp), {
                      addSuffix: true,
                      locale: nl,
                    })}
                  </span>
                </div>

                <p className="text-foreground mb-2 whitespace-pre-wrap">
                  {comment.inhoud}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeComment(comment._id)}
                    className={`flex items-center gap-1 text-xs ${
                      currentUserId && comment.likes.includes(currentUserId as any)
                        ? "text-red-500"
                        : "text-muted-foreground"
                    }`}
                    disabled={!currentUserId}
                  >
                    <Heart className="w-3 h-3" />
                    <span>{comment.likes.length}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 