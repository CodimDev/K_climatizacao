import React, { createContext, useContext, useState } from 'react'

type CtxType = { open: boolean; setOpen: (v: boolean) => void }
const Ctx = createContext<CtxType>({ open: false, setOpen: () => {} })

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false)
  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>
}

export const DropdownMenuTrigger: React.FC<{
  asChild?: boolean
  children: React.ReactElement
  onClick?: (e: any) => void
}> = ({ children, onClick }) => {
  const { open, setOpen } = useContext(Ctx)
  const handleClick = (e: any) => {
    onClick?.(e)
    setOpen(!open)
  }
  return React.cloneElement(children, { onClick: handleClick })
}

export const DropdownMenuContent: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const { open } = useContext(Ctx)
  if (!open) return null
  return <div {...props} />
}

export const DropdownMenuItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div role="menuitem" {...props} />

export const DropdownMenuSeparator: React.FC = () => <div />
