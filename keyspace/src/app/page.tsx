"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import KanaalSidebar from "@/components/KanaalSidebar";
import { ArrowRight, Users, MessageSquare, BookOpen, Zap, Shield, Brain, Heart, Code, Lightbulb, Globe, Lock, Sparkles } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useViewAwareAdmin } from "@/lib/useViewAwareRole";

export default function Home() {
  const { isAdmin } = useViewAwareAdmin();
  const channels = useQuery(api.channels.getAllChannels);
  const users = useQuery(api.users.getAllUsers);
  const threads = useQuery(api.threads.getAllThreads);

  const stats = [
    {
      label: "Makers & Denkers",
      value: users?.length || 0,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
      description: "Professionals die samen bouwen"
    },
    {
      label: "Kennisuitwisseling",
      value: threads?.length || 0,
      icon: MessageSquare,
      color: "text-green-600 bg-green-50",
      description: "Gesprekken over AI in de praktijk"
    },
    {
      label: "Expertisegebieden",
      value: channels?.length || 0,
      icon: BookOpen,
      color: "text-purple-600 bg-purple-50",
      description: "Van prompts tot compliance"
    },
  ];

  const whatYouFind = [
    {
      icon: Code,
      title: "Praktische Tools",
      items: ["Prompts & n8n-flows", "Templates & voorbeelden", "LLM-tools & Midjourney", "VPS-oplossingen"],
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      icon: Shield,
      title: "Compliance & Privacy",
      items: ["AVG-conforme AI", "EU AI Act voorbereiding", "Data-opslag strategieën", "AP-richtlijnen"],
      color: "text-green-600 bg-green-50 border-green-200",
    },
    {
      icon: Globe,
      title: "Community Diversiteit",
      items: ["Developers & juristen", "Ondernemers & creatieven", "Compliance-specialisten", "Beleidsmakers"],
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
  ];

  const principles = [
    {
      icon: Heart,
      title: "Vrijwillig & Open",
      description: "Geen businessmodel. Geen organisatie die verdient. Alleen kennis delen.",
    },
    {
      icon: Lightbulb,
      title: "Échte Kennis",
      description: "Die verschil maakt. Zonder ego. Zonder poespas. Gewoon praktisch.",
    },
    {
      icon: Lock,
      title: "Data Soevereiniteit",
      description: "AI implementeren met behoud van controle over je eigen data.",
    },
  ];

  return (
    <>
      <SignedOut>
        {redirect("/automatiseren-kun-je-leren")}
      </SignedOut>
      <SignedIn>
        <div className="flex h-screen bg-gray-50/30">
          <KanaalSidebar />
          
          <div className="flex-1 overflow-auto">
            <div className="min-h-screen">
              {/* Hero Section */}
              <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-20">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                      <Sparkles className="w-4 h-4" />
                      Automatiseren kun je leren
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                      En we doen het <span className="text-primary">samen</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                      Deze community is er voor iedereen. Beginners die net starten met AI. 
                      Experts die al jaren bouwen. En iedereen daartussen.
                    </p>
                    <p className="text-lg text-gray-500 mb-10 max-w-3xl mx-auto">
                      Want juist doordat we hier allemaal zitten, met mensen uit verschillende vakgebieden, 
                      met verschillende achtergronden en niveaus, leren we van elkaar.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Link href="/community">
                        <button className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
                          Ontdek de community
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </Link>
                      <Link href="/kanaal/introduceer-jezelf">
                        <button className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-primary/30 hover:bg-gray-50 transition-all duration-200">
                          Stel jezelf voor
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    {stats.map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-200">
                          <div className="flex items-center gap-4 mb-3">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                              <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{stat.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Waarom deze community bestaat
                  </h2>
                  <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-600 leading-relaxed">
                    <p>
                      We hebben dit opgezet omdat we vinden dat er in Nederland <strong>één centrale plek</strong> moet zijn 
                      waar we dit gesprek voeren. Geen versnipperde LinkedIn-posts. Geen kleine losse groepjes.
                    </p>
                    <p>
                      Maar <strong>één duidelijke ruimte</strong> waar we als professionals, makers, ondernemers en denkers 
                      samen bouwen aan hoe AI wél goed wordt ingezet in ons land.
                    </p>
                  </div>
                </div>

                {/* Principles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                  {principles.map((principle) => {
                    const Icon = principle.icon;
                    return (
                      <div key={principle.title} className="text-center">
                        <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">
                          <Icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {principle.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {principle.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* What You Find Here */}
              <div className="bg-gray-50 border-y border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-20">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Wat je hier vindt
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      Het is een plek voor vragen én antwoorden. Voor visie én praktijk.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {whatYouFind.map((category) => {
                      const Icon = category.icon;
                      return (
                        <div key={category.title} className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-200">
                          <div className={`inline-flex p-3 rounded-xl border ${category.color} mb-6`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {category.title}
                          </h3>
                          <ul className="space-y-2">
                            {category.items.map((item, index) => (
                              <li key={index} className="flex items-center gap-2 text-gray-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Community Values */}
              <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="bg-gradient-to-r from-primary/5 to-purple-50 rounded-3xl p-12 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                    Hoe we samenwerken
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">Kennis delen</h3>
                      <p className="text-gray-600">
                        Er is altijd wel iemand die net wat verder is op een specifiek onderwerp. 
                        En die kennis delen we. <strong>Open. Zonder ego. Zonder poespas.</strong>
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">Samen leren</h3>
                      <p className="text-gray-600">
                        Je praat hier met developers, compliance-specialisten, ondernemers, beleidsmakers, 
                        creatieven, juristen en toolbouwers.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">Vrijwillig onderhouden</h3>
                      <p className="text-gray-600">
                        Deze community is vrijwillig gebouwd en wordt vrijwillig onderhouden. 
                        Het enige geld komt via donaties of affiliate-commissies.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">Échte kennis</h3>
                      <p className="text-gray-600">
                        Zelfpromotie kan, maar alleen in het kanaal dat daarvoor bedoeld is. 
                        De rest draait om kennis. <strong>Échte kennis. Die verschil maakt.</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-br from-primary to-purple-600 text-white">
                <div className="max-w-6xl mx-auto px-6 py-20 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Automatiseren kun je leren
                  </h2>
                  <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                    Als jij gelooft dat we in Nederland AI serieus, zorgvuldig én praktisch moeten leren toepassen, 
                    dan zit je hier goed.
                  </p>
                  <p className="text-lg mb-10 opacity-80 max-w-2xl mx-auto">
                    Lees mee. Bouw mee. Deel wat je weet. Stel vragen.<br />
                    <strong>Dit is de plek waar we samen bepalen hoe we dat gaan doen.</strong>
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/kanaal/introduceer-jezelf">
                      <button className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg">
                        Begin met jezelf voorstellen
                      </button>
                    </Link>
                    <Link href="/community">
                      <button className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-200">
                        Verken de community
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
