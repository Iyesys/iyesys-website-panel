'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Trash2, Loader2 } from 'lucide-react'

function ConfirmDeleteButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? 'Siliniyor…' : 'Evet, Sil'}
    </button>
  )
}

export default function DeleteCategoryButton({ action, itemCount }: { action: () => void; itemCount: number }) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Sil
      </button>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-base font-semibold text-slate-900">Kategoriyi sil</h2>
            <p className="mt-2 text-sm text-slate-500">
              {itemCount > 0
                ? `Bu kategoride ${itemCount} çözüm var. Kategoriyi silmek bu çözümleri de kalıcı olarak siler. Emin misiniz?`
                : 'Bu kategoriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                İptal
              </button>
              <form action={action}>
                <ConfirmDeleteButton />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
