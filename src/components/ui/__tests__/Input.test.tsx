import { render, screen } from '@testing-library/react'
import React from 'react'
import { Input } from '../input'

describe('Input', () => {
  it('renderiza input com placeholder', () => {
    render(<Input placeholder="Digite..." />)
    const inp = screen.getByPlaceholderText('Digite...')
    expect(inp).toBeInTheDocument()
    expect(inp.className).toMatch(/border/)
  })
})
/// <reference types="vitest" />
