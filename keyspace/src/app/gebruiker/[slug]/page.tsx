"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import KanaalSidebar from "@/components/KanaalSidebar";
import ThreadCard from "@/components/ThreadCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  Hash,
  MessageSquare,
  Calendar,
  Building,
  Briefcase,
  Tag,
  ArrowLeft,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useViewAwareAdmin } from "@/lib/useViewAwareRole";

export default function GebruikerPage() {
  const { isAdmin, isLoading } = useViewAwareAdmin();
  const params = useParams();
  const userSlug = params.slug as string;
  
  const [selectedTab, setSelectedTab] = useState<"threads" | "comments">("threads");
  
  // Voor nu zoeken we op clerkId (slug), later kunnen we een echte slug field toevoegen
  const user = useQuery(api.users.getUserByClerkId, { clerkId: userSlug });
  
  // Move hooks to top level to avoid conditional hook calling
  const userThreads = useQuery(
    api.threads.getThreadsByAuthor, 
    user ? { auteurId: user._id } : "skip"
  );
  const userComments = useQuery(
    api.comments.getCommentsByAuthor, 
    user ? { auteurId: user._id } : "skip"
  );

  // Redirect non-admins
  if (!isLoading && !isAdmin) {
    return (
      <div className="flex h-screen">
        <KanaalSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Toegang geweigerd
            </h3>
            <p className="text-muted-foreground mb-4">
              Gebruikersprofielen zijn alleen toegankelijk voor administrators.
            </p>
            <Link href="/kanalen">
              <Button>
                Terug naar Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatBioWithLineBreaks = (bio: string) => {
    return bio.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < bio.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  if (!user) {
    return (
      <div className="flex h-screen">
        <KanaalSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Gebruiker niet gevonden
            </h3>
            <p className="text-muted-foreground mb-4">
              Deze gebruiker bestaat niet of is niet beschikbaar.
            </p>
            <Link href="/gebruikers">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar Gebruikers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <KanaalSidebar />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              href="/gebruikers"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar Gebruikers
            </Link>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-6 h-6 text-foreground" />
              <h1 className="text-2xl font-bold text-foreground">
                {user.naam}
              </h1>
            </div>
            <p className="text-muted-foreground">
              Bekijk het profiel en de bijdragen van {user.naam}
            </p>
          </div>

          {/* Profile Header */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="text-lg">
                  {getInitials(user.naam)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {user.naam}
                </h2>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>{user.functie}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>{user.organisatie}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Lid sinds {new Date(user._creationTime).toLocaleDateString('nl-NL')}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Bijdragen</div>
                <div className="space-y-1">
                  <div className="text-sm">
                    <Hash className="w-3 h-3 inline mr-1" />
                    {userThreads?.length || 0} threads
                  </div>
                  <div className="text-sm">
                    <MessageSquare className="w-3 h-3 inline mr-1" />
                    {userComments?.length || 0} reacties
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-2">Bio</h3>
                <div className="text-muted-foreground">{formatBioWithLineBreaks(user.bio)}</div>
              </div>
            )}

            {/* Tags */}
            {user.tags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-2">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {user.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Activity Tabs */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant={selectedTab === "threads" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTab("threads")}
              >
                <Hash className="w-4 h-4 mr-1" />
                Threads ({userThreads?.length || 0})
              </Button>
              <Button
                variant={selectedTab === "comments" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTab("comments")}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Reacties ({userComments?.length || 0})
              </Button>
            </div>
          </div>

          {/* Content */}
          <div>
            {selectedTab === "threads" && (
              <div>
                {userThreads && userThreads.length > 0 ? (
                  <div className="space-y-4">
                    {userThreads.map((thread: any) => (
                      <ThreadCard key={thread._id} thread={thread} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Hash className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Geen threads gevonden
                    </h3>
                    <p className="text-muted-foreground">
                      {user.naam} heeft nog geen threads geplaatst
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedTab === "comments" && (
              <div>
                {userComments && userComments.length > 0 ? (
                  <div className="space-y-4">
                    {userComments.map((comment: any) => (
                      <div key={comment._id} className="bg-card border border-border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback>
                              {getInitials(user.naam)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-foreground">
                                {user.naam}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                reageerde {new Date(comment._creationTime).toLocaleDateString('nl-NL')}
                              </span>
                            </div>
                            
                            <p className="text-foreground mb-2">
                              {comment.inhoud}
                            </p>
                            
                            {comment.thread && (
                              <div className="text-sm">
                                <Link 
                                  href={`/thread/${comment.thread._id}`}
                                  className="text-primary hover:underline"
                                >
                                  In thread: {comment.thread.titel}
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Geen reacties gevonden
                    </h3>
                    <p className="text-muted-foreground">
                      {user.naam} heeft nog geen reacties achtergelaten
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 