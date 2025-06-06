"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface PollCreatorProps {
  onPollChange: (pollData: {
    vraag: string;
    opties: string[];
    multipleChoice: boolean;
  } | null) => void;
}

export default function PollCreator({ onPollChange }: PollCreatorProps) {
  const [vraag, setVraag] = useState("");
  const [opties, setOpties] = useState(["", ""]);
  const [multipleChoice, setMultipleChoice] = useState(false);

  const addOptie = () => {
    if (opties.length < 10) {
      setOpties([...opties, ""]);
    }
  };

  const removeOptie = (index: number) => {
    if (opties.length > 2) {
      const newOpties = opties.filter((_, i) => i !== index);
      setOpties(newOpties);
      updatePollData(vraag, newOpties, multipleChoice);
    }
  };

  const updateOptie = (index: number, value: string) => {
    const newOpties = [...opties];
    newOpties[index] = value;
    setOpties(newOpties);
    updatePollData(vraag, newOpties, multipleChoice);
  };

  const updateVraag = (value: string) => {
    setVraag(value);
    updatePollData(value, opties, multipleChoice);
  };

  const updateMultipleChoice = (value: boolean) => {
    setMultipleChoice(value);
    updatePollData(vraag, opties, value);
  };

  const updatePollData = (newVraag: string, newOpties: string[], newMultipleChoice: boolean) => {
    const filledOpties = newOpties.filter(optie => optie.trim() !== "");
    
    if (newVraag.trim() && filledOpties.length >= 2) {
      onPollChange({
        vraag: newVraag.trim(),
        opties: filledOpties,
        multipleChoice: newMultipleChoice,
      });
    } else {
      onPollChange(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Poll Question */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Poll Vraag *
        </label>
        <input
          type="text"
          value={vraag}
          onChange={(e) => updateVraag(e.target.value)}
          placeholder="Wat is je vraag?"
          className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={200}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {vraag.length}/200 karakters
        </div>
      </div>

      {/* Poll Options */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Antwoordopties *
        </label>
        <div className="space-y-2">
          {opties.map((optie, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={optie}
                onChange={(e) => updateOptie(index, e.target.value)}
                placeholder={`Optie ${index + 1}`}
                className="flex-1 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={100}
              />
              {opties.length > 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeOptie(index)}
                  className="px-3"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {opties.length < 10 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addOptie}
            className="mt-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Optie toevoegen
          </Button>
        )}
        
        <div className="text-xs text-muted-foreground mt-1">
          Minimaal 2 opties, maximaal 10 opties
        </div>
      </div>

      {/* Multiple Choice Option */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="multipleChoice"
          checked={multipleChoice}
          onChange={(e) => updateMultipleChoice(e.target.checked)}
          className="rounded border-border"
        />
        <label htmlFor="multipleChoice" className="text-sm text-foreground">
          Meerdere antwoorden toestaan
        </label>
      </div>

      {/* Validation Info */}
      <div className="text-xs text-muted-foreground">
        * Vul een vraag in en minimaal 2 antwoordopties om de poll te kunnen maken
      </div>
    </div>
  );
} 