"use client";

import { useState } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import KanaalSidebar from "@/components/KanaalSidebar";
import EmojiPicker from "@/components/EmojiPicker";
import ColorPicker from "@/components/ColorPicker";
import SortableSectiesList from "@/components/SortableSectiesList";
import SortableChannelsList from "@/components/SortableChannelsList";
import CrossSectionChannelsList from "@/components/CrossSectionChannelsList";
import ConvexWrapper from "@/components/ConvexWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser, useIsAdmin } from "@/lib/useCurrentUser";
import { useViewAwareAdmin } from "@/lib/useViewAwareRole";
import { useViewMode } from "@/contexts/ViewModeContext";
import { useGetAllUsersWithRoles, useUpdateUserRole, useDeleteUser, useConvexQuery, useConvexMutation } from "@/lib/useConvexFunction";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import {
  Settings,
  Hash,
  FileText,
  BookOpen,
  Pin,
  PinOff,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Folder,
  Users,
  Shield,
  ShieldCheck,
  Crown,
  Eye,
  EyeOff,
} from "lucide-react";

function BeheerContent() {
  const [selectedTab, setSelectedTab] = useState<"channels" | "sticky" | "secties" | "users">("channels");
  
  // Authentication and authorization
  const { user: clerkUser } = useUser();
  const { isAuthenticated: convexAuthenticated, isLoading: convexAuthLoading } = useConvexAuth();
  const { user: currentUser, isLoading: userLoading } = useCurrentUser();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { isViewingAsMember, setViewingAsMember } = useViewMode();
  
  const [editingChannel, setEditingChannel] = useState<string | null>(null);
  const [newChannelData, setNewChannelData] = useState({
    naam: "",
    beschrijving: "",
    type: "discussie" as "discussie" | "templates" | "modules",
    sectieId: "" as string,
    slug: "",
  });
  
  // Sectie management state
  const [newSectieData, setNewSectieData] = useState({
    naam: "",
    emoji: "📌",
    kleur: "#3B82F6",
  });
  const [editingSectie, setEditingSectie] = useState<string | null>(null);

  // Only fetch users if user is authenticated and is admin (and loading is complete)
  // If we have currentUser with admin role, that means auth is working
  const shouldFetchUsers = Boolean(
    clerkUser?.id && 
    !adminLoading && 
    !userLoading && 
    currentUser?._id && 
    currentUser.role === "admin"
  );

  // Debug logging
  console.log("Debug - Clerk User:", clerkUser?.id);
  console.log("Debug - Convex Authenticated:", convexAuthenticated);
  console.log("Debug - Convex Auth Loading:", convexAuthLoading);
  console.log("Debug - Current User:", currentUser);
  console.log("Debug - Current User Role:", currentUser?.role);
  console.log("Debug - Is Admin:", isAdmin);
  console.log("Debug - Admin Loading:", adminLoading);
  console.log("Debug - User Loading:", userLoading);
  console.log("Debug - Should Fetch Users:", shouldFetchUsers);
  
  // Only fetch admin data if user is admin
  const channels = useConvexQuery(shouldFetchUsers ? "channels:getAllChannels" : "skip");
  const secties = useConvexQuery(shouldFetchUsers ? "secties:getAllSecties" : "skip");
  const draftSecties = useConvexQuery(shouldFetchUsers ? "secties:getSectiesByStatus" : "skip", shouldFetchUsers ? { status: "draft" } : undefined);
  const liveSecties = useConvexQuery(shouldFetchUsers ? "secties:getSectiesByStatus" : "skip", shouldFetchUsers ? { status: "live" } : undefined);
  const allThreads = useConvexQuery(shouldFetchUsers ? "threads:getAllThreads" : "skip");
  const allUsers = useGetAllUsersWithRoles(shouldFetchUsers);
  
  const updateChannel = useMutation("channels:updateChannel" as any);
  const deleteChannel = useMutation("channels:deleteChannel" as any);
  const createChannel = useMutation("channels:createChannel" as any);
  const toggleStickyThread = useMutation("threads:toggleStickyThread" as any);
  
  // User management mutations
  const updateUserRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  
  // Sectie mutations
  const createSectie = useMutation("secties:createSectie" as any);
  const updateSectie = useMutation("secties:updateSectie" as any);
  const deleteSectie = useMutation("secties:deleteSectie" as any);
  const reorderSecties = useMutation("secties:reorderSecties" as any);
  const migrateDefaultSecties = useMutation("secties:migrateDefaultSecties" as any);
  const updateExistingSecties = useMutation("secties:updateExistingSecties" as any);
  const toggleSectieStatus = useMutation("secties:toggleSectieStatus" as any);
  const publishLiveSecties = useMutation("secties:publishLiveSecties" as any);
  
  // Channel migration mutations
  const migrateChannelSections = useMutation("channels:migrateChannelSections" as any);
  const migrateChannelOrder = useMutation("channels:migrateChannelOrder" as any);
  const migrateChannelVisibility = useMutation("channels:migrateChannelVisibility" as any);
  const reorderChannels = useMutation("channels:reorderChannels" as any);
  const moveChannelToSection = useMutation("channels:moveChannelToSection" as any);
  const toggleChannelVisibility = useMutation("channels:toggleChannelVisibility" as any);
  
  const [isPublishing, setIsPublishing] = useState(false);

  const handleCreateChannel = async () => {
    if (!newChannelData.naam.trim() || !newChannelData.slug.trim() || !currentUser) return;
    
    try {
      await createChannel({
        naam: newChannelData.naam,
        beschrijving: newChannelData.beschrijving,
        type: newChannelData.type,
        sectieId: newChannelData.sectieId ? (newChannelData.sectieId as any) : undefined,
        slug: newChannelData.slug,
        aangemaaktDoor: currentUser._id,
      });
      
      setNewChannelData({
        naam: "",
        beschrijving: "",
        type: "discussie",
        sectieId: "",
        slug: "",
      });
    } catch (error) {
      console.error("Fout bij maken kanaal:", error);
    }
  };

  const handleDeleteChannel = async (channelId: string) => {
    if (!confirm("Weet je zeker dat je dit kanaal wilt verwijderen?")) return;
    
    try {
      await deleteChannel({ kanaalId: channelId as any });
    } catch (error) {
      console.error("Fout bij verwijderen kanaal:", error);
    }
  };

  const handleToggleSticky = async (threadId: string) => {
    try {
      await toggleStickyThread({ threadId: threadId as any });
    } catch (error) {
      console.error("Fout bij toggle sticky:", error);
    }
  };

  const handleCreateSectie = async () => {
    if (!newSectieData.naam.trim()) return;
    
    try {
      await createSectie({
        naam: newSectieData.naam,
        emoji: newSectieData.emoji,
        kleur: newSectieData.kleur,
      });
      
      setNewSectieData({
        naam: "",
        emoji: "📌",
        kleur: "#3B82F6",
      });
    } catch (error) {
      console.error("Fout bij maken sectie:", error);
    }
  };

  const handleDeleteSectie = async (sectieId: string) => {
    if (!confirm("Weet je zeker dat je deze sectie wilt verwijderen?")) return;
    
    try {
      await deleteSectie({ sectieId: sectieId as any });
    } catch (error) {
      console.error("Fout bij verwijderen sectie:", error);
      alert("Kan sectie niet verwijderen: mogelijk zijn er nog kanalen toegewezen aan deze sectie");
    }
  };

  const handleReorderSecties = async (newOrder: any[]) => {
    try {
      // Maak een array van sectie orders met nieuwe volgorde nummers
      const sectieOrders = newOrder.map((sectie, index) => ({
        sectieId: sectie._id,
        volgorde: index + 1,
      }));
      
      await reorderSecties({ sectieOrders });
    } catch (error) {
      console.error("Fout bij herordenen secties:", error);
    }
  };

  const handleMigrateSecties = async () => {
    try {
      const result = await migrateDefaultSecties();
      if (result.count > 0) {
        alert(`${result.count} nieuwe standaard secties zijn toegevoegd!`);
      } else {
        alert("Alle standaard secties bestaan al.");
      }
    } catch (error) {
      console.error("Fout bij migratie:", error);
      alert("Fout bij migratie: " + (error as Error).message);
    }
  };

  const handleUpdateExistingSecties = async () => {
    try {
      const result = await updateExistingSecties();
      alert(`${result.updated} secties zijn geüpdatet met status!`);
    } catch (error) {
      console.error("Fout bij updaten:", error);
    }
  };

  const handleToggleStatus = async (sectieId: string) => {
    try {
      await toggleSectieStatus({ sectieId: sectieId as any });
    } catch (error) {
      console.error("Fout bij wijzigen status:", error);
    }
  };

  const handlePublishLiveSecties = async () => {
    if (!confirm("Weet je zeker dat je alle live secties wilt opslaan en publiceren?")) return;
    
    setIsPublishing(true);
    try {
      const result = await publishLiveSecties();
      alert(`${result.publishedCount} live secties zijn opgeslagen en gepubliceerd!`);
    } catch (error) {
      console.error("Fout bij publiceren:", error);
      alert("Er is een fout opgetreden bij het publiceren van de secties");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleMigrateChannelSections = async () => {
    if (!confirm("Weet je zeker dat je alle kanalen wilt migreren naar de juiste secties? Dit zal automatisch sectieId toewijzen aan kanalen die dit nog niet hebben.")) return;
    
    try {
      const result = await migrateChannelSections();
      alert(`Migratie voltooid!\n- Totaal kanalen: ${result.totalChannels}\n- Kanalen zonder sectie: ${result.channelsWithoutSection}\n- Bijgewerkte kanalen: ${result.updatedCount}\n\nBeschikbare secties: ${result.availableSections.join(', ')}`);
    } catch (error) {
      console.error("Fout bij kanaal migratie:", error);
      alert("Er is een fout opgetreden bij het migreren van de kanalen: " + (error as Error).message);
    }
  };

  const handleMigrateChannelOrder = async () => {
    if (!confirm("Weet je zeker dat je volgorde nummers wilt toewijzen aan alle kanalen binnen hun secties?")) return;
    
    try {
      const result = await migrateChannelOrder();
      alert(`Volgorde migratie voltooid!\n- Totaal kanalen: ${result.totalChannels}\n- Bijgewerkte kanalen: ${result.updatedChannels}\n- Secties verwerkt: ${result.sectionsProcessed}`);
    } catch (error) {
      console.error("Fout bij volgorde migratie:", error);
      alert("Er is een fout opgetreden bij het migreren van de kanaal volgorde: " + (error as Error).message);
    }
  };

  const handleMigrateChannelVisibility = async () => {
    if (!confirm("Weet je zeker dat je alle bestaande kanalen zichtbaar wilt maken?")) return;
    
    try {
      const result = await migrateChannelVisibility();
      alert(`Zichtbaarheid migratie voltooid!\n- Totaal kanalen: ${result.totalChannels}\n- Bijgewerkte kanalen: ${result.updatedChannels}`);
    } catch (error) {
      console.error("Fout bij zichtbaarheid migratie:", error);
      alert("Er is een fout opgetreden bij het migreren van de kanaal zichtbaarheid: " + (error as Error).message);
    }
  };

  const handleReorderChannels = async (newOrder: any[], sectieId?: string) => {
    try {
      // Create array of channel orders with new position numbers
      const channelOrders = newOrder.map((channel, index) => ({
        channelId: channel._id,
        volgorde: index + 1,
      }));
      
      await reorderChannels({ channelOrders });
    } catch (error) {
      console.error("Fout bij herordenen kanalen:", error);
      alert("Er is een fout opgetreden bij het herordenen van de kanalen");
    }
  };

  const handleChannelMove = async (channelId: string, newSectionId: string | undefined, newOrder: any[]) => {
    try {
      // Create array of channel orders with new position numbers
      const channelOrders = newOrder.map((channel, index) => ({
        channelId: channel._id,
        volgorde: index + 1,
      }));
      
      await moveChannelToSection({ 
        channelId: channelId as any,
        newSectionId: newSectionId as any,
        newOrder: channelOrders
      });
    } catch (error) {
      console.error("Fout bij verplaatsen kanaal:", error);
      alert("Er is een fout opgetreden bij het verplaatsen van het kanaal");
    }
  };

  const handleToggleChannelVisibility = async (channelId: string) => {
    try {
      const result = await toggleChannelVisibility({ channelId: channelId as any });
      console.log(`Kanaal "${result.channelName}" is nu ${result.newVisibility ? 'zichtbaar' : 'verborgen'}`);
    } catch (error) {
      console.error("Fout bij wijzigen zichtbaarheid:", error);
      alert("Er is een fout opgetreden bij het wijzigen van de zichtbaarheid");
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "templates":
        return <FileText className="w-4 h-4" />;
      case "modules":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  const generateSlug = (naam: string) => {
    return naam
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  // User management functions
  const handleUpdateUserRole = async (userId: string, newRole: "admin" | "member" | "moderator") => {
    if (!confirm(`Weet je zeker dat je de rol wilt wijzigen naar ${newRole}?`)) return;
    
    try {
      await updateUserRole({ userId: userId as any, role: newRole });
    } catch (error) {
      console.error("Fout bij wijzigen rol:", error);
      alert("Fout bij wijzigen rol: " + (error as Error).message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Weet je zeker dat je deze gebruiker wilt verwijderen?")) return;
    
    try {
      await deleteUser({ userId: userId as any });
    } catch (error) {
      console.error("Fout bij verwijderen gebruiker:", error);
      alert("Fout bij verwijderen gebruiker: " + (error as Error).message);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case "moderator":
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      default:
        return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "moderator":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Loading state
  if (userLoading || adminLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Laden...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!clerkUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Inloggen vereist</h1>
          <p className="text-muted-foreground mb-4">
            Je moet ingelogd zijn om de beheerpagina te bekijken.
          </p>
          <SignInButton>
            <Button>Inloggen</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  // Not authorized (not admin)
  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Toegang geweigerd</h1>
          <p className="text-muted-foreground mb-4">
            Je hebt geen beheerrechten om deze pagina te bekijken.
          </p>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              Terug
            </Button>
            <SignOutButton>
              <Button variant="outline">Uitloggen</Button>
            </SignOutButton>
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
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-foreground" />
                <h1 className="text-2xl font-bold text-foreground">
                  Beheer
                </h1>
              </div>
              {isViewingAsMember ? (
                <Button
                  onClick={() => setViewingAsMember(false)}
                  variant="outline"
                  className="flex items-center gap-2 border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100"
                >
                  <EyeOff className="w-4 h-4" />
                  Terug naar Admin Modus
                </Button>
              ) : (
                <Button
                  onClick={() => setViewingAsMember(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Bekijk als lid
                </Button>
              )}
            </div>
            <p className="text-muted-foreground">
              Beheer kanalen, sticky posts en andere instellingen
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant={selectedTab === "secties" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTab("secties")}
              >
                <Folder className="w-4 h-4 mr-1" />
                Secties
              </Button>
              <Button
                variant={selectedTab === "channels" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTab("channels")}
              >
                <Hash className="w-4 h-4 mr-1" />
                Kanalen
              </Button>
              <Button
                variant={selectedTab === "sticky" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTab("sticky")}
              >
                <Pin className="w-4 h-4 mr-1" />
                Sticky Posts
              </Button>
              <Button
                variant={selectedTab === "users" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTab("users")}
              >
                <Users className="w-4 h-4 mr-1" />
                Gebruikers
              </Button>
            </div>
          </div>

          {selectedTab === "secties" && (
            <div className="space-y-6">
              {/* Migratie en update knoppen */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Sectie Management
                </h3>
                <p className="text-blue-700 mb-4">
                  Voeg de standaard secties toe, update bestaande secties met het nieuwe status systeem, of migreer kanalen naar de juiste secties.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={handleMigrateSecties} className="bg-blue-600 hover:bg-blue-700">
                    Voeg Standaard Secties Toe
                  </Button>
                  <Button onClick={handleUpdateExistingSecties} variant="outline">
                    Update Bestaande Secties
                  </Button>
                  <Button onClick={handleMigrateChannelSections} className="bg-orange-600 hover:bg-orange-700">
                    Migreer Kanalen naar Secties
                  </Button>
                  <Button onClick={handleMigrateChannelOrder} className="bg-purple-600 hover:bg-purple-700">
                    Stel Kanaal Volgorde In
                  </Button>
                  <Button onClick={handleMigrateChannelVisibility} className="bg-indigo-600 hover:bg-indigo-700">
                    Maak Bestaande Kanalen Zichtbaar
                  </Button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Nieuwe Sectie Maken
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sectie-naam">Naam</Label>
                    <Input
                      id="sectie-naam"
                      type="text"
                      value={newSectieData.naam}
                      onChange={(e) =>
                        setNewSectieData({
                          ...newSectieData,
                          naam: e.target.value,
                        })
                      }
                      placeholder="Sectie naam"
                    />
                  </div>
                  <div>
                    <Label>Emoji</Label>
                    <EmojiPicker
                      currentEmoji={newSectieData.emoji}
                      onEmojiSelect={(emoji) =>
                        setNewSectieData({
                          ...newSectieData,
                          emoji,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Kleur</Label>
                    <ColorPicker
                      currentColor={newSectieData.kleur}
                      onColorSelect={(kleur) =>
                        setNewSectieData({
                          ...newSectieData,
                          kleur,
                        })
                      }
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button onClick={handleCreateSectie}>
                    <Plus className="w-4 h-4 mr-2" />
                    Sectie Maken (Draft)
                  </Button>
                </div>
              </div>

              {/* Live Secties */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-green-800">
                    🟢 Live Secties (Zichtbaar in Sidebar)
                  </h2>
                  <Button
                    onClick={handlePublishLiveSecties}
                    disabled={isPublishing || !liveSecties || liveSecties.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isPublishing ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Opslaan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Wijzigingen Opslaan
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Deze secties zijn actief en worden getoond in de sidebar. Sleep om de volgorde te wijzigen.
                </p>
                
                <SortableSectiesList
                  secties={liveSecties || []}
                  onReorder={handleReorderSecties}
                  onEdit={setEditingSectie}
                  onDelete={handleDeleteSectie}
                  onToggleStatus={handleToggleStatus}
                  showToggle={true}
                />
              </div>

              {/* Draft Secties */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-600 mb-4">
                  ⚪ Draft Secties (Niet Zichtbaar)
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Deze secties zijn nog niet actief. Klik op ⬆️ om ze live te maken.
                </p>
                
                <SortableSectiesList
                  secties={draftSecties || []}
                  onReorder={handleReorderSecties}
                  onEdit={setEditingSectie}
                  onDelete={handleDeleteSectie}
                  onToggleStatus={handleToggleStatus}
                  showToggle={true}
                />
              </div>
            </div>
          )}

          {selectedTab === "channels" && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Nieuw Kanaal Maken
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="naam">Naam</Label>
                    <Input
                      id="naam"
                      type="text"
                      value={newChannelData.naam}
                      onChange={(e) => {
                        setNewChannelData({
                          ...newChannelData,
                          naam: e.target.value,
                          slug: generateSlug(e.target.value),
                        });
                      }}
                      placeholder="Kanaal naam"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      type="text"
                      value={newChannelData.slug}
                      onChange={(e) =>
                        setNewChannelData({
                          ...newChannelData,
                          slug: e.target.value,
                        })
                      }
                      placeholder="kanaal-slug"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="beschrijving">Beschrijving</Label>
                    <Input
                      id="beschrijving"
                      type="text"
                      value={newChannelData.beschrijving}
                      onChange={(e) =>
                        setNewChannelData({
                          ...newChannelData,
                          beschrijving: e.target.value,
                        })
                      }
                      placeholder="Beschrijving van het kanaal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sectie">Sectie</Label>
                    <select
                      id="sectie"
                      value={newChannelData.sectieId}
                      onChange={(e) =>
                        setNewChannelData({
                          ...newChannelData,
                          sectieId: e.target.value,
                        })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="">Geen sectie</option>
                      {secties?.map((sectie: any) => (
                        <option key={sectie._id} value={sectie._id}>
                          {sectie.emoji} {sectie.naam}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      value={newChannelData.type}
                      onChange={(e) =>
                        setNewChannelData({
                          ...newChannelData,
                          type: e.target.value as any,
                        })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="discussie">Discussie</option>
                      <option value="templates">Templates</option>
                      <option value="modules">Modules</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button onClick={handleCreateChannel}>
                    <Plus className="w-4 h-4 mr-2" />
                    Kanaal Maken
                  </Button>
                </div>
              </div>

              {/* Cross-section draggable channels */}
              {(() => {
                if (!liveSecties || !channels) return null;

                // Group channels by section ID
                const channelsBySectionId: Record<string, any[]> = {};
                
                // Initialize with empty arrays for all live sections
                liveSecties.forEach((section: any) => {
                  channelsBySectionId[section._id] = [];
                });
                
                // Group channels
                channels.forEach((channel: any) => {
                  const sectionKey = channel.sectieId || 'no-section';
                  if (!channelsBySectionId[sectionKey]) {
                    channelsBySectionId[sectionKey] = [];
                  }
                  channelsBySectionId[sectionKey].push(channel);
                });
                
                // Sort channels within each section
                Object.keys(channelsBySectionId).forEach(sectionId => {
                  channelsBySectionId[sectionId].sort((a, b) => (a.volgorde || 0) - (b.volgorde || 0));
                });

                return (
                  <CrossSectionChannelsList
                    sections={liveSecties}
                    channelsBySectionId={channelsBySectionId}
                    onChannelMove={handleChannelMove}
                    onEdit={setEditingChannel}
                    onDelete={handleDeleteChannel}
                    onToggleVisibility={handleToggleChannelVisibility}
                  />
                );
              })()}
            </div>
          )}

          {selectedTab === "sticky" && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Sticky Posts Beheer
                </h2>
                
                <div className="space-y-3">
                  {allThreads?.map((thread: any) => (
                    <div
                      key={thread._id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {thread.titel}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {thread.inhoud ? thread.inhoud.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : 'Geen inhoud'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Door: {thread.auteur?.naam || 'Onbekend'}
                          </span>
                          {thread.sticky && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              Sticky
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant={thread.sticky ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleSticky(thread._id)}
                      >
                        {thread.sticky ? (
                          <>
                            <PinOff className="w-3 h-3 mr-1" />
                            Unpin
                          </>
                        ) : (
                          <>
                            <Pin className="w-3 h-3 mr-1" />
                            Pin
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === "users" && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Gebruikers Beheer
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Beheer gebruikersrollen en toegangsrechten. Alleen admins kunnen rollen wijzigen.
                </p>
                
                <div className="space-y-3">
                  {allUsers?.map((user: any) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {user.avatarUrl && (
                          <img
                            src={user.avatarUrl}
                            alt={user.naam}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-foreground">
                            {user.naam}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.functie} {user.organisatie && `bij ${user.organisatie}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {user.role !== "admin" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateUserRole(user._id, "admin")}
                              className="text-xs"
                            >
                              <Crown className="w-3 h-3 mr-1" />
                              Admin
                            </Button>
                          )}
                          {user.role !== "moderator" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateUserRole(user._id, "moderator")}
                              className="text-xs"
                            >
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              Moderator
                            </Button>
                          )}
                          {user.role !== "member" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateUserRole(user._id, "member")}
                              className="text-xs"
                            >
                              <Shield className="w-3 h-3 mr-1" />
                              Member
                            </Button>
                          )}
                          
                          {user._id !== currentUser?._id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!allUsers || allUsers.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      Geen gebruikers gevonden
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Rollen Uitleg
                </h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-600" />
                    <strong>Admin:</strong> Volledige toegang tot alle functies, kan rollen wijzigen en gebruikers beheren
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <strong>Moderator:</strong> Kan content modereren en kanalen beheren
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-600" />
                    <strong>Member:</strong> Standaard gebruiker, kan posts maken en reageren
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BeheerPage() {
  return (
    <ConvexWrapper>
      <BeheerContent />
    </ConvexWrapper>
  );
} 