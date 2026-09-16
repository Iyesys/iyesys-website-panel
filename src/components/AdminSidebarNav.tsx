'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Newspaper, Settings, Users, HelpCircle, LayoutGrid } from 'lucide-react'

export default function AdminSidebarNav({ showUsers }: { showUsers: boolean }) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: 'Yazılar', icon: Newspaper },
    { href: '/admin/faqs', label: 'SSS', icon: HelpCircle },
    { href: '/admin/menu', label: 'Menü', icon: LayoutGrid },
    ...(showUsers ? [{ href: '/admin/users', label: 'Kullanıcılar', icon: Users }] : []),
    { href: '/admin/settings', label: 'Ayarlar', icon: Settings },
  ]

  return (
    <nav className="flex-1 space-y-1 p-3">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
