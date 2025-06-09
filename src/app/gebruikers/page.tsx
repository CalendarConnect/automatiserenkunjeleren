"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import KanaalSidebar from "@/components/KanaalSidebar";
import TopNavigation from "@/components/TopNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Filter, Users, Shield, MoreHorizontal, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useViewAwareAdmin } from "@/lib/useViewAwareRole";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function GebruikersPage() {
  const { isAdmin, isLoading } = useViewAwareAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState<string | null>(null);
  
  const users = useQuery(api.users.getAllUsers);
  const deleteUser = useMutation(api.users.deleteUser);

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

  // Get all unique tags
  const allTags = Array.from(
    new Set(users?.flatMap(user => user.tags) || [])
  ).sort();

  // Filter users based on search and tags
  const filteredUsers = users?.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.functie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organisatie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => user.tags.includes(tag));

    return matchesSearch && matchesTags;
  }) || [];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      console.log('Deleting user from Convex:', userToDelete._id);
      
      // First delete from Convex
      const result = await deleteUser({ userId: userToDelete._id });
      console.log('Convex deletion result:', result);
      
      // Then delete from Clerk
      console.log('Deleting user from Clerk:', userToDelete.clerkId);
      const response = await fetch('/api/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clerkId: userToDelete.clerkId }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to delete user from Clerk:', errorText);
        // Continue anyway since Convex deletion succeeded
      } else {
        console.log('Successfully deleted user from Clerk');
      }
      
      setShowDeleteDialog(false);
      setUserToDelete(null);
      setShowAdminMenu(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(`Er is een fout opgetreden bij het verwijderen van de gebruiker: ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (user: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUserToDelete(user);
    setShowDeleteDialog(true);
    setShowAdminMenu(null);
  };

  // Redirect non-admins
  if (!isLoading && !isAdmin) {
    return (
      <div className="flex flex-col h-screen">
        <TopNavigation />
        <div className="flex flex-1 overflow-hidden">
          <KanaalSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Toegang geweigerd
              </h3>
              <p className="text-muted-foreground mb-4">
                Deze pagina is alleen toegankelijk voor administrators.
              </p>
              <Link href="/kanalen">
                <Button>
                  Terug naar Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!users) {
    return (
      <div className="flex flex-col h-screen">
        <TopNavigation />
        <div className="flex flex-1 overflow-hidden">
          <KanaalSidebar />
          <div className="flex-1 p-6">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
              ))}
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
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Community Leden
              </h1>
              <p className="text-muted-foreground">
                Ontdek en verbind met andere leden van de Keyholders community
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Zoek op naam, functie, organisatie of bio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Tags filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Filter op expertise:
                  </span>
                  {selectedTags.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTags([])}
                    >
                      Wis filters
                    </Button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{filteredUsers.length} van {users.length} leden</span>
            </div>

            {/* Users grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <div key={user._id} className="relative group">
                  {/* Admin menu button */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowAdminMenu(showAdminMenu === user._id ? null : user._id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>

                      {/* Admin dropdown menu */}
                      {showAdminMenu === user._id && (
                        <>
                          {/* Backdrop */}
                          <div 
                            className="fixed inset-0 z-20" 
                            onClick={() => setShowAdminMenu(null)}
                          />
                          
                          {/* Menu */}
                          <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                            <button
                              onClick={(e) => openDeleteDialog(user, e)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Verwijder gebruiker
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <Link href={`/gebruiker/${user.clerkId}`}>
                    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
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

                      {user.bio && (
                        <div className="text-sm text-muted-foreground mt-3 line-clamp-2">
                          {formatBioWithLineBreaks(user.bio)}
                        </div>
                      )}

                      {user.tags.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {user.tags.slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {user.tags.length > 3 && (
                              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                                +{user.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          Bekijk profiel
                        </Button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Geen leden gevonden
                </h3>
                <p className="text-muted-foreground mb-4">
                  Probeer je zoekopdracht aan te passen of filters te wijzigen
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedTags([]);
                  }}
                >
                  Wis alle filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Delete User Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Gebruiker Verwijderen
              </DialogTitle>
              <DialogDescription>
                Weet je zeker dat je {userToDelete?.naam} wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-sm text-gray-600 mb-3">
                Dit zal het volgende permanent verwijderen:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Het account en alle profielinformatie</li>
                <li>• Alle threads die de gebruiker heeft gemaakt</li>
                <li>• Alle reacties die de gebruiker heeft geplaatst</li>
                <li>• Alle polls die de gebruiker heeft gemaakt</li>
                <li>• Alle upvotes en andere interacties</li>
              </ul>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
              >
                Annuleren
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Verwijderen..." : "Ja, Verwijderen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 