'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface Props {
  content?: Record<string, unknown>;
  onChange?: (json: Record<string, unknown>) => void;
  locale?: 'en' | 'hi' | 'mr';
  readOnly?: boolean;
}

export default function RichTextEditor({ content, onChange, locale = 'en', readOnly = false }: Props) {
  const isDevanagari = locale !== 'en';
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write lesson content here...' }),
    ],
    content: content ?? '',
    editable: !readOnly,
    onUpdate: ({ editor }) => onChange?.(editor.getJSON() as Record<string, unknown>),
  });

  return (
    <div
      className="border rounded-lg overflow-hidden"
      style={{
        fontFamily: isDevanagari ? 'Noto Sans Devanagari, sans-serif' : undefined,
        lineHeight: isDevanagari ? 1.8 : 1.5,
      }}
    >
      {!readOnly && (
        <div className="bg-gray-50 border-b px-3 py-2 flex gap-2 flex-wrap">
          {[
            { label: 'B', action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
            { label: 'I', action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive('italic') },
            { label: 'H2', action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive('heading', { level: 2 }) },
            { label: '• List', action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive('bulletList') },
            { label: '</> Code', action: () => editor?.chain().focus().toggleCodeBlock().run(), active: editor?.isActive('codeBlock') },
          ].map(btn => (
            <button key={btn.label} onClick={btn.action}
              className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                btn.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}>
              {btn.label}
            </button>
          ))}
        </div>
      )}
      <EditorContent editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-48 focus:outline-none" />
    </div>
  );
}
