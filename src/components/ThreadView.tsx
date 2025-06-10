"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowUp, Heart, MessageCircle, MoreHorizontal, BarChart3, User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import { useState } from "react";
import PollDisplay from "./PollDisplay";
import HtmlRenderer from "./HtmlRenderer";
import MentionInput from "./MentionInput";
import MentionRenderer from "./MentionRenderer";
import { useViewAwareAdmin } from "@/lib/useViewAwareRole";
import { useRouter } from "next/navigation";
import { Trash2, Pin, PinOff } from "lucide-react";
import Link from "next/link";
import ThreadAttachments from "./ThreadAttachments";

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
  const [commentMentions, setCommentMentions] = useState<string[]>([]);
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
      mentions: commentMentions.length > 0 ? commentMentions as any : undefined,
    });
    setNewComment("");
    setCommentMentions([]);
  };

  const handleCommentChange = (value: string, mentions: string[]) => {
    setNewComment(value);
    setCommentMentions(mentions);
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
      <div className="space-y-6">
        {/* Header with breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/kanalen" className="hover:text-foreground">
            Kanalen
          </Link>
          <span>/</span>
          <Link 
            href={`/kanaal/${thread.channel?.slug}`}
            className="hover:text-foreground"
          >
            {thread.channel?.naam}
          </Link>
          <span>/</span>
          <span className="text-foreground">{thread.titel}</span>
        </div>

        <div className="bg-card border rounded-lg p-6">
          {/* Thread header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={thread.author?.avatarUrl} />
                <AvatarFallback>
                  {thread.author?.naam ? getInitials(thread.author.naam) : "U"}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {thread.titel}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {thread.author?.naam}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDistanceToNow(new Date(thread.aangemaaktOp), { 
                      addSuffix: true, 
                      locale: nl 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Thread Attachments - Show between title and content */}
          {thread.attachments && (
            <div className="mb-6">
              <ThreadAttachments attachments={thread.attachments} />
            </div>
          )}

          {/* Thread content */}
          <div className="prose prose-sm max-w-none mb-6">
            {thread.type === "poll" ? (
              <PollDisplay threadId={threadId} currentUserId={currentUserId} />
            ) : thread.inhoud ? (
              <div className="text-foreground">
                <MentionRenderer content={thread.inhoud} />
              </div>
            ) : null}
          </div>

          {/* Thread image */}
          {thread.afbeelding && (
            <div className="mb-6">
              <img
                src={thread.afbeelding}
                alt="Thread afbeelding"
                className="max-w-full h-auto rounded-lg border shadow-sm"
              />
            </div>
          )}

          {/* Mentioned users */}
          {thread.mentionedUsers && thread.mentionedUsers.length > 0 && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Vermelde gebruikers:</h4>
              <div className="flex flex-wrap gap-2">
                {thread.mentionedUsers.map((user: any) => (
                  <Link
                    key={user._id}
                    href={`/gebruiker/${user._id}`}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-xs text-blue-800 transition-colors"
                  >
                    <User className="w-3 h-3" />
                    {user.naam}
                  </Link>
                ))}
              </div>
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

      {/* Comment Form */}
      {currentUserId ? (
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <MentionInput
                value={newComment}
                onChange={handleCommentChange}
                onSubmit={handlePostComment}
                placeholder="Schrijf een reactie... (typ @ om iemand te taggen)"
                className="min-h-[80px]"
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

                <MentionRenderer
                  content={comment.inhoud}
                  mentionedUsers={comment.mentionedUsers}
                  className="text-foreground mb-2"
                />

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