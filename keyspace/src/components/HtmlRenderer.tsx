"use client";

import { cn } from "@/lib/utils";

interface HtmlRendererProps {
  content: string;
  className?: string;
  preview?: boolean;
  maxLength?: number;
}

export default function HtmlRenderer({ 
  content, 
  className, 
  preview = false, 
  maxLength = 450
}: HtmlRendererProps) {
  // Voor preview mode: behoud line breaks en limiteer lengte
  if (preview) {
    // Vervang <br> tags met newlines voordat we HTML strippen
    const contentWithNewlines = content.replace(/<br\s*\/?>/gi, '\n');
    const textContent = contentWithNewlines.replace(/<[^>]*>/g, '').trim();
    
    const truncated = textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...' 
      : textContent;
    
    // Split op newlines en render elke regel apart
    const lines = truncated.split('\n');
    
    return (
      <div className={cn("text-gray-600 leading-relaxed", className)}>
        {lines.map((line, index) => (
          <span key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </span>
        ))}
      </div>
    );
  }

  // Voor volledige weergave: render HTML veilig
  return (
    <div 
      className={cn(
        "prose prose-sm max-w-none",
        "prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground",
        "prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground",
        "prose-blockquote:text-foreground prose-blockquote:border-l-primary",
        "prose-a:text-primary hover:prose-a:text-primary/80",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
} 