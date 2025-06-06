"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useConvexQuery, useConvexMutation } from "@/lib/useConvexFunction";
import KanaalSidebar from "@/components/KanaalSidebar";
import ThreadCard from "@/components/ThreadCard";
import CloudinaryAvatarUpload from "@/components/CloudinaryAvatarUpload";
import { loadCloudinaryScript } from "@/components/CloudinaryUpload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Edit,
  Save,
  X,
  Hash,
  MessageSquare,
  Calendar,
  Building,
  Briefcase,
  Tag,
  Mail,
  Shield,
  Crown,
  CheckCircle,
  Linkedin,
  Trash2,
  AlertTriangle,
  Coffee,
  Heart,
  QrCode,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfielPage() {
  // Get current user from Clerk and Convex
  const { user: clerkUser, isLoaded } = useUser();
  const { user: convexUser, isLoading: convexLoading } = useCurrentUser();
  const { signOut } = useClerk();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"threads" | "comments">("threads");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCoffeeDialog, setShowCoffeeDialog] = useState(false);

  // Rotating donation messages - changes daily
  const donationMessages = [
    { emoji: "🍩", text: "Buy me a donut", subtitle: "Voor als debugging iets té lang duurt." },
    { emoji: "🍜", text: "Buy me a ramen", subtitle: "Omdat de AI werkt, maar mijn hersenen leeg zijn." },
    { emoji: "🍕", text: "Buy me a slice", subtitle: "Van pizza, flowlogica of gewoon waardering." },
    { emoji: "🍫", text: "Buy me a chocolate", subtitle: "Voor de bugs die we stilletjes oplossen." },
    { emoji: "🥟", text: "Buy me a dumpling", subtitle: "Kleine moeite, groot comfort." },
    { emoji: "🍪", text: "Buy me a cookie", subtitle: "Zonder tracking, beloofd." },
    { emoji: "🍺", text: "Buy me a beer", subtitle: "Voor na een succesvolle cronjob." },
    { emoji: "🥑", text: "Buy me an avocado", subtitle: "Zodat ik gezond blijf tijdens die promptsessies." },
    { emoji: "🍞", text: "Buy me some bread", subtitle: "Letterlijk en figuurlijk." },
    { emoji: "🧁", text: "Buy me a cupcake", subtitle: "Want soms mag het ook gewoon even leuk zijn." },
    { emoji: "🥤", text: "Buy me a bubble tea", subtitle: "Voor die momenten waarop het even allemaal niet hoeft te kloppen." },
    { emoji: "🥪", text: "Buy me a sandwich", subtitle: "Voor de lunch die ik weer eens oversloeg door een communityvraag." },
  ];

  // Get today's message based on day of year
  const getTodaysMessage = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return donationMessages[dayOfYear % donationMessages.length];
  };

  const todaysMessage = getTodaysMessage();
  
  // Use the convex user data
  const user = convexUser;
  const userThreads = useConvexQuery(
    "threads:getThreadsByAuthor", 
    user ? { auteurId: user._id } : "skip"
  );
  const userComments = useConvexQuery(
    "comments:getCommentsByAuthor", 
    user ? { auteurId: user._id } : "skip"
  );
  
  const updateUser = useConvexMutation("users:updateUser");
  const deleteSelfProfile = useConvexMutation("users:deleteSelfProfile");
  const deleteUser = useConvexMutation("users:deleteUser");
  const deleteUserByClerkId = useConvexMutation("users:deleteUserByClerkId");

  const [editData, setEditData] = useState({
    naam: "",
    functie: "",
    organisatie: "",
    bio: "",
    tags: [] as string[],
    avatarUrl: "",
    linkedinUrl: "",
  });

  // Load Cloudinary script on component mount
  useEffect(() => {
    loadCloudinaryScript();
  }, []);

  const handleStartEdit = () => {
    if (user) {
      setEditData({
        naam: user.naam,
        functie: user.functie,
        organisatie: user.organisatie,
        bio: user.bio,
        tags: user.tags,
        avatarUrl: user.avatarUrl || "",
        linkedinUrl: user.linkedinUrl || "",
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!user) return;
    
    try {
      await updateUser({
        userId: user._id,
        naam: editData.naam,
        functie: editData.functie,
        organisatie: editData.organisatie,
        bio: editData.bio,
        tags: editData.tags,
        avatarUrl: editData.avatarUrl,
        linkedinUrl: editData.linkedinUrl,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Fout bij updaten profiel:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      naam: "",
      functie: "",
      organisatie: "",
      bio: "",
      tags: [],
      avatarUrl: "",
      linkedinUrl: "",
    });
  };

  const handleAvatarUpload = (url: string) => {
    setEditData({
      ...editData,
      avatarUrl: url,
    });
  };

  const handleAvatarRemove = () => {
    setEditData({
      ...editData,
      avatarUrl: "",
    });
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !editData.tags.includes(tag.trim())) {
      setEditData({
        ...editData,
        tags: [...editData.tags, tag.trim()],
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditData({
      ...editData,
      tags: editData.tags.filter(tag => tag !== tagToRemove),
    });
  };

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

  const handleDeleteProfile = async () => {
    if (!user || !clerkUser) return;
    
    setIsDeleting(true);
    try {
      console.log('Starting self-deletion process for user:', user._id);
      
      let result;
      try {
        // Try self-deletion first
        result = await deleteSelfProfile();
        console.log('Convex self-deletion result:', result);
      } catch (selfDeleteError) {
        console.log('Self-deletion failed, trying alternative methods:', selfDeleteError);
        
        try {
          // Try deletion by clerkId (no auth required)
          result = await deleteUserByClerkId({ clerkId: clerkUser.id });
          console.log('ClerkId deletion result:', result);
        } catch (clerkIdDeleteError) {
          console.log('ClerkId deletion failed, trying admin deletion:', clerkIdDeleteError);
          
          // If that fails and user is admin, try admin deletion
          if (user.role === 'admin') {
            result = await deleteUser({ userId: user._id });
            console.log('Admin deletion result:', result);
          } else {
            throw new Error(`Alle delete methodes gefaald: ${selfDeleteError}`);
          }
        }
      }
      
      // Then delete from Clerk
      console.log('Deleting from Clerk...');
      const response = await fetch('/api/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to delete from Clerk:', errorText);
        // Don't throw error here since Convex deletion succeeded
        console.log('Continuing despite Clerk deletion failure');
      } else {
        console.log('Successfully deleted from Clerk');
      }
      
      // Sign out and redirect to homepage immediately
      await signOut();
      
      // Force immediate redirect
      window.location.href = '/';
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert(`Er is een fout opgetreden bij het verwijderen van je profiel: ${error}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };



  if (!isLoaded || !clerkUser) {
    return (
      <div className="flex h-screen">
        <KanaalSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Clerk laden...</p>
            <p className="text-sm text-muted-foreground mt-2">
              isLoaded: {isLoaded ? "true" : "false"}, clerkUser: {clerkUser ? "found" : "not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (convexLoading) {
    return (
      <div className="flex h-screen">
        <KanaalSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Convex gebruiker laden...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Clerk user: {clerkUser.id}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen">
        <KanaalSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Geen Convex gebruiker gevonden</p>
            <p className="text-sm text-muted-foreground mt-2">
              Clerk user: {clerkUser.id}
            </p>
            <p className="text-sm text-muted-foreground">
              Mogelijk is de gebruiker niet gesynchroniseerd met Convex
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "moderator":
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  // Helper function to get role color
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

  return (
    <div className="flex h-screen">
      <KanaalSidebar />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-6 h-6 text-foreground" />
              <h1 className="text-2xl font-bold text-foreground">
                Mijn Profiel
              </h1>
            </div>
            <p className="text-muted-foreground">
              Beheer je profielinformatie en bekijk je bijdragen
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={isEditing ? editData.avatarUrl : user.avatarUrl} />
                  <AvatarFallback className="text-lg">
                    {getInitials(isEditing ? editData.naam : user.naam)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-foreground">
                      {isEditing ? editData.naam : user.naam}
                    </h2>
                    {user.role && (
                      <Badge className={`${getRoleColor(user.role)} border`}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1 capitalize">{user.role}</span>
                      </Badge>
                    )}
                    {clerkUser.emailAddresses[0]?.verification?.status === "verified" && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Geverifieerd
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Mail className="w-4 h-4" />
                    <span>{clerkUser.emailAddresses[0]?.emailAddress || user.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{isEditing ? editData.functie : user.functie || "Geen functie opgegeven"}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Building className="w-4 h-4" />
                    <span>{isEditing ? editData.organisatie : user.organisatie || "Geen organisatie opgegeven"}</span>
                  </div>
                  
                  {(user.linkedinUrl || (isEditing && editData.linkedinUrl)) && (
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Linkedin className="w-4 h-4" />
                      {isEditing ? (
                        <span>{editData.linkedinUrl || "Geen LinkedIn URL opgegeven"}</span>
                      ) : (
                        <a 
                          href={user.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          LinkedIn Profiel
                        </a>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>Lid sinds {new Date(user._creationTime).toLocaleDateString('nl-NL')}</span>
                  </div>
                  
                  {clerkUser.createdAt && (
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <User className="w-4 h-4" />
                      <span>Account aangemaakt {new Date(clerkUser.createdAt).toLocaleDateString('nl-NL')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                onClick={isEditing ? handleCancelEdit : handleStartEdit}
                variant={isEditing ? "outline" : "default"}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Annuleren
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Bewerken
                  </>
                )}
              </Button>
            </div>

            {isEditing && (
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold text-foreground mb-4">Profielafbeelding</h3>
                <CloudinaryAvatarUpload
                  onUpload={handleAvatarUpload}
                  onRemove={handleAvatarRemove}
                  currentImage={editData.avatarUrl}
                  userName={editData.naam}
                  disabled={false}
                />
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-semibold text-foreground mb-2">Bio</h3>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  className="w-full p-3 border border-border rounded-md text-sm resize-none"
                  rows={5}
                  placeholder="Vertel iets over jezelf...

Tip: Gebruik Enter voor nieuwe alinea's!"
                />
              ) : (
                <div className="text-muted-foreground">
                  {user.bio ? formatBioWithLineBreaks(user.bio) : "Geen bio opgegeven"}
                </div>
              )}
            </div>

            {/* Account Information Section */}
            <div className="mb-4">
              <h3 className="font-semibold text-foreground mb-2">Account Informatie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-foreground">{clerkUser.emailAddresses[0]?.emailAddress}</span>
                  {clerkUser.emailAddresses[0]?.verification?.status === "verified" && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                
                {clerkUser.phoneNumbers && clerkUser.phoneNumbers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Telefoon:</span>
                    <span className="text-foreground">{clerkUser.phoneNumbers[0]?.phoneNumber}</span>
                    {clerkUser.phoneNumbers[0]?.verification?.status === "verified" && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Gebruikers ID:</span>
                  <span className="text-foreground font-mono text-xs">{clerkUser.id}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Laatste login:</span>
                  <span className="text-foreground">
                    {clerkUser.lastSignInAt ? new Date(clerkUser.lastSignInAt).toLocaleDateString('nl-NL') : 'Onbekend'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-foreground mb-2">Expertise Tags</h3>
              {isEditing ? (
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    placeholder="Voeg tag toe en druk Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                  {user.tags.length === 0 && (
                    <p className="text-muted-foreground text-sm">Geen tags opgegeven</p>
                  )}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="naam">Naam</Label>
                    <Input
                      id="naam"
                      value={editData.naam}
                      onChange={(e) => setEditData({...editData, naam: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="functie">Functie</Label>
                    <Input
                      id="functie"
                      value={editData.functie}
                      onChange={(e) => setEditData({...editData, functie: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="organisatie">Organisatie</Label>
                    <Input
                      id="organisatie"
                      value={editData.organisatie}
                      onChange={(e) => setEditData({...editData, organisatie: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input
                      id="linkedinUrl"
                      value={editData.linkedinUrl}
                      onChange={(e) => setEditData({...editData, linkedinUrl: e.target.value})}
                      placeholder="https://linkedin.com/in/jouw-profiel"
                    />
                  </div>
                </div>
                
                <Button onClick={handleSaveEdit} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Wijzigingen Opslaan
                </Button>
              </div>
            )}
          </div>

          {/* Daily Rotating Donation Section */}
          <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 border border-orange-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-2xl mt-0.5">{todaysMessage.emoji}</div>
              <div>
                <h3 className="font-semibold text-orange-900 mb-1 flex items-center gap-2">
                  {todaysMessage.text}
                  <Heart className="w-4 h-4 text-red-500" />
                </h3>
                <p className="text-orange-800 text-sm mb-1">
                  {todaysMessage.subtitle}
                </p>
                <p className="text-orange-700 text-xs italic">
                  Deze community draait volledig op vrijwillige inzet. Wil je iets terugdoen?
                </p>
              </div>
            </div>
            
            <Dialog open={showCoffeeDialog} onOpenChange={setShowCoffeeDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-0 shadow-md">
                  <span className="text-lg mr-2">{todaysMessage.emoji}</span>
                  {todaysMessage.text}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 border-orange-200">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-orange-900">
                    <span className="text-2xl">{todaysMessage.emoji}</span>
                    {todaysMessage.text}
                    <Heart className="w-5 h-5 text-red-500" />
                  </DialogTitle>
                  <DialogDescription className="text-orange-800">
                    <div className="mb-2 font-medium">{todaysMessage.subtitle}</div>
                    <div className="text-sm">Deze community draait volledig op vrijwillige inzet. Geen sponsoring, geen verdienmodel — alleen tijd, aandacht en toewijding.</div>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-6 text-center">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-200 mb-4">
                    <div className="flex justify-center mb-4">
                      <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-300">
                        <img 
                          src="/buymeacoffee.png" 
                          alt="Buy Me a Coffee QR Code" 
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <QrCode className="w-5 h-5 text-orange-600" />
                      <span className="font-medium text-orange-900">Scan de QR-code</span>
                    </div>
                    
                    <p className="text-sm text-orange-700 mb-4">
                      Of open de link direct in je browser
                    </p>
                    
                    <Button 
                      onClick={() => window.open('https://buymeacoffee.com/automatiserenkunjeleren', '_blank')}
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white w-full"
                    >
                      <span className="text-lg mr-2">{todaysMessage.emoji}</span>
                      {todaysMessage.text}
                    </Button>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border border-green-200">
                    <p className="text-green-800 text-sm font-medium flex items-center justify-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Alles gaat rechtstreeks naar de moderators die de community draaiend houden
                      <Heart className="w-4 h-4 text-red-500" />
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowCoffeeDialog(false)}
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    Sluiten
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Account Settings - Delete Profile */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Account Verwijderen</h3>
                <p className="text-gray-700 text-sm">
                  Het verwijderen van je profiel is permanent en kan niet ongedaan worden gemaakt.
                </p>
              </div>
            </div>
            
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Profiel Verwijderen
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Profiel Verwijderen
                  </DialogTitle>
                  <DialogDescription>
                    Weet je zeker dat je je profiel wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Dit zal het volgende permanent verwijderen:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Je account en profielinformatie</li>
                    <li>• Alle threads die je hebt gemaakt</li>
                    <li>• Alle reacties die je hebt geplaatst</li>
                    <li>• Alle polls die je hebt gemaakt</li>
                    <li>• Je upvotes en andere interacties</li>
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
                    onClick={handleDeleteProfile}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? "Verwijderen..." : "Ja, Verwijderen"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant={selectedTab === "threads" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTab("threads")}
              >
                <Hash className="w-4 h-4 mr-1" />
                Mijn Threads ({userThreads?.length || 0})
              </Button>
              <Button
                variant={selectedTab === "comments" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTab("comments")}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Mijn Reacties ({userComments?.length || 0})
              </Button>
            </div>
          </div>

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
                      Nog geen threads gemaakt
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Je hebt nog geen threads geplaatst in de community
                    </p>
                    <Button onClick={() => window.location.href = '/nieuw'}>
                      Eerste Thread Maken
                    </Button>
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
                              <div className="text-sm text-muted-foreground">
                                In thread: {comment.thread.titel}
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
                      Nog geen reacties geplaatst
                    </h3>
                    <p className="text-muted-foreground">
                      Je hebt nog geen reacties achtergelaten op threads
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