"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const EMOJI_CATEGORIES = {
  "Objecten": ["📌", "🛠️", "🔧", "⚙️", "🧲", "🔗", "📋", "📂", "📁", "🗂️", "📊", "📈", "📉", "💼", "🎯", "🚀", "⭐", "🔥", "💡", "🔍"],
  "Symbolen": ["🧭", "💬", "🧷", "📍", "🎪", "🎨", "🌟", "✨", "⚡", "🎲", "🎮", "🎯", "🔮", "💫", "🌈", "🎊", "🎉", "🏆", "👑", "💎"],
  "Natuur": ["🌱", "🌿", "🍀", "🌳", "🌲", "🌴", "🌵", "🌻", "🌸", "🌺", "🌹", "🌷", "🌼", "🌙", "☀️", "🌞", "⭐", "🌟", "✨", "🔥"],
  "Activiteiten": ["🎯", "🎪", "🎨", "🎭", "🎪", "🎨", "🎲", "🎮", "🎯", "🎪", "🎨", "🎭", "🎪", "🎨", "🎲", "🎮", "🎯", "🎪", "🎨", "🎭"],
  "Voedsel": ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🥝", "🍑", "🥥", "🥑", "🍆", "🥕", "🌽", "🌶️", "🥒", "🥬", "🥦", "🧄", "🧅"],
  "Gezichten": ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙"]
};

interface EmojiPickerProps {
  currentEmoji?: string;
  onEmojiSelect: (emoji: string) => void;
  trigger?: React.ReactNode;
}

export default function EmojiPicker({ currentEmoji, onEmojiSelect, trigger }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Objecten");

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      {currentEmoji || "😀"} Emoji kiezen
    </Button>
  );

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || defaultTrigger}
      </div>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-0">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap gap-1 p-2">
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="p-3 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-8 gap-1">
              {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES]?.map((emoji, index) => (
                <Button
                  key={`${emoji}-${index}`}
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-gray-100"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  <span className="text-lg">{emoji}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 