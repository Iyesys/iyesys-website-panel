'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, Heading2, List, ListOrdered, Quote, ImageIcon, LinkIcon, Check, X } from 'lucide-react'
import { toast } from 'sonner'
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
  const linkPopoverRef = useRef<HTMLDivElement>(null)
  const linkInputRef = useRef<HTMLInputElement>(null)

  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [savedSelection, setSavedSelection] = useState<{ from: number; to: number } | null>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
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

  const closeLinkPopover = useCallback(() => {
    setLinkPopoverOpen(false)
    setLinkUrl('')
    setSavedSelection(null)
  }, [])

  useEffect(() => {
    if (!linkPopoverOpen) return
    linkInputRef.current?.focus()

    function handleClickOutside(e: MouseEvent) {
      if (linkPopoverRef.current && !linkPopoverRef.current.contains(e.target as Node)) {
        closeLinkPopover()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [linkPopoverOpen, closeLinkPopover])

  const applyLink = useCallback(() => {
    if (!editor || !savedSelection || !linkUrl) return
    editor
      .chain()
      .focus()
      .setTextSelection(savedSelection)
      .extendMarkRange('link')
      .setLink({ href: linkUrl })
      .run()
    closeLinkPopover()
  }, [editor, savedSelection, linkUrl, closeLinkPopover])

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return
      const supabase = createClient()
      const path = uploadPath(file)

      const { error } = await supabase.storage.from('article-images').upload(path, file)
      if (error) {
        toast.error(`Görsel yüklenemedi: ${error.message}`)
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
      <div className="relative flex flex-wrap items-center gap-1 border-b border-slate-200 p-2">
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
            if (editor.isActive('link')) {
              editor.chain().focus().unsetLink().run()
              return
            }

            const { from, to } = editor.state.selection
            if (from === to) {
              toast.error('Lütfen önce bağlantı eklemek istediğiniz metni seçin.')
              return
            }

            setSavedSelection({ from, to })
            setLinkPopoverOpen(true)
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

        {linkPopoverOpen && (
          <div
            ref={linkPopoverRef}
            className="absolute left-2 top-full z-10 mt-1 flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1.5 shadow-md"
          >
            <input
              ref={linkInputRef}
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  applyLink()
                } else if (e.key === 'Escape') {
                  closeLinkPopover()
                }
              }}
              className="w-56 rounded border border-slate-300 px-2 py-1 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={applyLink}
              disabled={!linkUrl}
              className="rounded p-1 text-green-600 hover:bg-green-50 disabled:opacity-40"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={closeLinkPopover}
              className="rounded p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
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
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`rounded p-1.5 text-slate-600 hover:bg-slate-100 ${active ? 'bg-slate-200 text-slate-900' : ''}`}
    >
      {children}
    </button>
  )
}
