import { PERMISSION_DEFAULTS, type Permissions } from '@/lib/permissions'

const PERMISSION_FIELDS: { key: keyof Permissions; label: string; description: string }[] = [
  {
    key: 'can_manage_articles',
    label: 'Yazıları yönetebilir',
    description: 'Yeni yazı oluşturabilir ve mevcut yazıları düzenleyebilir.',
  },
  {
    key: 'can_publish_articles',
    label: 'Yazıları yayınlayabilir',
    description: 'Yazıları yayınlayabilir veya yayından kaldırabilir.',
  },
  {
    key: 'can_delete_articles',
    label: 'Yazıları silebilir',
    description: 'Yazıları kalıcı olarak silebilir.',
  },
  {
    key: 'can_manage_users',
    label: 'Kullanıcıları yönetebilir',
    description: 'Yeni kullanıcı davet edebilir, izinleri düzenleyebilir ve kullanıcı kaldırabilir.',
  },
]

export default function PermissionCheckboxes({
  defaultPermissions,
}: {
  defaultPermissions?: Partial<Permissions>
}) {
  return (
    <div className="space-y-2">
      {PERMISSION_FIELDS.map(({ key, label, description }) => (
        <label
          key={key}
          className="flex items-start gap-3 rounded-md border border-slate-200 p-3 hover:bg-slate-50"
        >
          <input
            type="checkbox"
            name={key}
            defaultChecked={defaultPermissions?.[key] ?? PERMISSION_DEFAULTS[key]}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
          />
          <span>
            <span className="block text-sm font-medium text-slate-900">{label}</span>
            <span className="block text-xs text-slate-500">{description}</span>
          </span>
        </label>
      ))}
    </div>
  )
}
