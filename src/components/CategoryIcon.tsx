'use client'

import { LayoutGrid } from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

export default function CategoryIcon({ name, className }: { name: string; className?: string }) {
  return (
    <DynamicIcon
      name={name as IconName}
      className={className}
      fallback={() => <LayoutGrid className={className} />}
    />
  )
}
