import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../dropdown-menu'

describe('DropdownMenu', () => {
  it('abre e fecha ao clicar no trigger', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>
          {React.createElement('button', null, 'Abrir')}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.queryByText('Item 1')).toBeNull()
    fireEvent.click(screen.getByText('Abrir'))
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Abrir'))
    expect(screen.queryByText('Item 1')).toBeNull()
  })
})
/// <reference types="vitest" />
