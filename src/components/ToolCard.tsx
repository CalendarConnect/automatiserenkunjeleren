"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ExternalLink, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Id } from "../../convex/_generated/dataModel";

interface ToolCardProps {
  thread: {
    _id: Id<"threads">;
    titel: string;
    inhoud?: string;
    auteurId: Id<"users">;
    upvotes: Id<"users">[];
    aangemaaktOp: number;
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

export default function ToolCard({ 
  thread, 
  author, 
  currentUserId, 
  onUpvote,
  channelSlug 
}: ToolCardProps) {
  const [isUpvoted, setIsUpvoted] = useState(
    currentUserId ? thread.upvotes.includes(currentUserId) : false
  );

  const handleUpvote = () => {
    if (onUpvote && currentUserId) {
      onUpvote(thread._id);
      setIsUpvoted(!isUpvoted);
    }
  };

  // Parse de inhoud om tool informatie te extraheren
  const parseToolContent = (content?: string) => {
    if (!content) return { omschrijving: "", link: "", label: "" };
    
    const omschrijvingMatch = content.match(/\*\*Omschrijving:\*\*\s*([\s\S]*?)(?=\*\*Link:\*\*)/);
    const linkMatch = content.match(/\*\*Link:\*\*\s*(.*?)(?=\n|$)/);
    const labelMatch = content.match(/\*\*Type:\*\*\s*\[(.*?)\]/);
    
    return {
      omschrijving: omschrijvingMatch ? omschrijvingMatch[1].trim() : "",
      link: linkMatch ? linkMatch[1].trim() : "",
      label: labelMatch ? labelMatch[1].trim() : ""
    };
  };

  const { omschrijving, link, label } = parseToolContent(thread.inhoud);

  const getLabelColor = (label: string) => {
    switch (label.toLowerCase()) {
      case "gratis": return "bg-green-100 text-green-800";
      case "betaald": return "bg-blue-100 text-blue-800";
      case "open source": return "bg-purple-100 text-purple-800";
      case "freemium": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-yellow-50/50 to-blue-50/50 backdrop-blur-sm h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header met titel en auteur */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">
              {thread.titel}
            </h3>
            <div className="flex items-center text-xs text-slate-500">
              <div className="flex items-center">
                {author?.avatarUrl ? (
                  <img 
                    src={author.avatarUrl} 
                    alt={author.naam}
                    className="w-4 h-4 rounded-full mr-1"
                  />
                ) : (
                  <User className="w-4 h-4 mr-1" />
                )}
                <span>{author?.naam || "Onbekende gebruiker"}</span>
              </div>
            </div>
          </div>
          {label && (
            <Badge className={`text-xs ${getLabelColor(label)} border-0`}>
              {label}
            </Badge>
          )}
        </div>

        {/* Omschrijving */}
        <div className="flex-1 mb-4">
          <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">
            {omschrijving}
          </p>
        </div>

        {/* Footer met link en upvote */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="flex items-center space-x-3">
            {link && (
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Bezoek tool
              </a>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {thread.upvotes.length > 0 && (
              <span className="text-xs text-slate-500">
                {thread.upvotes.length}
              </span>
            )}
            <Button
              variant={isUpvoted ? "default" : "outline"}
              size="sm"
              onClick={handleUpvote}
              disabled={!currentUserId}
              className={`flex items-center space-x-1 text-xs px-2 py-1 h-7 ${
                isUpvoted 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "border-slate-300 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <ChevronUp className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 