"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useConvexMutation } from "@/lib/useConvexFunction";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CloudinaryAvatarUpload from "@/components/CloudinaryAvatarUpload";
import { loadCloudinaryScript } from "@/components/CloudinaryUpload";
import {
  Heart,
  Users,
  Sparkles,
  ArrowRight,
  User,
  Briefcase,
  Building,
  Tag,
  MessageSquare,
  Shield,
  Coffee,
  Linkedin,
  CheckCircle
} from "lucide-react";

function OnboardingContent() {
  const { user: clerkUser, isLoaded } = useUser();
  const { user: convexUser, isLoading: convexLoading } = useCurrentUser();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  
  const updateUser = useConvexMutation("users:updateUser");
  const createUser = useConvexMutation("users:createUser");
  
  const [profileData, setProfileData] = useState({
    naam: "",
    functie: "",
    organisatie: "",
    bio: "",
    tags: [] as string[],
    avatarUrl: "",
    linkedinUrl: "",
  });

  // Load Cloudinary script
  useEffect(() => {
    loadCloudinaryScript();
  }, []);

  // Initialize with Clerk data immediately when available
  useEffect(() => {
    if (clerkUser && isLoaded) {
      setProfileData(prev => ({
        ...prev,
        naam: prev.naam || clerkUser.fullName || clerkUser.firstName || "",
        avatarUrl: prev.avatarUrl || clerkUser.imageUrl || "",
      }));
    }
  }, [clerkUser, isLoaded]);

  // Update with Convex data when available
  useEffect(() => {
    if (convexUser && !convexLoading) {
      setProfileData(prev => ({
        ...prev,
        naam: convexUser.naam || prev.naam,
        functie: convexUser.functie || prev.functie,
        organisatie: convexUser.organisatie || prev.organisatie,
        bio: convexUser.bio || prev.bio,
        tags: convexUser.tags || prev.tags,
        avatarUrl: convexUser.avatarUrl || prev.avatarUrl,
        linkedinUrl: convexUser.linkedinUrl || prev.linkedinUrl,
      }));
    }
  }, [convexUser, convexLoading]);

  // Redirect if user already has complete profile
  useEffect(() => {
    if (convexUser && !convexLoading) {
      // Check if user has completed onboarding (has all required info filled)
      const hasCompleteProfile = convexUser.naam && 
                                convexUser.functie && 
                                convexUser.organisatie && 
                                convexUser.bio &&
                                convexUser.naam.trim() !== "" &&
                                convexUser.functie.trim() !== "" &&
                                convexUser.organisatie.trim() !== "" &&
                                convexUser.bio.trim() !== "";
      
      if (hasCompleteProfile) {
        router.push("/community");
      }
    }
  }, [convexUser, convexLoading, router]);

  const handleAvatarUpload = (url: string) => {
    setProfileData(prev => ({ ...prev, avatarUrl: url }));
  };

  const handleAvatarRemove = () => {
    setProfileData(prev => ({ ...prev, avatarUrl: "" }));
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !profileData.tags.includes(tag.trim())) {
      setProfileData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    if (!clerkUser) return;
    
    setIsSubmitting(true);
    try {
      if (convexUser) {
        // Update existing user
        await updateUser({
          userId: convexUser._id,
          naam: profileData.naam,
          functie: profileData.functie,
          organisatie: profileData.organisatie,
          bio: profileData.bio,
          tags: profileData.tags,
          avatarUrl: profileData.avatarUrl,
          linkedinUrl: profileData.linkedinUrl,
        });
      } else {
        // Create new user
        await createUser({
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          naam: profileData.naam,
          functie: profileData.functie,
          organisatie: profileData.organisatie,
          bio: profileData.bio,
          tags: profileData.tags,
          avatarUrl: profileData.avatarUrl,
          linkedinUrl: profileData.linkedinUrl,
        });
      }
      
      // Redirect to community page
      router.push("/community");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToStep2 = profileData.naam && profileData.functie && profileData.organisatie;
  const canProceedToStep3 = canProceedToStep2 && profileData.bio;
  const canComplete = canProceedToStep3 && rulesAccepted;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg text-gray-600">Welkom voorbereiden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-lg font-medium mb-6">
              <Sparkles className="w-5 h-5" />
              Welkom bij Automatiseren Kun Je Leren!
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fijn dat je er bent! 🎉
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              We zijn super blij dat je deel uitmaakt van onze community. 
              Laten we je profiel invullen zodat anderen je beter kunnen leren kennen!
            </p>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 rounded ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 rounded ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                  <User className="w-6 h-6 text-blue-500" />
                  Vertel ons over jezelf
                </CardTitle>
                <p className="text-gray-600">Deze informatie helpt anderen je te vinden en met je in contact te komen</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Avatar Upload */}
                <div className="text-center">
                  <Label className="text-lg font-semibold text-gray-700 mb-4 block">Profielafbeelding (optioneel)</Label>
                  <CloudinaryAvatarUpload
                    onUpload={handleAvatarUpload}
                    onRemove={handleAvatarRemove}
                    currentImage={profileData.avatarUrl}
                    userName={profileData.naam}
                    disabled={false}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="naam" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Naam *
                    </Label>
                    <Input
                      id="naam"
                      value={profileData.naam}
                      onChange={(e) => setProfileData(prev => ({ ...prev, naam: e.target.value }))}
                      placeholder="Hoe mogen we je noemen?"
                      className="mt-2 text-lg py-3"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="functie" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Functie *
                    </Label>
                    <Input
                      id="functie"
                      value={profileData.functie}
                      onChange={(e) => setProfileData(prev => ({ ...prev, functie: e.target.value }))}
                      placeholder="Wat doe je voor werk?"
                      className="mt-2 text-lg py-3"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="organisatie" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Organisatie *
                    </Label>
                    <Input
                      id="organisatie"
                      value={profileData.organisatie}
                      onChange={(e) => setProfileData(prev => ({ ...prev, organisatie: e.target.value }))}
                      placeholder="Voor welk bedrijf/organisatie werk je?"
                      className="mt-2 text-lg py-3"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn (optioneel)
                    </Label>
                    <Input
                      id="linkedin"
                      value={profileData.linkedinUrl}
                      onChange={(e) => setProfileData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                      placeholder="https://linkedin.com/in/jouw-profiel"
                      className="mt-2 text-lg py-3"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedToStep2}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold rounded-xl"
                  >
                    Volgende stap
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Bio and Tags */}
          {currentStep === 2 && (
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                  <MessageSquare className="w-6 h-6 text-purple-500" />
                  Vertel je verhaal
                </CardTitle>
                <p className="text-gray-600">Help anderen je beter te leren kennen en je expertise te ontdekken</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="bio" className="text-lg font-semibold text-gray-700 mb-2 block">
                    Vertel iets over jezelf *
                  </Label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Waar ben je mee bezig? Wat zijn je interesses? Hoe gebruik je AI in je werk?

Tip: Je kunt Enter gebruiken om nieuwe alinea's te maken!"
                    className="w-full p-4 border border-gray-300 rounded-xl text-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Expertise Tags (optioneel)
                  </Label>
                  <p className="text-gray-500 mb-3">Voeg tags toe die je expertise beschrijven (bijv. &quot;AI&quot;, &quot;Marketing&quot;, &quot;Python&quot;, &quot;n8n&quot;)</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} ×
                      </Badge>
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
                    className="text-lg py-3"
                  />
                </div>

                <div className="flex justify-between pt-6">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 text-lg"
                  >
                    Vorige stap
                  </Button>
                  
                  <Button
                    onClick={() => setCurrentStep(3)}
                    disabled={!canProceedToStep3}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold rounded-xl"
                  >
                    Volgende stap
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Community Rules */}
          {currentStep === 3 && (
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                  <Shield className="w-6 h-6 text-green-500" />
                  Communityregels van Automatiseren kun je leren
                </CardTitle>
                <p className="text-gray-600">Samen maken we deze community tot een fijne plek voor iedereen</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-2xl">🤝</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">We doen dit samen.</h4>
                      <p className="text-gray-600 text-sm">De mens staat centraal. Niet de AI, niet de tools. Wij.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-2xl">❓</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Geen domme vragen.</h4>
                      <p className="text-gray-600 text-sm">Iedereen leert. Iedereen begint ergens. Alles mag gevraagd worden.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <span className="text-2xl">🚫</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Geen verkoop buiten het promokanaal.</h4>
                      <p className="text-gray-600 text-sm">Kennis gaat voor commercie. Duidelijk is duidelijk.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-2xl">🌈</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Geen discriminatie of uitsluiting.</h4>
                      <p className="text-gray-600 text-sm">Wees menselijk. Houd het veilig. Voor iedereen.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <span className="text-2xl">🧠</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">We denken breder dan techniek.</h4>
                      <p className="text-gray-600 text-sm">AI raakt ook privacy, werk, zorg, beleid. Die context telt.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">We delen wat we weten.</h4>
                      <p className="text-gray-600 text-sm">Ook als het uit GPT komt. Graag zelfs. Maar zeg het er wel even bij.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-2xl">⚖️</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">AVG, GDPR en de EU AI Act zijn geen bijzaak.</h4>
                      <p className="text-gray-600 text-sm">We nemen Europese regels serieus. En helpen elkaar om het goed te doen.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <span className="text-2xl">💬</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Je hoeft niet alles te zeggen. Maar wel iets.</h4>
                      <p className="text-gray-600 text-sm">Lurken mag. Maar meedoen maakt het waardevoller, voor jou én de rest.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-2xl">🤝</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Conflicten lossen we volwassen op.</h4>
                      <p className="text-gray-600 text-sm">Feedback is welkom. Beledigingen niet. Moderators mogen ingrijpen.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-2xl">✂️</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Houd het kort als het kan.</h4>
                      <p className="text-gray-600 text-sm">We weten dat GPT mooie teksten kan maken. Maar bij dit soort onderwerpen telt eenvoud. Geen essays tenzij het écht moet.</p>
                    </div>
                  </div>
                </div>

                {/* Acceptance Checkbox */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rulesAccepted}
                      onChange={(e) => setRulesAccepted(e.target.checked)}
                      className="mt-1 w-5 h-5 text-green-600 border-2 border-green-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 mb-2">
                        ✅ Ik begrijp deze regels en ga ermee akkoord.
                      </p>
                      <p className="text-sm text-gray-600">
                        Zo houden we deze plek slim, open en werkbaar, voor iedereen die meedoet.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex justify-between pt-6">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 text-lg"
                  >
                    Vorige stap
                  </Button>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={!canComplete || isSubmitting}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Profiel aanmaken...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Akkoord! Naar de community 🎉
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Community Guidelines */}
          <Card className="mt-8 shadow-xl border-0 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  Welkom in onze community!
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Zelfpromotie</h4>
                      <p className="text-gray-600 text-sm">
                        Zelfpromotie is welkom, maar alleen in het daarvoor bestemde promotie kanaal. 
                        De rest draait om échte kennis delen.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Samen leren</h4>
                      <p className="text-gray-600 text-sm">
                        We zijn hier om van elkaar te leren. Deel je kennis open, 
                        zonder ego, zonder poespas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Vrijwillige moderators</h4>
                      <p className="text-gray-600 text-sm">
                        Onze moderators doen dit vrijwillig op donatie basis. 
                        Wees respectvol en help mee aan een fijne sfeer.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Coffee className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Net begonnen</h4>
                      <p className="text-gray-600 text-sm">
                        We zijn net begonnen en kijken ernaar uit om prachtige kennis 
                        te delen en discussies te voeren met jullie! ❤️
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <>
      <Unauthenticated>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Je moet ingelogd zijn</h1>
            <p className="text-gray-600 mb-6">Log in om je profiel in te vullen</p>
            <Button onClick={() => window.location.href = '/sign-in'}>
              Inloggen
            </Button>
          </div>
        </div>
      </Unauthenticated>
      
      <AuthLoading>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg text-gray-600">Welkom voorbereiden...</p>
          </div>
        </div>
      </AuthLoading>
      
      <Authenticated>
        <OnboardingContent />
      </Authenticated>
    </>
  );
} 