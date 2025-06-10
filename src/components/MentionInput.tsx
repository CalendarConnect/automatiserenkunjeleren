"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  _id: string;
  naam: string;
  avatarUrl?: string;
  functie: string;
  organisatie: string;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string, mentions: string[]) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function MentionInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Typ je reactie...",
  disabled = false,
  className = "",
}: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionQuery, setSuggestionQuery] = useState("");
  const [caretPosition, setCaretPosition] = useState(0);
  const [currentMentionStart, setCurrentMentionStart] = useState(-1);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get users for suggestions
  const users = useQuery(
    api.users.searchUsersForMention,
    showSuggestions ? { searchTerm: suggestionQuery } : "skip"
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Extract current mentions from text
  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionedName = match[1].trim();
      const user = users?.find(u => 
        u.naam.toLowerCase() === mentionedName.toLowerCase()
      );
      if (user) {
        mentions.push(user._id);
      }
    }

    return [...new Set(mentions)];
  };

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    
    setCaretPosition(cursorPos);
    
    // Check for @ symbol and show suggestions
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      
      // Check if we're in a mention (no spaces after @, or only one word)
      if (!textAfterAt.includes(' ') || textAfterAt.trim().split(' ').length === 1) {
        setCurrentMentionStart(lastAtIndex);
        setSuggestionQuery(textAfterAt.trim());
        setShowSuggestions(true);
        setSelectedSuggestionIndex(0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }

    // Extract mentions and notify parent
    const mentions = extractMentions(newValue);
    onChange(newValue, mentions);
  };

  // Handle suggestion selection
  const selectSuggestion = (user: User) => {
    if (currentMentionStart === -1) return;

    const beforeMention = value.substring(0, currentMentionStart);
    const afterCursor = value.substring(caretPosition);
    
    const newValue = beforeMention + `@${user.naam} ` + afterCursor;
    const newCursorPos = beforeMention.length + user.naam.length + 2; // +2 for @ and space

    // Extract mentions and notify parent
    const mentions = extractMentions(newValue);
    onChange(newValue, mentions);
    
    setShowSuggestions(false);
    setCurrentMentionStart(-1);

    // Set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions && users && users.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev < users.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev > 0 ? prev - 1 : users.length - 1
          );
          break;
        case 'Enter':
          if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < users.length) {
            e.preventDefault();
            selectSuggestion(users[selectedSuggestionIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setShowSuggestions(false);
          break;
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        rows={3}
      />

      {/* Suggestions dropdown */}
      {showSuggestions && users && users.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
        >
          {users.map((user, index) => (
            <div
              key={user._id}
              onClick={() => selectSuggestion(user)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
                index === selectedSuggestionIndex ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="text-xs">
                  {getInitials(user.naam)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">
                  {user.naam}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user.functie} bij {user.organisatie}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 