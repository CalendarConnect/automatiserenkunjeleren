"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, User, Briefcase, Target, Heart } from "lucide-react";

interface IntroduceerJezelfFormProps {
  onSubmit: (data: {
    titel: string;
    inhoud: string;
  }) => void;
  isSubmitting: boolean;
}

export default function IntroduceerJezelfForm({ onSubmit, isSubmitting }: IntroduceerJezelfFormProps) {
  const [naam, setNaam] = useState("");
  const [werk, setWerk] = useState("");
  const [aiGebruik, setAiGebruik] = useState("");
  const [doelen, setDoelen] = useState("");
  const [leukFeit, setLeukFeit] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!naam.trim()) return;

    // Generate title and content
    const titel = `👋 Hoi, ik ben ${naam}!`;
    
    let inhoud = `<p><strong>🙋‍♂️ Wie ben ik:</strong><br/>${naam}</p>`;
    
    if (werk.trim()) {
      inhoud += `<p><strong>🏢 Wat ik doe:</strong><br/>${werk}</p>`;
    }
    
    if (aiGebruik.trim()) {
      inhoud += `<p><strong>🤖 Hoe ik AI gebruik:</strong><br/>${aiGebruik}</p>`;
    }
    
    if (doelen.trim()) {
      inhoud += `<p><strong>🎯 Wat ik wil leren/bereiken:</strong><br/>${doelen}</p>`;
    }
    
    if (leukFeit.trim()) {
      inhoud += `<p><strong>✨ Leuk weetje over mij:</strong><br/>${leukFeit}</p>`;
    }
    
    inhoud += `<p><em>Leuk om jullie te ontmoeten! 😊</em></p>`;

    onSubmit({ titel, inhoud });
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-purple-900">
          <Sparkles className="w-5 h-5" />
          Stel jezelf voor aan de community!
        </CardTitle>
        <CardDescription className="text-purple-700">
          Vertel ons wie je bent - we zijn benieuwd naar je verhaal! 🌟
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Naam - verplicht */}
          <div className="space-y-2">
            <Label htmlFor="naam" className="flex items-center gap-2 text-purple-900 font-medium">
              <User className="w-4 h-4" />
              Hoe mogen we je noemen? *
            </Label>
            <Input
              id="naam"
              value={naam}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNaam(e.target.value)}
              placeholder="Bijv. Sarah, of Sarah van Marketing"
              className="border-purple-200 focus:border-purple-400"
              required
            />
          </div>

          {/* Werk - optioneel */}
          <div className="space-y-2">
            <Label htmlFor="werk" className="flex items-center gap-2 text-purple-900 font-medium">
              <Briefcase className="w-4 h-4" />
              Wat doe je voor werk? (optioneel)
            </Label>
            <Input
              id="werk"
              value={werk}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWerk(e.target.value)}
              placeholder="Bijv. Marketing manager bij een tech startup"
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          {/* AI gebruik - optioneel */}
          <div className="space-y-2">
            <Label htmlFor="aiGebruik" className="flex items-center gap-2 text-purple-900 font-medium">
              <span className="text-lg">🤖</span>
              Hoe gebruik je AI nu? (optioneel)
            </Label>
            <Textarea
              id="aiGebruik"
              value={aiGebruik}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAiGebruik(e.target.value)}
              placeholder="Bijv. ChatGPT voor content, of nog helemaal nieuw met AI"
              className="border-purple-200 focus:border-purple-400 min-h-[80px]"
              rows={3}
            />
          </div>

          {/* Doelen - optioneel */}
          <div className="space-y-2">
            <Label htmlFor="doelen" className="flex items-center gap-2 text-purple-900 font-medium">
              <Target className="w-4 h-4" />
              Wat wil je leren of bereiken? (optioneel)
            </Label>
            <Textarea
              id="doelen"
              value={doelen}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDoelen(e.target.value)}
              placeholder="Bijv. AI implementeren in mijn bedrijf, of gewoon meer leren over automatisering"
              className="border-purple-200 focus:border-purple-400 min-h-[80px]"
              rows={3}
            />
          </div>

          {/* Leuk feit - optioneel */}
          <div className="space-y-2">
            <Label htmlFor="leukFeit" className="flex items-center gap-2 text-purple-900 font-medium">
              <Heart className="w-4 h-4" />
              Iets leuks over jezelf? (optioneel)
            </Label>
            <Input
              id="leukFeit"
              value={leukFeit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLeukFeit(e.target.value)}
              placeholder="Bijv. Ik hou van koken, of ik heb 3 katten"
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={!naam.trim() || isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmitting ? "Bezig met voorstellen..." : "Stel me voor aan iedereen! 👋"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 