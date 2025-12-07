import React from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import Dashboard from './pages/Dashboard'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <Dashboard />
    </React.StrictMode>
  )
}
