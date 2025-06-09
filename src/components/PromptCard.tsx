"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Id } from "../../convex/_generated/dataModel";

interface PromptCardProps {
  thread: {
    _id: Id<"threads">;
    titel: string;
    inhoud?: string;
    auteurId: Id<"users">;
    upvotes: Id<"users">[];
    aangemaaktOp: number;
    afbeelding?: string;
    threadNumber: number;
    slug: string;
    kanaalId: Id<"channels">;
  };
  author: {
    naam: string;
    avatarUrl?: string;
  } | null;
  currentUserId?: Id<"users">;
  onUpvote?: (threadId: Id<"threads">) => void;
  channelSlug: string;
}

export default function PromptCard({ 
  thread, 
  author, 
  currentUserId, 
  onUpvote,
  channelSlug 
}: PromptCardProps) {
  const [isUpvoted, setIsUpvoted] = useState(
    currentUserId ? thread.upvotes.includes(currentUserId) : false
  );

  const handleUpvote = () => {
    if (onUpvote && currentUserId) {
      onUpvote(thread._id);
      setIsUpvoted(!isUpvoted);
    }
  };

  // Parse de inhoud om prompt en toelichting te scheiden
  const parseContent = (content?: string) => {
    if (!content) return { prompt: "", toelichting: "" };
    
    const promptMatch = content.match(/\*\*Prompt:\*\*\s*```([\s\S]*?)```/);
    const toelichtingMatch = content.match(/\*\*Toelichting:\*\*\s*([\s\S]*?)$/);
    
    return {
      prompt: promptMatch ? promptMatch[1].trim() : "",
      toelichting: toelichtingMatch ? toelichtingMatch[1].trim() : content
    };
  };

  const { prompt, toelichting } = parseContent(thread.inhoud);

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Header met titel en auteur */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link 
              href={`/kanaal/${channelSlug}/thread/${thread.threadNumber}`}
              className="block"
            >
              <h3 className="text-xl font-semibold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2">
                {thread.titel}
              </h3>
            </Link>
            <div className="flex items-center mt-2 text-sm text-slate-500">
              <div className="flex items-center">
                {author?.avatarUrl ? (
                  <img 
                    src={author.avatarUrl} 
                    alt={author.naam}
                    className="w-5 h-5 rounded-full mr-2"
                  />
                ) : (
                  <User className="w-5 h-5 mr-2" />
                )}
                <span>{author?.naam || "Onbekende gebruiker"}</span>
              </div>
              <span className="mx-2">•</span>
              <span>{new Date(thread.aangemaaktOp).toLocaleDateString('nl-NL')}</span>
            </div>
          </div>
        </div>

        {/* Prompt in codeblok */}
        {prompt && (
          <div className="mb-4">
            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-slate-100 font-mono whitespace-pre-wrap">
                {prompt}
              </pre>
            </div>
          </div>
        )}

        {/* Toelichting */}
        {toelichting && (
          <div className="mb-4">
            <p className="text-slate-700 leading-relaxed">
              {toelichting}
            </p>
          </div>
        )}

        {/* Afbeelding indien aanwezig */}
        {thread.afbeelding && (
          <div className="mb-4">
            <img 
              src={thread.afbeelding} 
              alt="Prompt afbeelding"
              className="rounded-lg max-w-full h-auto shadow-md"
            />
          </div>
        )}

        {/* Footer met upvote en reacties */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center space-x-4">
            <Link 
              href={`/kanaal/${channelSlug}/thread/${thread.threadNumber}`}
              className="flex items-center text-slate-500 hover:text-blue-600 transition-colors"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              <span className="text-sm">Reacties</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            {thread.upvotes.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {thread.upvotes.length} upvotes
              </Badge>
            )}
            <Button
              variant={isUpvoted ? "default" : "outline"}
              size="sm"
              onClick={handleUpvote}
              disabled={!currentUserId}
              className={`flex items-center space-x-1 ${
                isUpvoted 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "border-slate-300 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <ChevronUp className="w-4 h-4" />
              <span className="text-sm">Upvote</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 