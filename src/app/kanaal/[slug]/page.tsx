"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import KanaalSidebar from "@/components/KanaalSidebar";
import ThreadCard from "@/components/ThreadCard";
import KanaalHeader from "@/components/KanaalHeader";
import TopNavigation from "@/components/TopNavigation";
import PromptbibliotheekKanaal from "@/components/PromptbibliotheekKanaal";
import ToolbibliotheekKanaal from "@/components/ToolbibliotheekKanaal";
import { Button } from "@/components/ui/button";
import { Plus, Pin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function KanaalPage() {
  const { user: currentUser } = useCurrentUser();
  const params = useParams();
  const slug = params.slug as string;
  
  const channel = useQuery(api.channels.getChannelBySlug, { slug });
  const isVoorstellenChannel = slug === "voorstellen-uitbreiding";
  const isIntroduceerChannel = slug === "introduceer-jezelf";
  
  // Check if this is a Promptbibliotheek channel
  const isPromptbibliotheekChannel = [
    "promptstructuren",
    "codegeneratie", 
    "idee-generatie",
    "visualisatie",
    "vibe-coding",
    "compliance",
    "copywriting",
    "automatisering"
  ].includes(slug);

  // Check if this is an AI Toolbibliotheek channel
  const isToolbibliotheekChannel = [
    "automatisering-workflows",
    "tekst-copywriting",
    "beeld-visualisatie",
    "video-audio",
    "chatbots-assistenten",
    "ontwerp-ux",
    "analyse-dashboards",
    "onderwijs-leren",
    "marketing-social-media",
    "ecommerce-verkoop",
    "ontwikkeltools-code",
    "projectbeheer-planning",
    "notities-samenvattingen",
    "seo",
    "dagelijks-gebruik"
  ].includes(slug);
  
  // Use enhanced query to get poll data and sort by upvotes
  const threads = useQuery(
    api.threads.getThreadsByChannelWithPolls, 
    channel ? { 
      kanaalId: channel._id,
      sortByUpvotes: true 
    } : "skip"
  );

  if (!channel) {
    return (
      <div className="flex flex-col h-screen">
        <TopNavigation />
        <div className="flex flex-1 overflow-hidden">
          <KanaalSidebar />
          <div className="flex-1 p-6">
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stickyThreads = threads?.filter((thread: any) => thread.sticky) || [];
  const regularThreads = threads?.filter((thread: any) => !thread.sticky) || [];

  return (
    <div className="flex flex-col h-screen">
      <TopNavigation />
      <div className="flex flex-1 overflow-hidden">
        <KanaalSidebar />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <KanaalHeader 
              key={`${channel._id}-${channel.naam}-${channel.beschrijving}`}
              channel={channel} 
            />
            
            {/* Special header for AI Toolbibliotheek channels */}
            {isToolbibliotheekChannel && (
              <div className="mb-6 p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-orange-900 mb-3">
                    🛠️ AI Toolbibliotheek
                  </h3>
                  <p className="text-orange-700 mb-4 max-w-3xl mx-auto">
                    Vind en deel de tools die jij écht gebruikt met AI. Elke tool krijgt een eigen kaart 
                    met omschrijving en directe link. Stem op de tools die voor jou werken!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-orange-600">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">🔗</span>
                      <span>Deel werkende tools</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">⬆️</span>
                      <span>Stem op de beste</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">🎯</span>
                      <span>Ontdek nieuwe mogelijkheden</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Special header for Promptbibliotheek channels */}
            {isPromptbibliotheekChannel && (
              <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-purple-900 mb-3">
                    📦 Promptbibliotheek
                  </h3>
                  <p className="text-purple-700 mb-4 max-w-3xl mx-auto">
                    Deel je beste prompts met de community. Elke prompt wordt weergegeven in een duidelijk codeblok 
                    met uitleg over wanneer en waarom je het gebruikt. Stem op de prompts die voor jou werken!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-600">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">💡</span>
                      <span>Deel werkende prompts</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">⬆️</span>
                      <span>Stem op de beste</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">🤝</span>
                      <span>Leer van elkaar</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Special header for voorstellen-uitbreiding */}
            {isVoorstellenChannel && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  💡 Voorstellen voor uitbreiding
                </h3>
                <p className="text-sm text-blue-700">
                  Deel je ideeën voor nieuwe features! Gebruik <strong>polls</strong> om de community te laten stemmen, 
                  of maak een <strong>tekst post</strong> voor uitgebreide voorstellen. 
                  De beste ideeën (met de meeste upvotes) worden als eerste ontwikkeld.
                </p>
              </div>
            )}

            {/* Special header for introduceer-jezelf */}
            {isIntroduceerChannel && (
              <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-purple-900 mb-3">
                    👋 Welkom in onze community!
                  </h3>
                  <p className="text-purple-700 mb-4 max-w-2xl mx-auto">
                    We zijn super blij dat je er bent! Vertel ons wie je bent, wat je doet, 
                    en waar je mee bezig bent. Geen stress - gewoon jezelf zijn! 😊
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-600 mb-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">🏢</span>
                      <span>Wat doe je voor werk?</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">🤖</span>
                      <span>Hoe gebruik je AI?</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">🎯</span>
                      <span>Wat wil je leren?</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Render special components for library channels */}
            {isToolbibliotheekChannel ? (
              <ToolbibliotheekKanaal
                kanaalId={channel._id}
                kanaalSlug={slug}
                currentUserId={currentUser?._id}
              />
            ) : isPromptbibliotheekChannel ? (
              <PromptbibliotheekKanaal
                kanaalId={channel._id}
                kanaalSlug={slug}
                currentUserId={currentUser?._id}
              />
            ) : (
              <>
                <div className="flex justify-end mb-6">
                  <Link href={`/nieuw?kanaal=${slug}`}>
                    <Button className={isIntroduceerChannel ? "bg-purple-600 hover:bg-purple-700" : ""}>
                      <Plus className="w-4 h-4 mr-2" />
                      {isIntroduceerChannel 
                        ? "Stel jezelf voor! 👋" 
                        : isVoorstellenChannel 
                          ? "Nieuw voorstel" 
                          : "Nieuwe thread"
                      }
                    </Button>
                  </Link>
                </div>

                {/* Sticky Threads */}
                {stickyThreads.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Pin className="w-4 h-4 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">
                        Vastgepinde berichten
                      </h2>
                    </div>
                    
                    <div className="space-y-4">
                      {stickyThreads.map((thread: any) => (
                        <ThreadCard
                          key={thread._id}
                          thread={thread as any}
                          currentUserId={currentUser?._id}
                          enableUpvoting={true}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Threads */}
                <div className="space-y-4">
                  {regularThreads.length > 0 ? (
                    <>
                      {isVoorstellenChannel && (
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-semibold text-foreground">
                            Voorstellen (gesorteerd op populariteit)
                          </h2>
                          <div className="text-sm text-muted-foreground">
                            💡 Stem op de beste ideeën!
                          </div>
                        </div>
                      )}
                      
                      {regularThreads.map((thread: any) => (
                        <ThreadCard
                          key={thread._id}
                          thread={thread as any}
                          currentUserId={currentUser?._id}
                          enableUpvoting={true}
                        />
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground mb-4">
                        {isIntroduceerChannel
                          ? "Nog niemand heeft zich voorgesteld... Wees jij de eerste! 🌟"
                          : isVoorstellenChannel 
                            ? "Nog geen voorstellen in dit kanaal" 
                            : "Nog geen threads in dit kanaal"
                        }
                      </div>
                      <Link href={`/nieuw?kanaal=${slug}`}>
                        <Button className={isIntroduceerChannel ? "bg-purple-600 hover:bg-purple-700" : ""}>
                          <Plus className="w-4 h-4 mr-2" />
                          {isIntroduceerChannel
                            ? "Ik stel me voor! 👋"
                            : isVoorstellenChannel 
                              ? "Deel je eerste idee" 
                              : "Start de eerste discussie"
                          }
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 