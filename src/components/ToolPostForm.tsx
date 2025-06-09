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

interface ToolPostFormProps {
  kanaalId: Id<"channels">;
  currentUserId: Id<"users">;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ToolPostForm({ 
  kanaalId, 
  currentUserId, 
  onSuccess, 
  onCancel 
}: ToolPostFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [titel, setTitel] = useState("");
  const [omschrijving, setOmschrijving] = useState("");
  const [link, setLink] = useState("");
  const [label, setLabel] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createToolPost = useMutation(api.toolbibliotheek.createToolPost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titel.trim() || !omschrijving.trim() || !link.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createToolPost({
        kanaalId,
        titel: titel.trim(),
        omschrijving: omschrijving.trim(),
        link: link.trim(),
        label: label as any || undefined,
        auteurId: currentUserId,
      });

      // Reset form
      setTitel("");
      setOmschrijving("");
      setLink("");
      setLabel("");
      setIsOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating tool post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitel("");
    setOmschrijving("");
    setLink("");
    setLabel("");
    setIsOpen(false);
    
    if (onCancel) {
      onCancel();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
        size="lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        Tool delen
      </Button>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50/50 to-orange-50/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-slate-800">
            Nieuwe tool delen
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
              Tool naam *
            </Label>
            <Input
              id="titel"
              value={titel}
              onChange={(e) => setTitel(e.target.value)}
              placeholder="Bijv. ChatGPT, Midjourney, Notion AI..."
              className="border-slate-300 focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          {/* Omschrijving */}
          <div className="space-y-2">
            <Label htmlFor="omschrijving" className="text-sm font-medium text-slate-700">
              Omschrijving *
            </Label>
            <Textarea
              id="omschrijving"
              value={omschrijving}
              onChange={(e) => setOmschrijving(e.target.value)}
              placeholder="Korte uitleg over wat de tool doet en waarvoor je het gebruikt (max. 3 regels)"
              className="border-slate-300 focus:border-orange-500 focus:ring-orange-500 min-h-[80px] max-h-[120px]"
              required
            />
            <p className="text-xs text-slate-500">
              Houd het kort en praktisch - max. 3 regels
            </p>
          </div>

          {/* Link */}
          <div className="space-y-2">
            <Label htmlFor="link" className="text-sm font-medium text-slate-700">
              Link naar tool *
            </Label>
            <Input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              className="border-slate-300 focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          {/* Label (optioneel) */}
          <div className="space-y-2">
            <Label htmlFor="label" className="text-sm font-medium text-slate-700">
              Type (optioneel)
            </Label>
            <select
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecteer type...</option>
              <option value="gratis">Gratis</option>
              <option value="betaald">Betaald</option>
              <option value="freemium">Freemium</option>
              <option value="open source">Open Source</option>
            </select>
          </div>

          {/* Submit buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !titel.trim() || !omschrijving.trim() || !link.trim()}
              className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
            >
              {isSubmitting ? "Bezig met delen..." : "Tool delen"}
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