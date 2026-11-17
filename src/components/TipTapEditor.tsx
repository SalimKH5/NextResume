"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import {
  Bold,
  Check,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Palette,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { IconButton } from "./editor/Tip";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

// Resume text: no headings / code blocks (they clash with the template styles in the PDF).
const extensions = [
  TextStyleKit,
  StarterKit.configure({
    heading: false,
    codeBlock: false,
    code: false,
    blockquote: false,
    horizontalRule: false,
    link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
  }),
];

const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

type Tool = {
  id: string;
  label: string;
  icon: LucideIcon;
  run: () => void;
  active?: boolean;
  disabled?: boolean;
  shortcut?: string;
};

/** Full formatting toolbar: named buttons, on/off state, arrow-key navigation (one tab stop). */
function MenuBar({ editor, onLink }: { editor: Editor; onLink: () => void }) {
  const { t } = useI18n();
  const { fontOptions } = useDragDrop();
  const r = t.editor.richText;
  const mod = isMac() ? "⌘" : "Ctrl+";
  const accent = fontOptions.secondColor || "#077a59";
  const barRef = useRef<HTMLDivElement>(null);
  const [focusIndex, setFocusIndex] = useState(0);

  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      link: e.isActive("link"),
      colored: !!e.getAttributes("textStyle").color,
      canIndent: e.can().sinkListItem("listItem"),
      canOutdent: e.can().liftListItem("listItem"),
      canUndo: e.can().chain().undo().run(),
      canRedo: e.can().chain().redo().run(),
    }),
  });

  const chain = () => editor.chain().focus();
  const groups: Tool[][] = [
    [
      { id: "bold", label: r.bold, icon: Bold, active: s.bold, shortcut: `${mod}B`, run: () => chain().toggleBold().run() },
      { id: "italic", label: r.italic, icon: Italic, active: s.italic, shortcut: `${mod}I`, run: () => chain().toggleItalic().run() },
      { id: "underline", label: r.underline, icon: Underline, active: s.underline, shortcut: `${mod}U`, run: () => chain().toggleUnderline().run() },
      { id: "strike", label: r.strike, icon: Strikethrough, active: s.strike, shortcut: `${mod}Shift+S`, run: () => chain().toggleStrike().run() },
    ],
    [
      { id: "bullets", label: r.bullets, icon: List, active: s.bullet, shortcut: `${mod}Shift+8`, run: () => chain().toggleBulletList().run() },
      { id: "numbered", label: r.numbered, icon: ListOrdered, active: s.ordered, shortcut: `${mod}Shift+7`, run: () => chain().toggleOrderedList().run() },
      { id: "outdent", label: r.outdent, icon: IndentDecrease, disabled: !s.canOutdent, shortcut: "Shift+Tab", run: () => chain().liftListItem("listItem").run() },
      { id: "indent", label: r.indent, icon: IndentIncrease, disabled: !s.canIndent, shortcut: "Tab", run: () => chain().sinkListItem("listItem").run() },
    ],
    [
      { id: "link", label: s.link ? r.editLink : r.link, icon: Link2, active: s.link, shortcut: `${mod}K`, run: onLink },
      {
        id: "accent",
        label: r.accent,
        icon: Palette,
        active: s.colored,
        run: () => (s.colored ? chain().unsetColor().run() : chain().setColor(accent).run()),
      },
      { id: "clear", label: r.clear, icon: RemoveFormatting, run: () => chain().unsetAllMarks().clearNodes().run() },
    ],
    [
      { id: "undo", label: t.editor.undo, icon: Undo2, disabled: !s.canUndo, shortcut: `${mod}Z`, run: () => chain().undo().run() },
      { id: "redo", label: t.editor.redo, icon: Redo2, disabled: !s.canRedo, shortcut: `${mod}Shift+Z`, run: () => chain().redo().run() },
    ],
  ];
  const flat = groups.flat();
  // the single tab stop must land on an enabled button
  const tabStop = flat[focusIndex]?.disabled ? Math.max(0, flat.findIndex((tool) => !tool.disabled)) : focusIndex;

  // Roving focus: Tab enters/leaves the toolbar once; arrows move inside it.
  const onKeyDown = (e: React.KeyboardEvent) => {
    // disabled buttons can't take focus, so navigation skips them
    const enabled = flat.map((tool, idx) => (tool.disabled ? -1 : idx)).filter((idx) => idx >= 0);
    if (!enabled.length) return;
    const pos = Math.max(0, enabled.indexOf(focusIndex));
    let next: number;
    if (e.key === "ArrowRight") next = enabled[(pos + 1) % enabled.length];
    else if (e.key === "ArrowLeft") next = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    else return;
    e.preventDefault();
    setFocusIndex(next);
    barRef.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };

  let i = -1;
  return (
    <div
      ref={barRef}
      role="toolbar"
      aria-label={r.toolbar}
      onKeyDown={onKeyDown}
      className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/80 p-1 backdrop-blur-sm"
    >
      {groups.map((group, g) => (
        <div key={g} role="group" className={cn("flex items-center gap-0.5", g === groups.length - 1 && "ml-auto")}>
          {g > 0 && g < groups.length - 1 && <span aria-hidden="true" className="mx-1 h-5 w-px bg-input" />}
          {group.map((tool) => {
            i += 1;
            const index = i;
            const Icon = tool.icon;
            return (
              <IconButton
                key={tool.id}
                label={tool.label}
                shortcut={tool.shortcut}
                side="top"
                tabIndex={index === tabStop ? 0 : -1}
                onFocus={() => setFocusIndex(index)}
                onClick={tool.run}
                disabled={tool.disabled}
                aria-pressed={tool.active === undefined ? undefined : tool.active}
                className={cn(tool.active && "bg-ink text-white hover:bg-ink/90")}
                style={tool.id === "accent" && !tool.active ? { color: accent } : undefined}
              >
                <Icon className="size-4" />
              </IconButton>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** Inline link editor shown under the toolbar. */
function LinkBar({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const { t } = useI18n();
  const r = t.editor.richText;
  const [url, setUrl] = useState<string>(editor.getAttributes("link").href ?? "");

  const apply = () => {
    const href = url.trim();
    if (!href) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const full = /^(https?:|mailto:|tel:)/i.test(href) ? href : `https://${href}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href: full }).run();
    }
    onClose();
  };

  return (
    <div data-nr-keep-open className="flex items-center gap-2 border-b border-input bg-mint-wash/60 px-2 py-1.5">
      <Link2 aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      <input
        autoFocus
        type="url"
        inputMode="url"
        aria-label={r.linkUrl}
        placeholder="https://"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // don't submit the surrounding form
            apply();
          } else if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation(); // close the link bar, not the dialog
            onClose();
            editor.commands.focus();
          }
        }}
        className="h-8 min-w-0 flex-1 rounded border border-input bg-white px-2 text-sm"
      />
      <IconButton label={r.applyLink} onClick={apply} side="top">
        <Check className="size-4" />
      </IconButton>
      {editor.isActive("link") && (
        <IconButton
          label={r.removeLink}
          side="top"
          onClick={() => {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            onClose();
          }}
        >
          <Link2Off className="size-4" />
        </IconButton>
      )}
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
  const { t } = useI18n();
  const [linkOpen, setLinkOpen] = useState(false);
  const [words, setWords] = useState(0);

  const editor = useEditor({
    extensions,
    content: value,
    editorProps: {
      attributes: {
        class: "nr-rich min-h-28 w-full px-4 py-3 text-[15px] leading-relaxed text-ink outline-none",
        role: "textbox",
        "aria-multiline": "true",
        ...(labelledBy ? { "aria-labelledby": labelledBy } : {}),
      },
      handleKeyDown: (_view, event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
          event.preventDefault();
          setLinkOpen(true);
          return true;
        }
        return false;
      },
    },
    immediatelyRender: false,
    onCreate: ({ editor: e }) => setWords(countWords(e.getText())),
    onUpdate: ({ editor: e }) => {
      setWords(countWords(e.getText()));
      onChange({ target: { value: e.getHTML() } });
    },
  });

  if (!editor) return <div className="min-h-40 rounded-md border border-input bg-muted/40" aria-hidden="true" />;

  return (
    <div className="overflow-hidden rounded-md border border-input bg-white transition-shadow focus-within:shadow-[0_0_0_3px_rgba(23,226,165,0.35)]">
      <MenuBar editor={editor} onLink={() => setLinkOpen((o) => !o)} />
      {linkOpen && <LinkBar editor={editor} onClose={() => setLinkOpen(false)} />}
      <EditorContent editor={editor} />
      <p className="border-t border-input/40 px-3 py-1 text-right text-xs text-muted-foreground" aria-live="off">
        {t.editor.richText.words(words)}
      </p>
    </div>
  );
}

const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);
