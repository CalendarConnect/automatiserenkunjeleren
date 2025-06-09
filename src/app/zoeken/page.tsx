"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import KanaalSidebar from "@/components/KanaalSidebar";
import ThreadCard from "@/components/ThreadCard";
import TopNavigation from "@/components/TopNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Hash, Users, FileText } from "lucide-react";
import { useViewAwareAdmin } from "@/lib/useViewAwareRole";

function ZoekenContent() {
  const { isAdmin } = useViewAwareAdmin();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [searchType, setSearchType] = useState<"threads" | "users">("threads");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");

  const channels = useQuery(api.channels.getAllChannels);
  const allUsers = useQuery(api.users.getAllUsers);
  
  // Zoek threads
  const searchResults = useQuery(
    api.threads.searchThreads,
    searchTerm.length >= 2 
      ? { 
          searchTerm,
          kanaalId: selectedChannel !== "all" ? selectedChannel as any : undefined
        }
      : "skip"
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Filter gebruikers op zoekterm
  const filteredUsers = allUsers?.filter(user => 
    searchTerm.length >= 2 && (
      user.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.functie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organisatie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  ) || [];

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL without navigation
    const url = new URL(window.location.href);
    if (searchTerm) {
      url.searchParams.set("q", searchTerm);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div className="flex flex-col h-screen">
      <TopNavigation />
      <div className="flex flex-1 overflow-hidden">
        <KanaalSidebar />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Zoeken in Keyspace
            </h1>
            <p className="text-muted-foreground">
              Zoek naar threads, discussies en gebruikers in de community
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Zoek naar threads, gebruikers, onderwerpen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">
                Zoeken
              </Button>
            </div>
          </form>

          {/* Search Type Toggle */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant={searchType === "threads" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("threads")}
              >
                <Hash className="w-4 h-4 mr-1" />
                Threads
              </Button>
              {isAdmin && (
                <Button
                  variant={searchType === "users" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchType("users")}
                >
                  <Users className="w-4 h-4 mr-1" />
                  Gebruikers
                </Button>
              )}
            </div>
          </div>

          {/* Channel Filter for Threads */}
          {searchType === "threads" && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Filter op kanaal:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedChannel === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedChannel("all")}
                >
                  Alle kanalen
                </Button>
                {channels?.map((channel) => (
                  <Button
                    key={channel._id}
                    variant={selectedChannel === channel._id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedChannel(channel._id)}
                  >
                    {channel.type === "templates" && <FileText className="w-3 h-3 mr-1" />}
                    {channel.type === "discussie" && <Hash className="w-3 h-3 mr-1" />}
                    {channel.naam}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          <div>
            {searchTerm.length < 2 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Begin met typen om te zoeken
                </h3>
                <p className="text-muted-foreground">
                  Voer minimaal 2 karakters in om resultaten te zien
                </p>
              </div>
            ) : (
              <>
                {/* Thread Results */}
                {searchType === "threads" && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Threads ({searchResults?.length || 0})
                    </h2>
                    
                    {searchResults && searchResults.length > 0 ? (
                      <div className="space-y-4">
                        {searchResults.map((thread: any) => (
                          <ThreadCard
                            key={thread._id}
                            thread={thread as any}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Geen threads gevonden voor &quot;{searchTerm}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* User Results */}
                {searchType === "users" && isAdmin && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Gebruikers ({filteredUsers.length})
                    </h2>
                    
                    {filteredUsers.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUsers.map((user) => (
                          <div key={user._id} className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback>
                                  {getInitials(user.naam)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground truncate">
                                  {user.naam}
                                </h3>
                                <p className="text-sm text-muted-foreground truncate">
                                  {user.functie}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {user.organisatie}
                                </p>
                              </div>
                            </div>

                            {user.tags.length > 0 && (
                              <div className="mt-3">
                                <div className="flex flex-wrap gap-1">
                                  {user.tags.slice(0, 2).map(tag => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {user.tags.length > 2 && (
                                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                                      +{user.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Geen gebruikers gevonden voor &quot;{searchTerm}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default function ZoekenPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen">
        <KanaalSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Zoekpagina laden...</p>
          </div>
        </div>
      </div>
    }>
      <ZoekenContent />
    </Suspense>
  );
} 