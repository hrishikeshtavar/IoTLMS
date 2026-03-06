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

const TOOLBAR_BUTTONS = [
  { label: 'B',       title: 'Bold',        style: { fontWeight: 800 },      action: (e: any) => e?.chain().focus().toggleBold().run(),                    isActive: (e: any) => e?.isActive('bold') },
  { label: 'I',       title: 'Italic',      style: { fontStyle: 'italic' },  action: (e: any) => e?.chain().focus().toggleItalic().run(),                  isActive: (e: any) => e?.isActive('italic') },
  { label: 'H2',      title: 'Heading',     style: {},                        action: (e: any) => e?.chain().focus().toggleHeading({ level: 2 }).run(),      isActive: (e: any) => e?.isActive('heading', { level: 2 }) },
  { label: '• List',  title: 'Bullet List', style: {},                        action: (e: any) => e?.chain().focus().toggleBulletList().run(),               isActive: (e: any) => e?.isActive('bulletList') },
  { label: '</>',     title: 'Code Block',  style: { fontFamily: 'monospace' }, action: (e: any) => e?.chain().focus().toggleCodeBlock().run(),             isActive: (e: any) => e?.isActive('codeBlock') },
];

export default function RichTextEditor({ content, onChange, locale = 'en', readOnly = false }: Props) {
  const isDevanagari = locale !== 'en';

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write lesson content here...' }),
    ],
    content: content ?? '',
    editable: !readOnly,
    onUpdate: ({ editor }) => onChange?.(editor.getJSON() as Record<string, unknown>),
  });

  return (
    <div style={{ border: '1.5px solid var(--border)', borderRadius: '1rem', overflow: 'hidden', background: 'var(--card)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>

      {/* TOOLBAR */}
      {!readOnly && (
        <div style={{ background: 'var(--bg)', borderBottom: '1.5px solid var(--border)', padding: '0.6rem 0.85rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {TOOLBAR_BUTTONS.map(btn => {
            const active = btn.isActive(editor);
            return (
              <button key={btn.label} onClick={btn.action.bind(null, editor)} title={btn.title}
                style={{ ...btn.style, padding: '0.3rem 0.65rem', borderRadius: '0.4rem', fontSize: '0.78rem', fontFamily: "'Baloo 2', sans-serif", border: '1.5px solid', borderColor: active ? 'var(--primary)' : 'var(--border)', background: active ? 'var(--primary)' : 'var(--card)', color: active ? '#fff' : 'var(--text2)', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; } }}>
                {btn.label}
              </button>
            );
          })}
          <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text3)' }}>
            {isDevanagari ? '🇮🇳 Devanagari mode' : '🇬🇧 English mode'}
          </div>
        </div>
      )}

      {/* EDITOR CONTENT */}
      <style>{`
        .iotlearn-editor .ProseMirror {
          outline: none;
          padding: 1.5rem;
          min-height: 280px;
          font-family: ${isDevanagari ? "'Noto Sans Devanagari', sans-serif" : "'Baloo 2', sans-serif"};
          font-size: ${isDevanagari ? '1.05rem' : '1rem'};
          line-height: ${isDevanagari ? '1.9' : '1.7'};
          color: var(--text2);
        }
        .iotlearn-editor .ProseMirror p { margin-bottom: 0.85rem; }
        .iotlearn-editor .ProseMirror h2 { font-size: 1.3rem; font-weight: 700; color: var(--text); margin: 1.5rem 0 0.6rem; font-family: 'Baloo 2', sans-serif; }
        .iotlearn-editor .ProseMirror ul { padding-left: 1.5rem; margin-bottom: 0.85rem; }
        .iotlearn-editor .ProseMirror li { margin-bottom: 0.3rem; }
        .iotlearn-editor .ProseMirror pre { background: #1A1A2E; color: #00C896; border-radius: 0.75rem; padding: 1rem 1.25rem; font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 0.85rem; margin-bottom: 1rem; overflow-x: auto; }
        .iotlearn-editor .ProseMirror code { background: rgba(255,107,53,0.1); color: var(--primary); padding: 0.1rem 0.35rem; border-radius: 0.25rem; font-size: 0.875em; font-family: 'Courier New', monospace; }
        .iotlearn-editor .ProseMirror strong { color: var(--text); font-weight: 700; }
        .iotlearn-editor .ProseMirror em { color: var(--text2); }
        .iotlearn-editor .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--text3); float: left; height: 0; pointer-events: none; }
        .iotlearn-editor .ProseMirror blockquote { border-left: 3px solid var(--primary); padding-left: 1rem; color: var(--text3); margin: 1rem 0; font-style: italic; }
      `}</style>
      <div className="iotlearn-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
