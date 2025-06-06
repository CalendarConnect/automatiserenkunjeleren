"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import KanaalSidebar from "@/components/KanaalSidebar";
import { 
  ArrowRight, 
  Users, 
  MessageSquare, 
  BookOpen, 
  Zap, 
  Shield, 
  Brain,
  TrendingUp,
  Calendar,
  Star,
  Activity,
  Hash,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  Pin,
  Share2,
  ExternalLink,
  Bell,
  Lightbulb,
  Network
} from "lucide-react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useViewAwareAdmin } from "@/lib/useViewAwareRole";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import OnboardingCheck from "@/components/OnboardingCheck";

export default function CommunityPage() {
  const { isLoaded, isSignedIn } = useUser();
  const { isAdmin } = useViewAwareAdmin();
  const channels = useQuery(api.channels.getVisibleChannelsWithSecties);
  const users = useQuery(api.users.getAllUsers);
  const allThreads = useQuery(api.threads.getAllThreads);
  const recentThreads = useQuery(api.threads.getRecentThreads, { limit: 6 });

  // Group channels by section
  const channelsBySection = channels?.reduce((acc: any, channel: any) => {
    const sectionName = channel.sectie?.naam || "Overig";
    if (!acc[sectionName]) {
      acc[sectionName] = {
        sectie: channel.sectie,
        channels: []
      };
    }
    acc[sectionName].channels.push(channel);
    return acc;
  }, {}) || {};

  const stats = [
    {
      label: "Community Members",
      value: users?.length || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: "+12 deze week",
      changeColor: "text-green-600"
    },
    {
      label: "Actieve Discussies",
      value: allThreads?.length || 0,
      icon: MessageSquare,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      change: "+8 vandaag",
      changeColor: "text-green-600"
    },
    {
      label: "Kanalen",
      value: channels?.length || 0,
      icon: Hash,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      change: "Actief",
      changeColor: "text-purple-600"
    },
    {
      label: "Deze Week",
      value: recentThreads?.length || 0,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      change: "Nieuwe posts",
      changeColor: "text-orange-600"
    }
  ];

  const getChannelIcon = (type?: string) => {
    switch (type) {
      case "discussie":
        return <Hash className="w-4 h-4" />;
      case "templates":
        return <FileText className="w-4 h-4" />;
      case "modules":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  const getChannelColorClass = (slug?: string) => {
    if (!slug) return 'border-gray-200 hover:border-gray-300';
    
    if (['welkom', 'toegang-krijgen', 'voorstellen'].includes(slug)) {
      return 'border-red-200 hover:border-red-300 bg-red-50/30';
    }
    if (['vps-installatie', 'open-webui-modellen', 'n8n-automatisering', 'beveiliging-hosting', 'debugging'].includes(slug)) {
      return 'border-blue-200 hover:border-blue-300 bg-blue-50/30';
    }
    if (['marketing-content', 'zorg-welzijn', 'onderwijs-training', 'mkb'].includes(slug)) {
      return 'border-green-200 hover:border-green-300 bg-green-50/30';
    }
    if (['eigen-beheer-uitbesteden', 'wetgeving-ethiek', 'model-keuzes', 'toekomst-agents'].includes(slug)) {
      return 'border-purple-200 hover:border-purple-300 bg-purple-50/30';
    }
    if (['werkende-voorbeelden', 'n8n-flows', 'dockerfiles-scripts', 'prompt-voorbeelden'].includes(slug)) {
      return 'border-yellow-200 hover:border-yellow-300 bg-yellow-50/30';
    }
    if (['feedback-gevraagd', 'vraag-antwoord', 'community-updates', 'voorstellen-uitbreiding'].includes(slug)) {
      return 'border-indigo-200 hover:border-indigo-300 bg-indigo-50/30';
    }
    
    return 'border-gray-200 hover:border-gray-300';
  };

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    redirect("/automatiseren-kun-je-leren");
    return null;
  }

    return (
    <OnboardingCheck>
      <div className="flex h-screen bg-gray-50/30">
        <KanaalSidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6 lg:mb-8">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2">
                      Welkom terug, <span className="text-primary">Keyholder</span>! 👋
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600">
                      Wat ga je vandaag leren over AI automatisering?
                    </p>
                  </div>
                  <div className="flex justify-center sm:justify-end">
                    <Link href="/nieuw">
                      <button className="bg-primary text-white px-4 sm:px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl">
                        <Sparkles className="w-5 h-5" />
                        Nieuwe discussie
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-2 lg:mb-4">
                          <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-gradient-to-r ${stat.color}`}>
                            <Icon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                          </div>
                          <div className={`px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full text-xs font-medium ${stat.bgColor} ${stat.textColor}`}>
                            <span className="hidden sm:inline">{stat.change}</span>
                            <span className="sm:hidden">+</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Kanalen per Sectie */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
              <div className="space-y-8 lg:space-y-12">
                {Object.entries(channelsBySection)
                  .sort(([, a], [, b]) => ((a as any).sectie?.volgorde || 999) - ((b as any).sectie?.volgorde || 999))
                  .map(([sectionName, group]: [string, any], index: number) => (
                    <div key={sectionName}>
                      {/* Uitnodiging sectie - alleen voor de eerste sectie (Startpunt) */}
                      {index === 0 && (
                        <div className="mb-12">
                          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border border-blue-200 p-6 lg:p-8">
                            <div className="text-center mb-8">
                              <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
                                <Network className="w-6 h-6 text-white" />
                              </div>
                              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                                Nodig je netwerk uit om deel te nemen aan de gratis NL AI community! 🚀
                              </h2>
                              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Help andere ondernemers ontdekken hoe ze AI kunnen implementeren met behoud van controle over hun data
                              </p>
                            </div>

                            {/* Perks */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                              <div className="bg-white/60 rounded-xl p-4 text-center">
                                <div className="inline-flex p-2 rounded-lg bg-blue-100 mb-3">
                                  <Bell className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Blijf op de hoogte</h3>
                                <p className="text-sm text-gray-600">Krijg updates over nieuwe AI-tools, implementaties en best practices</p>
                              </div>
                              
                              <div className="bg-white/60 rounded-xl p-4 text-center">
                                <div className="inline-flex p-2 rounded-lg bg-purple-100 mb-3">
                                  <Lightbulb className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Leer van experts</h3>
                                <p className="text-sm text-gray-600">Toegang tot praktijkervaringen en werkende voorbeelden van andere MKB'ers</p>
                              </div>
                              
                              <div className="bg-white/60 rounded-xl p-4 text-center">
                                <div className="inline-flex p-2 rounded-lg bg-green-100 mb-3">
                                  <Shield className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Privacy-first</h3>
                                <p className="text-sm text-gray-600">Leer hoe je AI implementeert zonder vendor lock-in en met volledige datacontrole</p>
                              </div>
                            </div>

                            {/* Social Share Buttons */}
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-700 mb-4">Deel met je netwerk:</p>
                              <div className="flex flex-wrap justify-center gap-3">
                                <button 
                                  onClick={() => {
                                    const text = "Ontdek de gratis NL AI community! 🚀\n\nLeer hoe je AI implementeert met behoud van controle over je data. Praktijkervaringen van MKB-ondernemers die AI succesvol hebben geïmplementeerd.\n\n✅ Privacy-first aanpak\n✅ Geen vendor lock-in\n✅ Open source tools\n✅ Werkende voorbeelden\n\n#AI #MKB #Nederland #Automatisering";
                                    const url = "https://www.automatiserenkunjeleren.nl";
                                    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text + "\n\n" + url)}`, '_blank');
                                  }}
                                  className="flex items-center gap-2 bg-[#0077B5] text-white px-4 py-2 rounded-lg hover:bg-[#005885] transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  LinkedIn
                                </button>
                                
                                <button 
                                  onClick={() => {
                                    const text = "Ontdek de gratis NL AI community! 🚀 Leer hoe je AI implementeert met behoud van controle over je data. #AI #MKB #Nederland";
                                    const url = "https://www.automatiserenkunjeleren.nl";
                                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                                  }}
                                  className="flex items-center gap-2 bg-[#1DA1F2] text-white px-4 py-2 rounded-lg hover:bg-[#0d8bd9] transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Twitter
                                </button>
                                
                                <button 
                                  onClick={() => {
                                    const url = "https://www.automatiserenkunjeleren.nl";
                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                                  }}
                                  className="flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-lg hover:bg-[#166fe5] transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Facebook
                                </button>
                                
                                <button 
                                  onClick={() => {
                                    const text = "Ontdek de gratis NL AI community! Leer hoe je AI implementeert met behoud van controle over je data.";
                                    const url = "https://www.automatiserenkunjeleren.nl";
                                    if (navigator.share) {
                                      navigator.share({ title: 'Automatiseren Kun Je Leren - NL AI Community', text, url });
                                    } else {
                                      navigator.clipboard.writeText(`${text} ${url}`);
                                      alert('Link gekopieerd naar klembord!');
                                    }
                                  }}
                                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                  <Share2 className="w-4 h-4" />
                                  Delen
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Section Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl">{group.sectie?.emoji}</span>
                        <div>
                          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            {sectionName}
                          </h2>
                          <p className="text-gray-600 mt-1">{group.sectie?.beschrijving}</p>
                        </div>
                      </div>

                      {/* Channels Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {group.channels.map((channel: any) => (
                          <Link key={channel._id} href={`/kanaal/${channel.slug}`}>
                            <div className="bg-white rounded-xl border border-gray-200 p-6 h-full hover:border-primary/30 hover:shadow-lg transition-all duration-200 group">
                              <div className="flex items-start justify-between mb-4">
                                <div 
                                  className="p-3 rounded-lg border"
                                  style={{ 
                                    backgroundColor: group.sectie?.kleur + '20', 
                                    borderColor: group.sectie?.kleur + '40',
                                    color: group.sectie?.kleur 
                                  }}
                                >
                                  {getChannelIcon(channel.type)}
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              
                              <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                {channel.naam}
                              </h3>
                              
                              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                {channel.beschrijving}
                              </p>

                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${
                                  channel.type === 'discussie' && "bg-blue-50 text-blue-700 border-blue-200"
                                } ${
                                  channel.type === 'templates' && "bg-purple-50 text-purple-700 border-purple-200"
                                } ${
                                  channel.type === 'modules' && "bg-green-50 text-green-700 border-green-200"
                                }`}>
                                  {channel.type}
                                </span>
                                
                                {channel.stickyPosts?.length > 0 && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Pin className="w-3 h-3" />
                                    {channel.stickyPosts.length}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OnboardingCheck>
  );
} 