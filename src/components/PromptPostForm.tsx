"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface PromptPostFormProps {
  kanaalId: Id<"channels">;
  currentUserId: Id<"users">;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PromptPostForm({ 
  kanaalId, 
  currentUserId, 
  onSuccess, 
  onCancel 
}: PromptPostFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [titel, setTitel] = useState("");
  const [prompt, setPrompt] = useState("");
  const [toelichting, setToelichting] = useState("");
  const [afbeelding, setAfbeelding] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPromptPost = useMutation(api.promptbibliotheek.createPromptPost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titel.trim() || !prompt.trim() || !toelichting.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createPromptPost({
        kanaalId,
        titel: titel.trim(),
        prompt: prompt.trim(),
        toelichting: toelichting.trim(),
        auteurId: currentUserId,
        afbeelding: afbeelding.trim() || undefined,
      });

      // Reset form
      setTitel("");
      setPrompt("");
      setToelichting("");
      setAfbeelding("");
      setIsOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating prompt post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitel("");
    setPrompt("");
    setToelichting("");
    setAfbeelding("");
    setIsOpen(false);
    
    if (onCancel) {
      onCancel();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        size="lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        Nieuwe prompt delen
      </Button>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-slate-800">
            Nieuwe prompt delen
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titel */}
          <div className="space-y-2">
            <Label htmlFor="titel" className="text-sm font-medium text-slate-700">
              Titel *
            </Label>
            <Input
              id="titel"
              value={titel}
              onChange={(e) => setTitel(e.target.value)}
              placeholder="Geef je prompt een duidelijke titel..."
              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-medium text-slate-700">
              Prompt *
            </Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Plak hier je prompt..."
              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm min-h-[120px]"
              required
            />
            <p className="text-xs text-slate-500">
              Dit wordt weergegeven in een codeblok met monospaced font
            </p>
          </div>

          {/* Toelichting */}
          <div className="space-y-2">
            <Label htmlFor="toelichting" className="text-sm font-medium text-slate-700">
              Toelichting *
            </Label>
            <Textarea
              id="toelichting"
              value={toelichting}
              onChange={(e) => setToelichting(e.target.value)}
              placeholder="Wanneer gebruik je deze prompt? Waarvoor werkt het goed? Waarom is het effectief?"
              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
              required
            />
          </div>

          {/* Optionele afbeelding */}
          <div className="space-y-2">
            <Label htmlFor="afbeelding" className="text-sm font-medium text-slate-700">
              Afbeelding (optioneel)
            </Label>
            <Input
              id="afbeelding"
              type="url"
              value={afbeelding}
              onChange={(e) => setAfbeelding(e.target.value)}
              placeholder="https://example.com/afbeelding.jpg"
              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500">
              Voeg een screenshot of voorbeeld afbeelding toe (optioneel)
            </p>
          </div>

          {/* Submit buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !titel.trim() || !prompt.trim() || !toelichting.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {isSubmitting ? "Bezig met delen..." : "Prompt delen"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="border-slate-300 hover:border-slate-400"
            >
              Annuleren
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 