import * as React from 'react'

type SelectProps = {
  value?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [internal, setInternal] = React.useState(value || '')
  React.useEffect(() => {
    if (value !== undefined) setInternal(value)
  }, [value])
  const ctx = React.useMemo(
    () => ({ value: internal, setValue: (v: string) => { setInternal(v); onValueChange?.(v) } }),
    [internal, onValueChange]
  )
  return <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>
}

const SelectContext = React.createContext<{ value: string; setValue: (v: string) => void } | null>(null)

export function SelectTrigger({ className = '', children }: { className?: string; children?: React.ReactNode }) {
  return <div className={`flex items-center justify-between rounded-md border px-3 py-2 h-9 ${className}`}>{children}</div>
}

export function SelectValue() {
  const ctx = React.useContext(SelectContext)
  return <span className="text-sm">{ctx?.value}</span>
}

export function SelectContent({ className = '', children }: { className?: string; children?: React.ReactNode }) {
  return <div className={`mt-2 rounded-md border bg-popover p-1 ${className}`}>{children}</div>
}

export function SelectItem({ value, children }: { value: string; children?: React.ReactNode }) {
  const ctx = React.useContext(SelectContext)
  const active = ctx?.value === value
  return (
    <div
      role="option"
      aria-selected={active}
      onClick={() => ctx?.setValue(value)}
      className={`px-2 py-1.5 rounded text-sm cursor-pointer ${active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted'}`}
    >
      {children}
    </div>
  )
}

export default Select
