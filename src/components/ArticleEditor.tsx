'use client'

import { useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, Heading2, List, ListOrdered, Quote, ImageIcon, LinkIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function uploadPath(file: File) {
  const ext = file.name.split('.').pop()
  const random = Math.random().toString(36).slice(2, 10)
  return `inline/${Date.now()}-${random}.${ext}`
}

export default function ArticleEditor({
  content,
  onChange,
}: {
  content: string
  onChange: (html: string) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Yazınızı buraya yazın…' }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[300px] focus:outline-none px-4 py-3',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return
      const supabase = createClient()
      const path = uploadPath(file)

      const { error } = await supabase.storage.from('article-images').upload(path, file)
      if (error) {
        alert(`Görsel yüklenemedi: ${error.message}`)
        return
      }

      const { data } = supabase.storage.from('article-images').getPublicUrl(path)
      editor.chain().focus().setImage({ src: data.publicUrl }).run()
    },
    [editor]
  )

  if (!editor) return null

  return (
    <div className="rounded-md border border-slate-300 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 p-2">
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('link')}
          onClick={() => {
            const url = window.prompt('Bağlantı URL’si')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()}>
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) uploadImage(file)
            e.target.value = ''
          }}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

function ToolbarButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded p-1.5 text-slate-600 hover:bg-slate-100 ${active ? 'bg-slate-200 text-slate-900' : ''}`}
    >
      {children}
    </button>
  )
}
