import React from 'react'

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

export const Label: React.FC<LabelProps> = (props) => {
  return <label {...props} />
}

export default Label
