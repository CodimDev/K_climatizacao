import { render, screen } from '@testing-library/react'
import React from 'react'
import { Button } from '../button'

describe('Button', () => {
  it('renderiza com texto e classe base', () => {
    render(<Button>Enviar</Button>)
    const btn = screen.getByText('Enviar')
    expect(btn).toBeInTheDocument()
    expect(btn.className).toMatch(/inline-flex/)
  })

  it('aplica variante ghost', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const btn = screen.getByText('Ghost')
    expect(btn.className).toMatch(/hover:bg-muted/)
  })
})
/// <reference types="vitest" />
