import React from 'react'

export const Avatar: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  return <div {...props} />
}

export const AvatarFallback: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  return <div {...props} />
}

export default { Avatar, AvatarFallback }
