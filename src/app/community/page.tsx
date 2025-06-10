"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import KanaalSidebar from "@/components/KanaalSidebar";
import ConvexWrapper from "@/components/ConvexWrapper";
import { 
  ArrowRight, 
  Users, 
  MessageSquare, 
  BookOpen, 
  Zap, 
  Shield, 
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
import { SignInButton } from "@clerk/nextjs";
import { useViewAwareAdmin } from "@/lib/useViewAwareRole";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import OnboardingCheck from "@/components/OnboardingCheck";
import TopNavigation from "@/components/TopNavigation";

// Onboarding Module Component
function OnboardingModule() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  
  // Get onboarding progress from Convex
  const onboardingProgress = useQuery(api.users.getOnboardingProgress);
  const updateOnboardingStep = useMutation(api.users.updateOnboardingStep);
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  // Don't show module if onboarding is completed
  if (onboardingProgress?.completed) {
    return null;
  }

  const completedSteps = onboardingProgress?.steps || {
    shared: false,
    introduced: false,
    prompt: false
  };

  const toggleStep = async (step: keyof typeof completedSteps) => {
    try {
      // Check if this step completion will complete all steps
      const newSteps = { ...completedSteps, [step]: !completedSteps[step] };
      const willBeCompleted = Object.values(newSteps).every(Boolean);
      const wasAlreadyCompleted = Object.values(completedSteps).every(Boolean);
      
      const result = await updateOnboardingStep({
        step,
        completed: !completedSteps[step],
      });
      
      // Show confetti if we just completed all steps for the first time
      if (willBeCompleted && !wasAlreadyCompleted && !showCompletion) {
        setShowConfetti(true);
        setShowCompletion(true);
        // Hide confetti after animation and complete onboarding
        setTimeout(() => {
          setShowConfetti(false);
          // Complete onboarding after confetti is done
          setTimeout(async () => {
            await completeOnboarding();
          }, 500);
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating onboarding step:", error);
    }
  };

  const shareOnLinkedIn = () => {
    const text = "Ontdek de gratis NL AI community! 🚀\n\nLeer hoe je AI implementeert met behoud van controle over je data. Praktijkervaringen van MKB-ondernemers die AI succesvol hebben geïmplementeerd.\n\n✅ Privacy-first aanpak\n✅ Geen vendor lock-in\n✅ Open source tools\n✅ Werkende voorbeelden\n\n#AI #MKB #Nederland #Automatisering";
    const url = "https://www.automatiserenkunjeleren.nl";
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text + "\n\n" + url)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const text = "Ontdek de gratis NL AI community! 🚀 Leer hoe je AI implementeert met behoud van controle over je data. #AI #MKB #Nederland";
    const url = "https://www.automatiserenkunjeleren.nl";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = "https://www.automatiserenkunjeleren.nl";
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareGeneric = () => {
    const text = "Ontdek de gratis NL AI community! Leer hoe je AI implementeert met behoud van controle over je data.";
    const url = "https://www.automatiserenkunjeleren.nl";
    if (navigator.share) {
      navigator.share({ title: 'Automatiseren Kun Je Leren - NL AI Community', text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('Link gekopieerd naar klembord!');
    }
  };



  return (
    <>
      {/* Full Screen Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes confetti-fall {
                0% {
                  transform: translateY(-10px) rotate(0deg);
                  opacity: 1;
                }
                100% {
                  transform: translateY(100vh) rotate(720deg);
                  opacity: 0;
                }
              }
            `
          }} />
          {[...Array(50)].map((_, i) => {
            const colors = ['bg-yellow-400', 'bg-orange-400', 'bg-amber-400', 'bg-red-400', 'bg-pink-400', 'bg-purple-400', 'bg-blue-400', 'bg-green-400'];
            const shapes = ['rounded-full', 'rounded-sm', 'rounded-none'];
            const sizes = ['w-2 h-2', 'w-3 h-3', 'w-1 h-4', 'w-4 h-1'];
            
            return (
              <div
                key={i}
                className={`absolute ${colors[Math.floor(Math.random() * colors.length)]} ${shapes[Math.floor(Math.random() * shapes.length)]} ${sizes[Math.floor(Math.random() * sizes.length)]}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  animation: `confetti-fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s forwards`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            );
          })}
        </div>
      )}
      
      <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-2xl p-6 lg:p-8 mb-12 border border-yellow-100 relative">
        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Step 1: Share */}
          <div className="bg-white/70 rounded-xl p-6 border border-yellow-200/50">
            <div className="flex items-start gap-3 mb-4">
              <button
                onClick={() => toggleStep('shared')}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all ${
                  completedSteps.shared 
                    ? 'bg-yellow-400 border-yellow-400 text-white' 
                    : 'border-gray-300 hover:border-yellow-400'
                }`}
              >
                {completedSteps.shared && (
                  <svg className="w-3 h-3 m-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <span className="text-xl">📨</span>
            </div>
            
            <h3 className="font-medium text-gray-900 mb-2">Deel de community</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Hoe meer mensen hier meebouwen, hoe meer er te leren valt.
              Ken je iemand die ook iets met AI doet? Stuur 'm deze plek door.
              Iedereen is welkom, gewoon zoals je bent.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={shareOnLinkedIn}
                className="text-xs bg-[#0077B5] text-white px-3 py-1.5 rounded-lg hover:bg-[#005885] transition-colors flex items-center gap-1"
              >
                📤 LinkedIn
              </button>
              <button 
                onClick={shareOnTwitter}
                className="text-xs bg-[#1DA1F2] text-white px-3 py-1.5 rounded-lg hover:bg-[#0d8bd9] transition-colors"
              >
                Twitter
              </button>
              <button 
                onClick={shareOnFacebook}
                className="text-xs bg-[#1877F2] text-white px-3 py-1.5 rounded-lg hover:bg-[#166fe5] transition-colors"
              >
                Facebook
              </button>
              <button 
                onClick={shareGeneric}
                className="text-xs bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Delen
              </button>
            </div>
            
            <label className="flex items-center gap-2 mt-3 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={completedSteps.shared}
                onChange={() => toggleStep('shared')}
                className="sr-only"
              />
              Ik heb iemand uitgenodigd
            </label>
          </div>

          {/* Step 2: Introduce */}
          <div className="bg-white/70 rounded-xl p-6 border border-yellow-200/50">
            <div className="flex items-start gap-3 mb-4">
              <button
                onClick={() => toggleStep('introduced')}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all ${
                  completedSteps.introduced 
                    ? 'bg-yellow-400 border-yellow-400 text-white' 
                    : 'border-gray-300 hover:border-yellow-400'
                }`}
              >
                {completedSteps.introduced && (
                  <svg className="w-3 h-3 m-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <span className="text-xl">👋</span>
            </div>
            
            <h3 className="font-medium text-gray-900 mb-2">Zeg even hallo</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Je hoeft geen heel verhaal te typen. Gewoon: wie je bent, waar je mee bezig bent.
              De rest volgt vanzelf.
            </p>
            
            <Link href="/kanaal/introduceer-jezelf">
              <button className="text-xs bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-1 mb-3">
                🗣️ Ga naar voorstelkanaal
              </button>
            </Link>
            
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={completedSteps.introduced}
                onChange={() => toggleStep('introduced')}
                className="sr-only"
              />
              Ik heb mezelf voorgesteld
            </label>
          </div>

          {/* Step 3: Share Prompt */}
          <div className="bg-white/70 rounded-xl p-6 border border-yellow-200/50">
            <div className="flex items-start gap-3 mb-4">
              <button
                onClick={() => toggleStep('prompt')}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all ${
                  completedSteps.prompt 
                    ? 'bg-yellow-400 border-yellow-400 text-white' 
                    : 'border-gray-300 hover:border-yellow-400'
                }`}
              >
                {completedSteps.prompt && (
                  <svg className="w-3 h-3 m-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <span className="text-xl">✨</span>
            </div>
            
            <h3 className="font-medium text-gray-900 mb-2">Deel je favoriete prompt</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Heb je een prompt die je vaak gebruikt? Drop 'm in de promptzone.
              Simpel, gek, complex — als het werkt, is het welkom.
            </p>
            
            <Link href="/kanaal/promptstructuren">
              <button className="text-xs bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-1 mb-3">
                🧠 Drop een prompt
              </button>
            </Link>
            
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={completedSteps.prompt}
                onChange={() => toggleStep('prompt')}
                className="sr-only"
              />
              Ik heb een prompt gedeeld
            </label>
          </div>
        </div>

        {/* Completion Message */}
        {showCompletion && (
          <div className="bg-white/80 rounded-xl p-6 border border-yellow-200 text-center">
            <p className="text-gray-700 leading-relaxed">
              🎉 Wat mooi: je hebt je eerste bijdrage gedaan.<br />
              We kijken ernaar uit om met je samen te leren! Welkom in de community.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function CommunityContent() {
  const { isAdmin } = useViewAwareAdmin();
  const { user: currentUser } = useCurrentUser();
  const channels = useQuery(api.channels.getVisibleChannelsWithSecties);
  const users = useQuery(api.users.getAllUsers);
  const allThreads = useQuery(api.threads.getAllThreads);
  const recentThreads = useQuery(api.threads.getRecentThreads, { limit: 6 });
  
  // Growth statistics
  const weeklyUserGrowth = useQuery(api.users.getWeeklyUserGrowth);
  const dailyThreadGrowth = useQuery(api.threads.getDailyThreadGrowth);

  // Extract first name from user's name
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  const firstName = currentUser?.naam ? getFirstName(currentUser.naam) : 'Keyholder';

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

  // Helper function to format growth text
  const formatGrowthText = (count: number, period: string) => {
    if (count === 0) return `0 ${period}`;
    if (count === 1) return `+1 ${period}`;
    return `+${count} ${period}`;
  };

  const stats = [
    {
      label: "Community Members",
      value: users?.length || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: formatGrowthText(weeklyUserGrowth || 0, "deze week"),
      changeColor: weeklyUserGrowth && weeklyUserGrowth > 0 ? "text-green-600" : "text-gray-500"
    },
    {
      label: "Actieve Discussies",
      value: allThreads?.length || 0,
      icon: MessageSquare,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      change: formatGrowthText(dailyThreadGrowth || 0, "vandaag"),
      changeColor: dailyThreadGrowth && dailyThreadGrowth > 0 ? "text-green-600" : "text-gray-500"
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

  return (
    <OnboardingCheck>
      <div className="flex flex-col h-screen bg-gray-50/30">
        {/* Top Navigation */}
        <TopNavigation />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          <KanaalSidebar />
          
          <div className="flex-1 overflow-auto">
            <div className="min-h-full">
              {/* Hero Section */}
              <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6 lg:mb-8">
                    <div className="flex-1">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2">
                        Welkom <span className="text-primary">{firstName}</span> 👋
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
                        {/* Onboarding Module */}
                        {index === 0 && <OnboardingModule />}
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
      </div>
    </OnboardingCheck>
  );
}

export default function CommunityPage() {
  return (
    <>
      <Unauthenticated>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Je moet ingelogd zijn</h1>
            <p className="text-gray-600 mb-6">Log in om toegang te krijgen tot de community</p>
            <SignInButton mode="modal">
              <button className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all">
                Inloggen
              </button>
            </SignInButton>
          </div>
        </div>
      </Unauthenticated>
      
      <AuthLoading>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Laden...</p>
          </div>
        </div>
      </AuthLoading>
      
      <Authenticated>
        <CommunityContent />
      </Authenticated>
    </>
  );
} 