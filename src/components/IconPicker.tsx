'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { DynamicIcon, iconNames, type IconName } from 'lucide-react/dynamic'

const SUGGESTED: IconName[] = [
  'shield-check',
  'zap',
  'cpu',
  'code-2',
  'wrench',
  'truck',
  'camera',
  'hard-hat',
  'gauge',
  'factory',
  'radar',
  'settings-2',
  'layers-3',
  'package-check',
  'route',
  'map-pinned',
  'clipboard-check',
  'scan-line',
  'bell-ring',
  'shapes',
]

const MAX_RESULTS = 48

export default function IconPicker({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [value, setValue] = useState<string>(defaultValue || 'shapes')
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SUGGESTED
    return iconNames.filter((n) => n.includes(q)).slice(0, MAX_RESULTS)
  }, [query])

  return (
    <div>
      <input type="hidden" name={name} value={value} />

      <div className="flex items-center gap-3 rounded-md border border-slate-300 bg-white p-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700">
          <DynamicIcon
            name={value as IconName}
            className="h-4 w-4"
            fallback={() => <DynamicIcon name="shapes" className="h-4 w-4" />}
          />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{value}</p>
          <p className="text-xs text-slate-400">Seçili ikon</p>
        </div>
      </div>

      <div className="relative mt-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="İkon ara (ör. shield, camera, truck)…"
          className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div className="mt-2 grid max-h-56 grid-cols-6 gap-1.5 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-2 sm:grid-cols-8">
        {results.map((iconName) => (
          <button
            key={iconName}
            type="button"
            title={iconName}
            onClick={() => setValue(iconName)}
            className={`flex h-10 items-center justify-center rounded-md border transition-colors ${
              value === iconName
                ? 'border-slate-900 bg-white text-slate-900'
                : 'border-transparent text-slate-500 hover:bg-white hover:text-slate-900'
            }`}
          >
            <DynamicIcon name={iconName} className="h-4 w-4" />
          </button>
        ))}
        {results.length === 0 && (
          <p className="col-span-full py-4 text-center text-xs text-slate-400">Eşleşen ikon bulunamadı</p>
        )}
      </div>
    </div>
  )
}
