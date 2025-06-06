"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Hash, FileText, BookOpen, Search, User, ChevronDown, ChevronRight, Plus, Settings, Menu, X, Eye, EyeOff, Coffee, Heart, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useViewAwareAdmin } from "@/lib/useViewAwareRole";

export default function KanaalSidebar() {
  const { isAdmin } = useViewAwareAdmin();
  
  // Use different queries based on admin status
  const allChannels = useQuery(api.channels.getAllChannels, isAdmin ? {} : "skip");
  const visibleChannels = useQuery(api.channels.getVisibleChannels, !isAdmin ? {} : "skip");
  
  // Select the appropriate channels based on admin status
  const channels = isAdmin ? allChannels : visibleChannels;
  
  const liveSecties = useQuery(api.secties.getSectiesByStatus, { status: "live" });
  const allSecties = useQuery(api.secties.getAllSecties, isAdmin ? {} : "skip"); // Voor het vinden van sectie per kanaal
  
  // Use appropriate sections based on admin status
  const sectiesForLookup = isAdmin ? allSecties : liveSecties;
  const pathname = usePathname();
  
  // State voor welke categorieën uitgevouwen zijn (persistent via localStorage)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // State voor het in/uitklappen van de hele sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // State voor donatie dialog
  const [showDonationDialog, setShowDonationDialog] = useState(false);

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

  // Laad de expanded state uit localStorage bij mount
  useEffect(() => {
    const savedState = localStorage.getItem('kanaal-sidebar-expanded');
    const savedCollapsed = localStorage.getItem('kanaal-sidebar-collapsed');
    
    // Laad collapsed state
    if (savedCollapsed) {
      setIsCollapsed(JSON.parse(savedCollapsed));
    }
    
    // Laad expanded categories
    if (savedState) {
      try {
        setExpandedCategories(JSON.parse(savedState));
      } catch (e) {
        // Fallback naar default waarden
        setExpandedCategories({
          "Startpunt": true,
          "Infrastructuur": true,
          "Sectoren": false,
          "Strategie": false,
          "Templates": false,
          "Organisatie": false,
        });
      }
    } else {
      // Default waarden
      setExpandedCategories({
        "Startpunt": true,
        "Infrastructuur": true,
        "Sectoren": false,
        "Strategie": false,
        "Templates": false,
        "Organisatie": false,
      });
    }
  }, []);

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "discussie":
        return <Hash className="w-3.5 h-3.5" />;
      case "templates":
        return <FileText className="w-3.5 h-3.5" />;
      case "modules":
        return <BookOpen className="w-3.5 h-3.5" />;
      default:
        return <Hash className="w-3.5 h-3.5" />;
    }
  };

  const getSectieFromChannel = (channel: any) => {
    // Als er een sectieId is, zoek de bijbehorende sectie in de juiste secties lijst
    if (channel.sectieId && sectiesForLookup) {
      const sectie = sectiesForLookup.find(s => s._id === channel.sectieId);
      if (sectie) {
        return sectie;
      }
    }
    
    // Fallback voor kanalen zonder sectie - zoek "Overig" sectie in de juiste lijst
    const overigSectie = sectiesForLookup?.find(s => s.naam === 'Overig');
    return overigSectie || { naam: 'Ongegroepeerd', emoji: '📋', kleur: '#6B7280' };
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newState = {
        ...prev,
        [category]: !prev[category]
      };
      // Sla de nieuwe state op in localStorage
      localStorage.setItem('kanaal-sidebar-expanded', JSON.stringify(newState));
      return newState;
    });
  };

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const newCollapsed = !prev;
      localStorage.setItem('kanaal-sidebar-collapsed', JSON.stringify(newCollapsed));
      return newCollapsed;
    });
  };

  const groupedChannels = channels?.reduce((acc, channel) => {
    const sectie = getSectieFromChannel(channel);
    
    // Show channels if:
    // 1. Section is from our filtered list (already respects admin status)
    // 2. Fallback section "Ongegroepeerd" (only visible to admins)
    const shouldShowSection = 
      ('status' in sectie) || // Section from database (already filtered by admin status)
      (sectie.naam === 'Ongegroepeerd' && isAdmin); // System fallback section (admin only)
    
    // Channel visibility logic:
    // 1. For regular users: only show visible channels
    // 2. For admins: show all channels (visible and hidden)
    const shouldShowChannel = isAdmin || (channel.visible !== false);
    
    if (shouldShowSection && shouldShowChannel) {
      const sectionName = sectie.naam;
      if (!acc[sectionName]) {
        acc[sectionName] = {
          sectie: sectie,
          channels: []
        };
      }
      acc[sectionName].channels.push(channel);
    }
    
    return acc;
  }, {} as Record<string, { sectie: any, channels: any[] }>) || {};

  // Sorteer de secties op volgorde
  const sortedSections = Object.entries(groupedChannels).sort(([nameA, groupA], [nameB, groupB]) => {
    const sectieA = groupA.sectie;
    const sectieB = groupB.sectie;
    return (sectieA.volgorde || 999) - (sectieB.volgorde || 999);
  });

  if (!channels) {
    return (
      <div className="w-72 bg-gray-50/50 border-r border-gray-200 p-6">
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-gray-50/50 border-r border-gray-200 flex flex-col h-screen transition-all duration-300",
      isCollapsed ? "w-12" : "w-72"
    )}>
      {/* Logo Section */}
      <div className="border-b border-gray-200 relative">
        {!isCollapsed && (
          <div className="p-6">
            <Link href="/community" className="block">
              <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                Automatiseren<br />kun je leren
              </h1>
            </Link>
            <p className="text-sm text-gray-600 mt-1">AI MKB Nederland Community</p>
          </div>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "absolute top-4 bg-white border border-gray-300 rounded-md p-1.5 hover:bg-gray-50 transition-colors shadow-sm",
            isCollapsed ? "left-2" : "right-4"
          )}
          title={isCollapsed ? "Menu uitklappen" : "Menu inklappen"}
        >
          {isCollapsed ? (
            <Menu className="w-4 h-4 text-gray-600" />
          ) : (
            <X className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto p-4">
        {isCollapsed ? (
          // Collapsed view: alleen emoji's van secties
          <div className="space-y-2 pt-8">
            {sortedSections.map(([sectionName, group]) => {
              if (group.channels.length === 0) return null;
              
              const sectie = group.sectie;
              
              return (
                <button
                  key={sectionName}
                  onClick={() => {
                    // Klap sidebar uit en open de specifieke sectie
                    setIsCollapsed(false);
                    localStorage.setItem('kanaal-sidebar-collapsed', JSON.stringify(false));
                    
                    // Zorg ervoor dat deze sectie open is
                    setExpandedCategories(prev => {
                      const newState = {
                        ...prev,
                        [sectionName]: true
                      };
                      localStorage.setItem('kanaal-sidebar-expanded', JSON.stringify(newState));
                      return newState;
                    });
                  }}
                  className="w-full flex justify-center p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title={`${sectionName} - Klik om te openen`}
                >
                  <span className="text-lg">{sectie.emoji}</span>
                </button>
              );
            })}
          </div>
        ) : (
          // Expanded view: volledige secties en kanalen
          <div className="space-y-6">
            {sortedSections.map(([sectionName, group]) => {
              if (group.channels.length === 0) return null;
              
              const isExpanded = expandedCategories[sectionName];
              const sectie = group.sectie;
              
              return (
                <div key={sectionName}>
                  <button
                    onClick={() => toggleCategory(sectionName)}
                    className="flex items-center gap-2 w-full group"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <ChevronRight className={cn(
                        "w-3 h-3 text-gray-400 transition-transform duration-200",
                        isExpanded && "rotate-90"
                      )} />
                      <span className="text-base select-none">{sectie.emoji}</span>
                      <span 
                        className={cn(
                          "text-sm font-semibold",
                          'status' in sectie && sectie.status === 'draft' ? "opacity-60" : ""
                        )}
                        style={{ color: sectie.kleur }}
                      >
                        {sectionName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Draft indicator for admins */}
                      {'status' in sectie && sectie.status === 'draft' && isAdmin && (
                        <span title="Draft sectie - alleen zichtbaar voor admins">
                          <EyeOff className="w-3 h-3 text-gray-400" />
                        </span>
                      )}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-2 ml-7 space-y-1">
                      {group.channels
                        .sort((a, b) => (a.volgorde || 0) - (b.volgorde || 0)) // Sort by order
                        .map((channel) => {
                          const isActive = pathname === `/kanaal/${channel.slug}`;
                          const isHidden = channel.visible === false;
                          
                          return (
                            <Link
                              key={channel._id}
                              href={`/kanaal/${channel.slug}`}
                              className={cn(
                                "nav-item-modern",
                                isActive && "nav-item-active",
                                isHidden && "opacity-60"
                              )}
                            >
                              <span className="text-gray-400">
                                {getChannelIcon(channel.type)}
                              </span>
                              <span className="truncate text-sm">{channel.naam}</span>
                              {/* Show eye icon for hidden channels (admin only) */}
                              {isAdmin && isHidden && (
                                <span className="ml-auto" title="Verborgen kanaal">
                                  <EyeOff className="w-3 h-3 text-gray-400" />
                                </span>
                              )}
                            </Link>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <Link
          href="/zoeken"
          className={cn(
            isCollapsed ? "flex justify-center p-2" : "nav-item-modern",
            pathname === "/zoeken" && "nav-item-active"
          )}
          title="Zoeken"
        >
          <Search className="w-4 h-4" />
          {!isCollapsed && <span>Zoeken</span>}
        </Link>
        
        <Link
          href="/nieuw"
          className={cn(
            isCollapsed ? "flex justify-center p-2 text-primary hover:bg-primary/10" : "nav-item-modern text-primary hover:bg-primary/10",
            pathname === "/nieuw" && "bg-primary/10"
          )}
          title="Nieuwe thread"
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span className="font-medium">Nieuwe thread</span>}
        </Link>
        
        {!isCollapsed && <div className="h-px bg-gray-200 my-2" />}
        
        {isAdmin && (
          <Link
            href="/gebruikers"
            className={cn(
              isCollapsed ? "flex justify-center p-2" : "nav-item-modern",
              pathname === "/gebruikers" && "nav-item-active"
            )}
            title="Gebruikers"
          >
            <User className="w-4 h-4" />
            {!isCollapsed && <span>Gebruikers</span>}
          </Link>
        )}
        
        <Link
          href="/profiel"
          className={cn(
            isCollapsed ? "flex justify-center p-2" : "nav-item-modern",
            pathname === "/profiel" && "nav-item-active"
          )}
          title="Mijn Profiel"
        >
          <User className="w-4 h-4" />
          {!isCollapsed && <span>Mijn Profiel</span>}
        </Link>

        {/* Sparkly Donation Button */}
        <Dialog open={showDonationDialog} onOpenChange={setShowDonationDialog}>
          <DialogTrigger asChild>
            <button
              className={cn(
                "relative overflow-hidden group transition-all duration-300 hover:scale-105",
                isCollapsed 
                  ? "flex justify-center p-2 rounded-md" 
                  : "flex items-center gap-2 w-full px-3 py-2 rounded-md text-left"
              )}
              style={{
                background: isCollapsed 
                  ? "linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff)" 
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
                backgroundSize: "300% 300%",
                animation: "sparkle-gradient 3s ease infinite, sparkle-pulse 2s ease-in-out infinite alternate"
              }}
              title={isCollapsed ? todaysMessage.text : undefined}
            >
              {/* Sparkle overlay */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: "0s" }} />
                <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
                <div className="absolute bottom-1 left-2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: "1s" }} />
                <div className="absolute bottom-2 right-1 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: "1.5s" }} />
                {!isCollapsed && (
                  <>
                    <div className="absolute top-3 left-1/2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: "0.25s" }} />
                    <div className="absolute bottom-3 left-1/3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: "0.75s" }} />
                  </>
                )}
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex items-center gap-2 text-white font-medium">
                <span className="text-lg animate-bounce" style={{ animationDelay: "0.1s" }}>
                  {todaysMessage.emoji}
                </span>
                {!isCollapsed && (
                  <span className="text-sm truncate group-hover:text-yellow-200 transition-colors">
                    {todaysMessage.text}
                  </span>
                )}
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
            </button>
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
                  <Sparkles className="w-5 h-5 text-orange-600" />
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
                onClick={() => setShowDonationDialog(false)}
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                Sluiten
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {isAdmin && (
          <Link
            href="/beheer"
            className={cn(
              isCollapsed ? "flex justify-center p-2" : "nav-item-modern",
              pathname === "/beheer" && "nav-item-active"
            )}
            title="Beheer"
          >
            <Settings className="w-4 h-4" />
            {!isCollapsed && <span>Beheer</span>}
          </Link>
        )}
      </div>
    </div>
  );
} 