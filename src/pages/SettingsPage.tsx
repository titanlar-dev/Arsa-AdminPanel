import { useState } from 'react'
import {
  AdminPermission,
  AdminRole,
  ROLE_PERMISSIONS,
} from '../types/domain'
import type { ThemeName } from '../types/component-props'
import { SettingsPage as SettingsScreen } from '../screens/SettingsPage/SettingsPage'

const KAYITLI: Record<AdminRole, readonly AdminPermission[]> = {
  ...ROLE_PERMISSIONS,
}

export function SettingsPageWrapper() {
  const [rolePermissions, setRolePermissions] =
    useState<Record<AdminRole, readonly AdminPermission[]>>(KAYITLI)
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('corporate-blue')
  const [systemDefaultTheme, setSystemDefaultTheme] = useState<ThemeName>('corporate-blue')
  const [dirty, setDirty] = useState(false)

  const handlePermissionChange = (
    role: AdminRole,
    permission: AdminPermission,
    granted: boolean,
  ) => {
    setRolePermissions((prev) => {
      const current = [...prev[role]]
      const next = granted
        ? [...current, permission]
        : current.filter((p) => p !== permission)
      return { ...prev, [role]: next }
    })
    setDirty(true)
  }

  return (
    <SettingsScreen
      rolePermissions={rolePermissions}
      savedRolePermissions={KAYITLI}
      currentTheme={currentTheme}
      systemDefaultTheme={systemDefaultTheme}
      canManagePermissions={true}
      canManageDefaultTheme={true}
      dirty={dirty}
      onPermissionChange={handlePermissionChange}
      onThemeChange={(theme) => {
        setCurrentTheme(theme)
        document.documentElement.setAttribute('data-theme', theme)
      }}
      onSystemDefaultThemeChange={setSystemDefaultTheme}
      onSave={() => setDirty(false)}
      onReset={() => {
        setRolePermissions(KAYITLI)
        setDirty(false)
      }}
    />
  )
}
