import React from 'react'

export type SwitchProps = React.InputHTMLAttributes<HTMLInputElement>

export const Switch: React.FC<SwitchProps> = (props) => {
  return <input type="checkbox" {...props} />
}

export default Switch
