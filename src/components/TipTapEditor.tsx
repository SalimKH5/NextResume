"use client";

import { useEditor, EditorContent, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Bold, Italic, List, ListOrdered, Redo2, Undo2, type LucideIcon } from "lucide-react";
import { IconButton } from "./editor/Tip";
import { useI18n } from "@/i18n/I18nProvider";

const extensions = [TextStyleKit, StarterKit];

/** Resume-sized toolbar: the formatting a resume actually uses, every button named. */
function MenuBar({ editor }: { editor: Editor }) {
  const { t } = useI18n();
  const r = t.editor.richText;
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      canUndo: e.can().chain().undo().run(),
      canRedo: e.can().chain().redo().run(),
    }),
  });

  const tools: { label: string; icon: LucideIcon; active?: boolean; disabled?: boolean; run: () => void; shortcut?: string }[] = [
    { label: r.bold, icon: Bold, active: s.bold, shortcut: "Ctrl+B", run: () => editor.chain().focus().toggleBold().run() },
    { label: r.italic, icon: Italic, active: s.italic, shortcut: "Ctrl+I", run: () => editor.chain().focus().toggleItalic().run() },
    { label: r.bullets, icon: List, active: s.bullet, run: () => editor.chain().focus().toggleBulletList().run() },
    { label: r.numbered, icon: ListOrdered, active: s.ordered, run: () => editor.chain().focus().toggleOrderedList().run() },
    { label: t.editor.undo, icon: Undo2, disabled: !s.canUndo, run: () => editor.chain().focus().undo().run() },
    { label: t.editor.redo, icon: Redo2, disabled: !s.canRedo, run: () => editor.chain().focus().redo().run() },
  ];

  return (
    <div role="toolbar" aria-label={r.toolbar} className="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/50 p-1">
      {tools.map(({ label, icon: Icon, active, disabled, run, shortcut }, i) => (
        <span key={label} className="contents">
          {i === 4 && <span aria-hidden="true" className="mx-1 h-5 w-px bg-input" />}
          <IconButton
            label={label}
            shortcut={shortcut}
            side="top"
            onClick={run}
            disabled={disabled}
            aria-pressed={active === undefined ? undefined : active}
            className={active ? "bg-ink text-white hover:bg-ink/90" : undefined}
          >
            <Icon className="size-4" />
          </IconButton>
        </span>
      ))}
    </div>
  );
}

type Props = {
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  /** id of the visible label, so the text area has an accessible name */
  labelledBy?: string;
};

export default function TipTapEditor({ value, onChange, labelledBy }: Props) {
  const editor = useEditor({
    extensions,
    content: value,
    editorProps: {
      attributes: {
        class: "min-h-28 w-full px-4 py-3 text-[15px] leading-relaxed text-ink outline-none",
        role: "textbox",
        "aria-multiline": "true",
        ...(labelledBy ? { "aria-labelledby": labelledBy } : {}),
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => onChange({ target: { value: e.getHTML() } }),
  });

  if (!editor) return <div className="min-h-36 rounded-md border border-input bg-muted/40" aria-hidden="true" />;

  return (
    <div className="overflow-hidden rounded-md border border-input bg-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
