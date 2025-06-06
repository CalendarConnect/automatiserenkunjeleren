"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Check, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface PollDisplayProps {
  threadId: string;
  currentUserId?: string;
  compact?: boolean; // For display in thread cards
}

export default function PollDisplay({ threadId, currentUserId, compact = false }: PollDisplayProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const poll = useQuery(api.threads.getPollByThreadId, { threadId: threadId as any });
  const userVote = useQuery(
    api.threads.getUserPollVote, 
    currentUserId ? { threadId: threadId as any, userId: currentUserId as any } : "skip"
  );
  const votePoll = useMutation(api.threads.votePoll);

  const handleVote = async () => {
    if (!currentUserId || selectedOption === null || !poll) return;
    
    setIsVoting(true);
    try {
      await votePoll({
        threadId: threadId as any,
        userId: currentUserId as any,
        optieIndex: selectedOption,
      });
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsVoting(false);
    }
  };

  if (!poll) return null;

  const hasVoted = userVote !== null;
  const totalVotes = poll.totalVotes;

  return (
    <div className={cn(
      "bg-card border border-border rounded-lg p-4",
      compact && "p-3"
    )}>
      {/* Poll Question */}
      <h3 className={cn(
        "font-semibold text-foreground mb-4",
        compact ? "text-sm" : "text-base"
      )}>
        {poll.vraag}
      </h3>

      {/* Poll Options */}
      <div className="space-y-2">
        {poll.opties.map((optie, index) => {
          const voteCount = poll.voteCounts[index];
          const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
          const isSelected = selectedOption === index;
          const isUserVote = userVote === index;

          return (
            <div key={index} className="relative">
              {/* Vote Button/Display */}
              <button
                onClick={() => {
                  if (!hasVoted && currentUserId) {
                    setSelectedOption(isSelected ? null : index);
                  }
                }}
                disabled={hasVoted || !currentUserId}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-all relative overflow-hidden",
                  compact && "p-2 text-sm",
                  hasVoted 
                    ? "cursor-default" 
                    : currentUserId 
                      ? "hover:border-primary cursor-pointer" 
                      : "cursor-default opacity-75",
                  isSelected && !hasVoted && "border-primary bg-primary/5",
                  isUserVote && "border-primary bg-primary/10"
                )}
              >
                {/* Progress Bar Background */}
                {hasVoted && (
                  <div 
                    className="absolute inset-0 bg-gray-100 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                )}
                
                {/* Content */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isUserVote && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                    <span className={cn(
                      "font-medium",
                      isUserVote && "text-primary"
                    )}>
                      {optie}
                    </span>
                  </div>
                  
                  {hasVoted && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{voteCount}</span>
                      <span>({percentage.toFixed(1)}%)</span>
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Vote Button */}
      {!hasVoted && currentUserId && selectedOption !== null && (
        <Button
          onClick={handleVote}
          disabled={isVoting}
          className="w-full mt-4"
          size={compact ? "sm" : "default"}
        >
          {isVoting ? "Stemmen..." : "Stem"}
        </Button>
      )}

      {/* Login Prompt */}
      {!currentUserId && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Log in om te kunnen stemmen
        </div>
      )}

      {/* Vote Summary */}
      <div className={cn(
        "flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border text-muted-foreground",
        compact ? "text-xs" : "text-sm"
      )}>
        <Users className="w-4 h-4" />
        <span>
          {totalVotes} {totalVotes === 1 ? "stem" : "stemmen"}
        </span>
      </div>
    </div>
  );
} 