import React from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  const queryClient = new QueryClient()
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  )
}
