"use client";

import AuthNav from "@/components/AuthNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Users, 
  Shield, 
  Zap, 
  Heart, 
  Globe, 
  MessageSquare, 
  Download,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Server,
  Code,
  Lightbulb,
  Target,
  BookOpen,
  Coffee,
  Handshake,
  Star,
  Scale
} from "lucide-react";
import Link from "next/link";

export default function AutomatiserenKunJeLeren() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        {/* Navigation */}
        <nav className="relative z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Automatiseren Kun Je Leren
              </span>
            </div>
            <AuthNav />
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 px-6 pt-20 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-5xl mx-auto">
              <Badge className="mb-8 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200 text-lg px-6 py-2">
                <Sparkles className="w-5 h-5 mr-2" />
                Automatiseren kun je leren. En we doen het samen.
              </Badge>
              
              <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Deze community
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  is er voor iedereen
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-slate-600 mb-8 leading-relaxed font-medium">
                Beginners die net starten met AI. Experts die al jaren bouwen. 
                <br className="hidden md:block" />
                En iedereen daartussen.
              </p>

              <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-4xl mx-auto">
                Want juist doordat we hier allemaal zitten, met mensen uit verschillende vakgebieden, 
                met verschillende achtergronden en niveaus, <strong>leren we van elkaar</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Link href="/community">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all">
                    <Users className="w-6 h-6 mr-3" />
                    Word lid van de community
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </Link>
                <Link href="/community">
                  <Button size="lg" variant="outline" className="border-2 border-slate-300 hover:border-blue-300 px-10 py-6 text-xl rounded-2xl">
                    <MessageSquare className="w-6 h-6 mr-3" />
                    Bekijk discussies
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-8 text-lg text-slate-500">
                <div className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  100% gratis & vrijwillig
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-500" />
                  Privacy-first & open source
                </div>
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-500" />
                  Nederlandse AI community
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                Waarom deze community bestaat
              </span>
            </h2>
            <div className="max-w-5xl mx-auto space-y-8 text-xl md:text-2xl text-slate-600 leading-relaxed">
              <p>
                We hebben dit opgezet omdat we vinden dat er in Nederland <strong className="text-blue-600">één centrale plek</strong> moet zijn 
                waar we dit gesprek voeren.
              </p>
              <p>
                Geen versnipperde LinkedIn-posts. Geen kleine losse groepjes.
              </p>
              <p className="text-2xl md:text-3xl font-bold text-slate-800">
                Maar <span className="text-blue-600">één duidelijke ruimte</span> waar we als professionals, makers, ondernemers en denkers 
                samen bouwen aan hoe AI wél goed wordt ingezet in ons land.
              </p>
            </div>
          </div>

          {/* Community Values */}
          <div className="grid md:grid-cols-3 gap-12">
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 bg-gradient-to-br from-red-50 to-pink-50">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-slate-800">Open. Zonder ego. Zonder poespas.</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Er is altijd wel iemand die net wat verder is op een specifiek onderwerp. 
                  En die kennis delen we. Gewoon praktisch.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-slate-800">Vrijwillig gebouwd & onderhouden</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Er is geen businessmodel. Geen organisatie die eraan verdient. 
                  Het enige geld komt via donaties of affiliate-commissies.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-slate-800">Échte kennis. Die verschil maakt.</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Zelfpromotie kan, maar alleen in het kanaal dat daarvoor bedoeld is. 
                  De rest draait om kennis die écht impact heeft.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You Find Here */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Wat je hier vindt
              </span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Het is een plek voor vragen én antwoorden. Voor visie én praktijk.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: Code,
                title: "Prompts & n8n-flows",
                description: "Werkende voorbeelden die je direct kunt gebruiken",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: BookOpen,
                title: "Templates & Tools",
                description: "De nieuwste LLM-tools en Midjourney-afbeeldingen",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Server,
                title: "VPS & Infrastructuur",
                description: "Handige oplossingen voor je eigen server setup",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Shield,
                title: "Compliance & Privacy",
                description: "AVG, EU AI Act en Autoriteit Persoonsgegevens",
                color: "from-red-500 to-orange-500"
              }
            ].map((item, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-800">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Community Diversity */}
          <div className="bg-white rounded-3xl p-12 shadow-2xl">
            <h3 className="text-3xl font-bold text-center mb-12 text-slate-800">
              Je praat hier met...
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Code, label: "Developers", color: "text-blue-600" },
                { icon: Shield, label: "Compliance-specialisten", color: "text-green-600" },
                { icon: Target, label: "Ondernemers", color: "text-purple-600" },
                { icon: BookOpen, label: "Beleidsmakers", color: "text-red-600" },
                { icon: Lightbulb, label: "Creatieven", color: "text-yellow-600" },
                { icon: Scale, label: "Juristen", color: "text-indigo-600" },
                { icon: Zap, label: "Toolbouwers", color: "text-pink-600" },
                { icon: Coffee, label: "En jij!", color: "text-orange-600" }
              ].map((person, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${person.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <person.icon className={`w-8 h-8 ${person.color}`} />
                  </div>
                  <p className="font-semibold text-slate-700">{person.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Together */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                Hoe we samenwerken
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Handshake className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">Kennis delen zonder ego</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Je wisselt ideeën uit met mensen uit jouw eigen sector. 
                    Zodat jij verder komt, maar ook anderen meeneemt.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">Samen leren van diversiteit</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Juist doordat we verschillende achtergronden hebben, 
                    ontstaan er nieuwe inzichten en oplossingen.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">Vrijwillig & transparant</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Dat bedrag gaat direct naar de moderators die dagelijks zorgen dat alles draait. 
                    Volledig transparant, volledig vrijwillig.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 rounded-3xl flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Globe className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-xl font-bold text-slate-700 mb-2">Nederlandse AI Community</p>
                  <p className="text-slate-500">Samen bouwen aan de toekomst</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Automatiseren kun je leren
          </h2>
          <p className="text-2xl md:text-3xl text-blue-100 mb-8 leading-relaxed font-medium">
            En dit is de plek waar we samen bepalen hoe we dat gaan doen.
          </p>
          
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-xl text-blue-100 mb-6 leading-relaxed">
              Als jij gelooft dat we in Nederland AI <strong>serieus, zorgvuldig én praktisch</strong> moeten leren toepassen, 
              dan zit je hier goed.
            </p>
            <p className="text-lg text-blue-200 leading-relaxed">
              <strong>Lees mee. Bouw mee. Deel wat je weet. Stel vragen.</strong>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/community">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl">
                <Users className="w-6 h-6 mr-3" />
                Word lid van de community
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-blue-600 px-12 py-6 text-xl font-bold rounded-2xl transition-all">
                <MessageSquare className="w-6 h-6 mr-3" />
                Begin met discussiëren
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Automatiseren Kun Je Leren</span>
          </div>
          <p className="text-slate-400 mb-8 leading-relaxed text-lg max-w-2xl mx-auto">
            Een initiatief van Christian Bleeker, powered by{" "}
            <a href="https://www.keyholders.agency/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
              Keyholders Agency
            </a>
            . Samen bouwen we aan verantwoorde AI-implementatie in Nederland.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="border-slate-600 text-slate-300 px-4 py-2">
              <Heart className="w-4 h-4 mr-2" />
              Made with ❤️ in Nederland
            </Badge>
            <Badge variant="outline" className="border-slate-600 text-slate-300 px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              100% Open Source
            </Badge>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-slate-400">
            <p className="text-lg">&copy; 2024 Automatiseren Kun Je Leren. Alle kennis gratis beschikbaar voor iedereen.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 