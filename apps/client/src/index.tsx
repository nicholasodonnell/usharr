import './styles/index.css'

import React from 'react'
import ReactDom from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './app'
import ErrorBoundary from './components/errorBoundary'
import { ToastProvider } from './hooks/useToast'

const container = document.getElementById('root') as HTMLElement
const root = ReactDom.createRoot(container)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
)
