"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Smile,
  Link as LinkIcon 
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

interface TiptapEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export interface TiptapEditorRef {
  getContent: () => string;
  setContent: (content: string) => void;
  focus: () => void;
  clear: () => void;
}

export const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  ({ 
    value = '', 
    onChange, 
    placeholder = 'Start typing...', 
    disabled = false,
    className
  }, ref) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiButtonRef = useRef<HTMLButtonElement>(null);

    const editor = useEditor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder,
        }),
        Link.configure({
          openOnClick: false,
        }),
      ],
      content: value,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange?.(html);
      },
      editable: !disabled,
    });

    useImperativeHandle(ref, () => ({
      getContent: () => {
        return editor?.getHTML() || '';
      },
      setContent: (content: string) => {
        editor?.commands.setContent(content);
      },
      focus: () => {
        editor?.commands.focus();
      },
      clear: () => {
        editor?.commands.clearContent();
      }
    }));

    // Update editor content when value prop changes
    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value);
      }
    }, [value, editor]);

    const handleEmojiSelect = (emojiData: any) => {
      if (editor) {
        editor.chain().focus().insertContent(emojiData.emoji).run();
        setShowEmojiPicker(false);
      }
    };

    const addLink = () => {
      const url = window.prompt('URL');
      if (url) {
        editor?.chain().focus().setLink({ href: url }).run();
      }
    };

    if (!editor) {
      return null;
    }

    return (
      <div className={cn("border border-gray-300 rounded-lg overflow-hidden min-h-[400px] flex flex-col tiptap-editor", className)}>
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "p-2 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('bold') ? 'bg-gray-200' : ''
            )}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "p-2 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('italic') ? 'bg-gray-200' : ''
            )}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "p-2 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('bulletList') ? 'bg-gray-200' : ''
            )}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "p-2 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('orderedList') ? 'bg-gray-200' : ''
            )}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              "p-2 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('blockquote') ? 'bg-gray-200' : ''
            )}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={addLink}
            className={cn(
              "p-2 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('link') ? 'bg-gray-200' : ''
            )}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

                     <div className="relative">
             <button
               ref={emojiButtonRef}
               type="button"
               onClick={() => setShowEmojiPicker(!showEmojiPicker)}
               className="p-2 rounded hover:bg-gray-200 transition-colors"
               title="Add Emoji"
             >
               <Smile className="w-4 h-4" />
             </button>
           </div>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Editor Content */}
        <div className="flex-1 flex flex-col">
          <EditorContent 
            editor={editor} 
            className="prose prose-sm max-w-none p-4 flex-1 focus-within:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:ring-0 [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:focus:ring-0 [&_.ProseMirror]:focus:border-none"
          />
        </div>

        {/* Emoji Picker Overlay */}
        {showEmojiPicker && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-[9998] bg-black/20" 
              onClick={() => setShowEmojiPicker(false)}
            />
            
            {/* Emoji Picker */}
            <div 
              className="fixed z-[9999] bg-white rounded-lg shadow-xl border"
              style={{
                top: emojiButtonRef.current ? 
                  emojiButtonRef.current.getBoundingClientRect().bottom + 8 : '50%',
                left: emojiButtonRef.current ? 
                  Math.max(8, emojiButtonRef.current.getBoundingClientRect().left - 150) : '50%',
                transform: !emojiButtonRef.current ? 'translate(-50%, -50%)' : 'none'
              }}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                width={300}
                height={400}
              />
            </div>
          </>
        )}
      </div>
    );
  }
);

TiptapEditor.displayName = 'TiptapEditor'; 