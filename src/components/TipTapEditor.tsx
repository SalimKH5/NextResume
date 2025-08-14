'use client'

import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent, useEditorState, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'

// Lucide Icons
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Undo,
  Redo,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Quote,
  Minus,
  Pilcrow,
  Eraser,
} from 'lucide-react'

// Helper to join classes
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ')

const extensions = [TextStyleKit, StarterKit]

function MenuBar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ctx => ({
      isBold: ctx.editor.isActive('bold'),
      canBold: ctx.editor.can().chain().focus().toggleBold().run(),
      isItalic: ctx.editor.isActive('italic'),
      canItalic: ctx.editor.can().chain().focus().toggleItalic().run(),
      isStrike: ctx.editor.isActive('strike'),
      canStrike: ctx.editor.can().chain().focus().toggleStrike().run(),
      isCode: ctx.editor.isActive('code'),
      isParagraph: ctx.editor.isActive('paragraph'),
      isHeading1: ctx.editor.isActive('heading', { level: 1 }),
      isHeading2: ctx.editor.isActive('heading', { level: 2 }),
      isHeading3: ctx.editor.isActive('heading', { level: 3 }),
      isHeading4: ctx.editor.isActive('heading', { level: 4 }),
      isHeading5: ctx.editor.isActive('heading', { level: 5 }),
      isHeading6: ctx.editor.isActive('heading', { level: 6 }),
      isBulletList: ctx.editor.isActive('bulletList'),
      isOrderedList: ctx.editor.isActive('orderedList'),
      isCodeBlock: ctx.editor.isActive('codeBlock'),
      isBlockquote: ctx.editor.isActive('blockquote'),
      canUndo: ctx.editor.can().chain().focus().undo().run(),
      canRedo: ctx.editor.can().chain().focus().redo().run(),
    }),
  })

  const btnStyle = (active: boolean) =>
    cn(
      'p-2 border rounded text-sm hover:bg-gray-200',
      active && 'bg-black text-white border-black'
    )

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b">
      <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!state.canBold} className={btnStyle(state.isBold)}>
        <Bold size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!state.canItalic} className={btnStyle(state.isItalic)}>
        <Italic size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!state.canStrike} className={btnStyle(state.isStrike)}>
        <Strikethrough size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleCode().run()} className={btnStyle(state.isCode)}>
        <Code size={16} />
      </button>

      <button onClick={() => editor.chain().focus().setParagraph().run()} className={btnStyle(state.isParagraph)}>
        <Pilcrow size={16} />
      </button>

      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnStyle(state.isHeading1)}>
        <Heading1 size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnStyle(state.isHeading2)}>
        <Heading2 size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnStyle(state.isHeading3)}>
        <Heading3 size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} className={btnStyle(state.isHeading4)}>
        <Heading4 size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} className={btnStyle(state.isHeading5)}>
        <Heading5 size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()} className={btnStyle(state.isHeading6)}>
        <Heading6 size={16} />
      </button>

      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${btnStyle(state.isBulletList)} list-item`}>
        <List  size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnStyle(state.isOrderedList)}>
        <ListOrdered size={16} />
      </button>

      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnStyle(state.isBlockquote)}>
        <Quote size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnStyle(state.isCodeBlock)}>
        {'</>'}
      </button>

      <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnStyle(false)}>
        <Minus size={16} />
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()} className={btnStyle(false)}>
        ↵
      </button>

      <button onClick={() => editor.chain().focus().unsetAllMarks().run()} className={btnStyle(false)}>
        <Eraser size={16} />
      </button>

      <button onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo} className={btnStyle(false)}>
        <Undo size={16} />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo} className={btnStyle(false)}>
        <Redo size={16} />
      </button>
    </div>
  )
}

type propos={
    value: string
  onChange: (e: { target: { value: string } }) => void
}


export default function TipTapEditor({value,onChange}:propos) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const editor = useEditor({
    extensions,
    content:value,
    editorProps: {
      attributes: {
        class: "flex flex-col gap-3 px-4 py-3  justify-start border-b border-r border-l border-gray-700 text-gray-400 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none",
      },
    },
    autofocus: false,
    injectCSS: true,
    editable: true,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange({ target: { value: editor.getHTML() } })
    },
  })

  if (!mounted || !editor) return null

  return (
    <div className="bg-white border rounded shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent   editor={editor} />
    </div>
  )
}
