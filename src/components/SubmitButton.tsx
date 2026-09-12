'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

export default function SubmitButton({
  disabled,
  idleLabel = 'Kaydet',
  pendingLabel = 'Kaydediliyor…',
  className,
}: {
  disabled?: boolean
  idleLabel?: string
  pendingLabel?: string
  className?: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={
        className ??
        'inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50'
      }
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? pendingLabel : idleLabel}
    </button>
  )
}
