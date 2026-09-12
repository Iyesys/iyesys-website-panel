'use client'

import { Trash2 } from 'lucide-react'

export default function DeleteArticleButton({ action }: { action: () => void }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm('Bu yazıyı silmek istediğinize emin misiniz?')) e.preventDefault()
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Sil
      </button>
    </form>
  )
}
