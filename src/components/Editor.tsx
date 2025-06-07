"use client";

import { TiptapEditor, TiptapEditorRef } from "@/components/ui/tiptap-editor";
import { useRef } from "react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function Editor({ 
  value, 
  onChange, 
  placeholder = "Schrijf je bericht...",
  minHeight = "200px"
}: EditorProps) {
  const editorRef = useRef<TiptapEditorRef>(null);

  return (
    <TiptapEditor
      ref={editorRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-border rounded-lg"
    />
  );
} 