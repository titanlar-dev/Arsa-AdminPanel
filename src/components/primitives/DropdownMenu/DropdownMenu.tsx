import { Menu } from '@base-ui/react/menu'
import { Check } from 'lucide-react'
import type {
  DropdownMenuProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
} from '../../../types/component-props'
import * as css from './DropdownMenu.css'

/**
 * Base UI `menu` üstüne kurulu genel amaçlı açılır menü.
 *
 * Repoda tetikleyici-butonlu bir dropdown yoktu; DataTable toolbar'ının sütun
 * görünürlük seçicisi için eklendi (AGENTS'ın işaret ettiği eksik). Erişilebilir
 * menü davranışını (ok tuşları, Esc, `role="menu"`, `aria-checked`, tip-ahead)
 * Base UI sağlar; bu katman yalnız görünümü ve tetikleyiciyi verir.
 *
 * Portal + Positioner deseni `DateRangePicker` (Popover) ile aynı; ölçüler
 * `internal/listbox.css.ts` ile hizalı.
 *
 * @example
 * <DropdownMenu trigger={<><Columns3 size={16} /> Sütunlar</>} label="Sütunları seç">
 *   <DropdownMenuCheckboxItem checked={g} onCheckedChange={setG}>Fiyat</DropdownMenuCheckboxItem>
 * </DropdownMenu>
 */
export function DropdownMenu({
  trigger,
  children,
  label,
  align = 'start',
  open,
  onOpenChange,
  disabled = false,
}: DropdownMenuProps) {
  return (
    <Menu.Root
      {...(open !== undefined && { open })}
      {...(onOpenChange !== undefined && { onOpenChange })}
    >
      <Menu.Trigger
        className={css.trigger}
        disabled={disabled}
        {...(label !== undefined && { 'aria-label': label })}
      >
        {trigger}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className={css.positioner} sideOffset={4} align={align}>
          <Menu.Popup className={css.popup}>{children}</Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

/** Tıklanabilir eylem öğesi. */
export function DropdownMenuItem({
  children,
  onSelect,
  disabled = false,
  closeOnClick = true,
}: DropdownMenuItemProps) {
  return (
    <Menu.Item
      className={css.item}
      disabled={disabled}
      closeOnClick={closeOnClick}
      {...(onSelect !== undefined && { onClick: onSelect })}
    >
      {children}
    </Menu.Item>
  )
}

/**
 * İşaretlenebilir öğe (sütun toggle'ı). Varsayılan olarak menüyü kapatmaz —
 * birden çok öğe arka arkaya işaretlenebilsin diye.
 */
export function DropdownMenuCheckboxItem({
  children,
  checked,
  onCheckedChange,
  disabled = false,
  closeOnClick = false,
}: DropdownMenuCheckboxItemProps) {
  return (
    <Menu.CheckboxItem
      className={css.checkboxItem}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      closeOnClick={closeOnClick}
    >
      <span className={css.checkSlot}>
        <Menu.CheckboxItemIndicator>
          <Check size={16} strokeWidth={3} aria-hidden="true" />
        </Menu.CheckboxItemIndicator>
      </span>
      <span className={css.itemLabel}>{children}</span>
    </Menu.CheckboxItem>
  )
}
