"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import KanaalSidebar from "@/components/KanaalSidebar";
import Editor from "@/components/Editor";
import TopNavigation from "@/components/TopNavigation";
import PollCreator from "@/components/PollCreator";
import CloudinaryUploadThread from "@/components/CloudinaryUploadThread";
import IntroduceerJezelfForm from "@/components/IntroduceerJezelfForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, MessageSquare, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { createThreadUrl } from "../../../convex/lib/utils";
import OnboardingCheck from "@/components/OnboardingCheck";

function NieuweThreadContent() {
  const { user: currentUser, isLoading: userLoading } = useCurrentUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const kanaalParam = searchParams.get('kanaal');
  
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [titel, setTitel] = useState("");
  const [inhoud, setInhoud] = useState("");
  const [afbeelding, setAfbeelding] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Poll/Text type selection
  const [threadType, setThreadType] = useState<"text" | "poll">("text");
  const [pollData, setPollData] = useState<{
    vraag: string;
    opties: string[];
    multipleChoice: boolean;
  } | null>(null);

  const channels = useQuery(api.channels.getAllChannels);
  const createThread = useMutation(api.threads.createThread);

  // Auto-select channel if provided in URL
  useEffect(() => {
    if (kanaalParam && channels) {
      const channel = channels.find(c => c.slug === kanaalParam);
      if (channel) {
        setSelectedChannel(channel._id);
      }
    }
  }, [kanaalParam, channels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!currentUser) {
      console.error("User not logged in");
      return;
    }
    
    // Validation based on thread type
    if (threadType === "text") {
      if (!selectedChannel || !titel.trim() || !inhoud.trim()) return;
    } else {
      if (!selectedChannel || !titel.trim() || !pollData) return;
    }

    setIsSubmitting(true);
    try {
      const result = await createThread({
        kanaalId: selectedChannel as any,
        titel: titel.trim(),
        inhoud: threadType === "text" ? inhoud.trim() : undefined,
        auteurId: currentUser?._id as any,
        afbeelding: afbeelding || undefined,
        type: threadType,
        // Poll specific data
        pollVraag: threadType === "poll" ? pollData?.vraag : undefined,
        pollOpties: threadType === "poll" ? pollData?.opties : undefined,
        multipleChoice: threadType === "poll" ? pollData?.multipleChoice : undefined,
      });

      // Use the new URL structure with slug and thread number
      const threadUrl = `/thread/${createThreadUrl(result.slug, result.threadNumber)}`;
      router.push(threadUrl);
    } catch (error) {
      console.error("Error creating thread:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIntroduceerSubmit = async (data: { titel: string; inhoud: string }) => {
    if (!currentUser || !selectedChannel) return;

    setIsSubmitting(true);
    try {
      const result = await createThread({
        kanaalId: selectedChannel as any,
        titel: data.titel,
        inhoud: data.inhoud,
        auteurId: currentUser._id as any,
        type: "text",
      });

      // Use the new URL structure with slug and thread number
      const threadUrl = `/thread/${createThreadUrl(result.slug, result.threadNumber)}`;
      router.push(threadUrl);
    } catch (error) {
      console.error("Error creating introduction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedChannelData = channels?.find(c => c._id === selectedChannel);
  const isChannelPreselected = !!kanaalParam && !!selectedChannelData;
  const isVoorstellenChannel = selectedChannelData?.slug === "voorstellen-uitbreiding";
  const isIntroduceerChannel = selectedChannelData?.slug === "introduceer-jezelf";

  // Determine back link based on whether we came from a specific channel
  const backLink = kanaalParam ? `/kanaal/${kanaalParam}` : "/kanalen";
  const backText = kanaalParam ? `Terug naar ${selectedChannelData?.naam || 'kanaal'}` : "Terug naar kanalen";

  // Validation for submit button
  const isValidForSubmit = () => {
    if (!currentUser || !selectedChannel || !titel.trim()) return false;
    
    if (threadType === "text") {
      return inhoud.trim() !== "";
    } else {
      return pollData !== null;
    }
  };

  // Show loading state while user is being loaded
  if (userLoading) {
    return (
      <div className="flex h-screen">
        <KanaalSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Gebruiker laden...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no user found
  if (!currentUser) {
    return (
      <div className="flex h-screen">
        <KanaalSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Je moet ingelogd zijn om een thread aan te maken.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Probeer de pagina te verversen of log opnieuw in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <OnboardingCheck>
      <div className="flex flex-col h-screen">
        <TopNavigation />
        <div className="flex flex-1 overflow-hidden">
          <KanaalSidebar />
          
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-6">
              <div className="mb-6">
                <Link href={backLink}>
                  <Button variant="ghost" size="sm" className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {backText}
                  </Button>
                </Link>
                
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {isIntroduceerChannel 
                    ? "Stel jezelf voor! 👋" 
                    : "Nieuwe thread aanmaken"
                  }
                </h1>
                <p className="text-muted-foreground">
                  {isIntroduceerChannel
                    ? "Vertel ons wie je bent - we zijn benieuwd naar je verhaal!"
                    : isChannelPreselected 
                      ? `Start een nieuwe discussie in ${selectedChannelData?.naam}`
                      : "Start een nieuwe discussie in de community"
                  }
                </p>
              </div>

              {/* Special form for introduceer-jezelf channel */}
              {isIntroduceerChannel ? (
                <IntroduceerJezelfForm 
                  onSubmit={handleIntroduceerSubmit}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Kanaal selectie - alleen tonen als er geen kanaal is voorgeselecteerd */}
                {!isChannelPreselected ? (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Kanaal *
                    </label>
                    <select
                      value={selectedChannel}
                      onChange={(e) => setSelectedChannel(e.target.value)}
                      className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Selecteer een kanaal</option>
                      {channels?.filter(c => c.type === "discussie").map((channel) => (
                        <option key={channel._id} value={channel._id}>
                          {channel.naam}
                        </option>
                      ))}
                    </select>
                    {selectedChannelData && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedChannelData.beschrijving}
                      </p>
                    )}
                  </div>
                ) : (
                  // Toon geselecteerd kanaal als readonly
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Kanaal
                    </label>
                    <div className="w-full p-3 border border-border rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-foreground">
                            {selectedChannelData?.naam}
                          </span>
                          {selectedChannelData?.beschrijving && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedChannelData.beschrijving}
                            </p>
                          )}
                        </div>
                        <Link href="/nieuw">
                          <Button variant="ghost" size="sm" type="button">
                            Wijzigen
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Thread Type Selection - only for voorstellen-uitbreiding */}
                {isVoorstellenChannel && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Type *
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setThreadType("text")}
                        className={`flex-1 p-4 border rounded-lg transition-all ${
                          threadType === "text"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <MessageSquare className="w-5 h-5" />
                          <span className="font-medium">Tekst</span>
                        </div>
                        <p className="text-xs mt-1 opacity-75">
                          Gewone discussie met tekst
                        </p>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setThreadType("poll")}
                        className={`flex-1 p-4 border rounded-lg transition-all ${
                          threadType === "poll"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          <span className="font-medium">Poll</span>
                        </div>
                        <p className="text-xs mt-1 opacity-75">
                          Laat mensen stemmen op opties
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {/* Titel */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Titel *
                  </label>
                  <input
                    type="text"
                    value={titel}
                    onChange={(e) => setTitel(e.target.value)}
                    placeholder="Geef je thread een duidelijke titel..."
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    maxLength={200}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {titel.length}/200 karakters
                  </div>
                </div>

                {/* Content based on thread type */}
                {threadType === "text" ? (
                  /* Inhoud */
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Inhoud *
                    </label>
                    <Editor
                      value={inhoud}
                      onChange={setInhoud}
                      placeholder="Beschrijf je vraag of discussiepunt in detail..."
                      minHeight="300px"
                    />
                  </div>
                ) : (
                  /* Poll Creator */
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Poll Configuratie *
                    </label>
                    <PollCreator onPollChange={setPollData} />
                  </div>
                )}

                {/* Afbeelding (optioneel) - alleen voor text threads */}
                {threadType === "text" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Afbeelding (optioneel)
                    </label>
                    <CloudinaryUploadThread
                      onUpload={setAfbeelding}
                      onRemove={() => setAfbeelding("")}
                      currentImage={afbeelding}
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                {/* Submit */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    * Verplichte velden
                  </div>
                  
                  <div className="flex gap-3">
                    <Link href={backLink}>
                      <Button variant="outline" type="button">
                        Annuleren
                      </Button>
                    </Link>
                    
                    <Button 
                      type="submit" 
                      disabled={!isValidForSubmit() || isSubmitting}
                    >
                      {isSubmitting ? (
                        "Wordt aangemaakt..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {threadType === "poll" ? "Poll aanmaken" : "Thread aanmaken"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </OnboardingCheck>
  );
}

export default function NieuweThreadPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen">
        <KanaalSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Nieuwe thread pagina laden...</p>
          </div>
        </div>
      </div>
    }>
      <NieuweThreadContent />
    </Suspense>
  );
} 