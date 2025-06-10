"use client";

import Link from "next/link";

interface MentionedUser {
  _id: string;
  naam: string;
  clerkId: string;
}

interface MentionRendererProps {
  content: string;
  mentionedUsers?: MentionedUser[];
  className?: string;
}

export default function MentionRenderer({ 
  content, 
  mentionedUsers = [], 
  className = "" 
}: MentionRendererProps) {
  
  // Parse content and replace @mentions with linked components
  const renderContent = () => {
    if (!content) return null;

    // Regex to find @mentions in the text
    const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      const mentionText = match[1].trim();
      const matchStart = match.index;
      const matchEnd = match.index + match[0].length;

      // Add text before the mention
      if (matchStart > lastIndex) {
        parts.push(content.substring(lastIndex, matchStart));
      }

      // Find the user that was mentioned
      const mentionedUser = mentionedUsers.find(user => 
        user.naam.toLowerCase() === mentionText.toLowerCase()
      );

      if (mentionedUser) {
        // Render as a link to user profile
        parts.push(
          <Link
            key={`mention-${mentionedUser._id}-${matchStart}`}
            href={`/gebruiker/${mentionedUser.clerkId}`}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium bg-blue-50 px-1 py-0.5 rounded"
          >
            @{mentionedUser.naam}
          </Link>
        );
      } else {
        // Render as plain text if user not found
        parts.push(
          <span 
            key={`mention-unknown-${matchStart}`}
            className="text-gray-500 bg-gray-100 px-1 py-0.5 rounded"
          >
            @{mentionText}
          </span>
        );
      }

      lastIndex = matchEnd;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  // Split content by line breaks and render each line
  const renderWithLineBreaks = () => {
    const lines = content.split('\n');
    
    return lines.map((line, lineIndex) => {
      if (line.trim() === '') {
        return <br key={`br-${lineIndex}`} />;
      }

      // Process mentions in this line
      const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = mentionRegex.exec(line)) !== null) {
        const mentionText = match[1].trim();
        const matchStart = match.index;
        const matchEnd = match.index + match[0].length;

        // Add text before the mention
        if (matchStart > lastIndex) {
          parts.push(line.substring(lastIndex, matchStart));
        }

        // Find the user that was mentioned
        const mentionedUser = mentionedUsers.find(user => 
          user.naam.toLowerCase() === mentionText.toLowerCase()
        );

        if (mentionedUser) {
          // Render as a link to user profile
          parts.push(
            <Link
              key={`mention-${mentionedUser._id}-${lineIndex}-${matchStart}`}
              href={`/gebruiker/${mentionedUser.clerkId}`}
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium bg-blue-50 px-1 py-0.5 rounded"
            >
              @{mentionedUser.naam}
            </Link>
          );
        } else {
          // Render as plain text if user not found
          parts.push(
            <span 
              key={`mention-unknown-${lineIndex}-${matchStart}`}
              className="text-gray-500 bg-gray-100 px-1 py-0.5 rounded"
            >
              @{mentionText}
            </span>
          );
        }

        lastIndex = matchEnd;
      }

      // Add remaining text
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <span key={`line-${lineIndex}`}>
          {parts.length > 0 ? parts : line}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className={className}>
      {renderWithLineBreaks()}
    </div>
  );
} 