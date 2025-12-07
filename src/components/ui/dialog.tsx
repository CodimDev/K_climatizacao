import React, { createContext, useContext } from 'react'

type DialogCtx = {
  open: boolean
  onOpenChange?: (open: boolean) => void
}

const Ctx = createContext<DialogCtx>({ open: false })

export const Dialog: React.FC<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}> = ({ open = false, onOpenChange, children }) => {
  return <Ctx.Provider value={{ open, onOpenChange }}>{children}</Ctx.Provider>
}

export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => {
  const { open } = useContext(Ctx)
  if (!open) return null
  return <div {...props} />
}

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} />

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => <h2 {...props} />
